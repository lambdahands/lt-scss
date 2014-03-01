(ns lt.plugins.scss
  (:require [clojure.string  :as string]
            [lt.object       :as object]
            [lt.objs.command :as cmd]
            [lt.objs.eval    :as eval]
            [lt.objs.editor  :as ed]
            [lt.objs.editor.pool :as pool]
            [lt.objs.files   :as files]
            [lt.objs.clients :as clients]
            [lt.objs.plugins :as plugins]
            [lt.util.dom :refer [$ append]])
  (:require-macros [lt.macros :refer [behavior defui]]))

(defn node-require [mod-path]
  (js/require (files/join plugins/user-plugins-dir mod-path)))

(def fs (node-require "scss/node_modules/fs-extra"))

(def node-sass
  (try
    (node-require "scss/node_modules/node-sass")
    (catch (.-Error js/global) e
      (let [match (re-seq #"Try reinstalling `node-sass`?" (.-message e))
            errmsg
            (str "WARNING!\n"
                 "node-sass isn't installed properly on your system.\n"
                 "Try rebuilding it using the instructionsfound here:\n"
                 "http://github.com/lambdahands/lt-scss")]
        (if (seq match) (println errmsg) (throw e))))))

(def relative-url-pattern
  ;; url() matcher. This is well documented in the CSS plugin.
  (re-pattern (str "(?m)[uU][rR][lL]\\([\"']?(?!.*?:\\/\\/)"
                   "([^\\/\"'].+?)[\"']?\\)")))

(def relative-import-pattern
  #"(?m)@import\s*?[\"'](.*)[\"'];")

(defn find-config [path]
  (loop [fp path, at-root? false]
    (let [config-path (files/join fp)
          sub-root?   (= config-path "/")
          next-path   (str config-path "/../")
          config-file (files/join config-path "./scss-config.json")
          exists?     (.existsSync fs config-file)]
      (cond
       exists?   config-file
       at-root?  false
       sub-root? (recur config-path true)
       :else     (recur next-path false)))))

(defn render-sass [data & opts]
  (let [options (merge {:data data} (first opts))]
    (.renderSync node-sass (clj->js options))))

(defn relativize-urls [[final diff] [url-call path]]
  (string/replace final url-call (str "url(\""  diff "/" path "\")")))

(defn relativize-imports [[final diff] [import-call path]]
  (string/replace final import-call (str "@import \"" diff "/" path "\";")))

(defn preprocess [file-path client-path code abs-urls abs-imports]
  (if (= "." file-path) code)
  (let [imports (re-seq relative-import-pattern code)
        urls    (distinct (re-seq relative-url-pattern code))
        diff    (files/relative (or client-path "") file-path)
        final   (if abs-urls code
                  (reduce #(relativize-urls [%1 diff] %2) code urls))]
    (if abs-imports code
      (reduce #(relativize-imports [%1 diff] %2) final imports))))

(defn create-client-specs [info origin]
  {:command :editor.eval.css
   :origin  origin
   :info    info})

(defn get-client-path [client]
  (case (:type @client)
    "LT-UI" (files/lt-home "core/")
    nil))

(defn include-libs? [path config opts]
  (if-let [includes (js->clj (aget config "includes"))]
    (let [i (map #(files/join path "/../" %) includes)]
      [true (merge opts {:includePaths (clj->js (vec i))})])
    [false opts]))

(defn finalize-code [info client-path saving]
  (let [abs-urls  (if (or saving (not client-path)) true false)
        file-path (files/parent (:path info))
        pre-code #(preprocess file-path client-path (:code info) abs-urls %)]
    (if (and saving (not (false? config-file)))
      (let [config-file (find-config file-path)
            config (.parse js/JSON (.readFileSync fs config-file))
            opts   {:outputStyle    (aget config "output-style")
                    :sourceComments (aget config "comments")}
            libs?  (include-libs? config-file config opts)
            sass   (render-sass (pre-code (first libs?)) (last libs?))]
        (. fs outputFileSync
           (files/join
            config-file "/../" (aget config "build-dir") "/"
            (string/replace (:name info) ".scss" ".css")) sass)
        sass)
      (render-sass #(pre-code false)))))

;;; Plugin Reactions

(defn react-enable-compile-on-save [this]
  (println "SCSS: Enabled compile on save.")
  (object/add-tags this [:scss-compile-save]))

(defn react-disable-compile-on-save [this]
  (println "SCSS: Disabled compile on save.")
  (object/remove-tags this [:scss-compile-save]))

(defn react-on-eval [editor]
  (let [code  (ed/->val (:ed @editor))
        info  (assoc (@editor :info) :code code)
        event {:origin editor :info info :saving false}]
    (object/raise scss-lang :eval! event)))

(defn react-eval-on-save [editor]
  (when-let [default (-> @editor :client :default)]
    (let [code  (ed/->val (:ed @editor))
          info  (assoc (@editor :info) :code code)
          save  (object/has-tag? editor :scss-compile-save)
          event {:origin editor :info info :saving (not (nil? save))}]
      (cond
       (or (nil? @default) (not (clients/placeholder? default)))
       (object/raise scss-lang :eval! event)
       save
       (finalize-code info "" save)))))

(defn react-eval! [this event]
  (let [{:keys [info origin saving]} event
        client (eval/get-client! (create-client-specs info origin))
        code (finalize-code info (get-client-path client) saving)]
    (clients/send client :editor.eval.css
                  (assoc info :code code)
                  :only origin)))

(behavior ::enable-compile-on-save
          :triggers #{:object.instant}
          :desc "SCSS: Enable compile on save"
          :reaction #(react-enable-compile-on-save %))

(behavior ::disable-compile-on-save
          :triggers #{:object.instant}
          :desc "SCSS: Disable compile on save"
          :reaction #(react-disable-compile-on-save %))

(behavior ::on-eval
          :triggers #{:eval, :eval.one}
          :reaction #(react-on-eval %))

(behavior ::eval-on-save
          :triggers #{:save}
          :reaction #(react-eval-on-save %))

(behavior ::eval!
          :triggers #{:eval!}
          :reaction #(react-eval! %1 %2))

(object/object* ::scss-lang
                :tags #{}
                :behaviors [::eval! ::eval-on-save]
                :triggers #{:eval!})

(def scss-lang (object/create ::scss-lang))

(defn toggle-compile []
  (let [enable  ::enable-compile-on-save
        disable ::disable-compile-on-save]
    (if (object/in-tag? :editor.scss enable)
      (do
        (object/remove-tag-behaviors :editor.scss [enable])
        (object/tag-behaviors :editor.scss [disable]))
      (do
        (object/remove-tag-behaviors :editor.scss [disable])
        (object/tag-behaviors :editor.scss [enable])))))

(cmd/command {:command :scss.toggle-compile
              :desc "SCSS: Toggle compile on save"
              :exec #(toggle-compile)})
