if(!lt.util.load.provided_QMARK_('lt.plugins.scss')) {
goog.provide('lt.plugins.scss');
goog.require('cljs.core');
goog.require('lt.util.dom');
goog.require('lt.objs.plugins');
goog.require('lt.objs.files');
goog.require('lt.util.dom');
goog.require('lt.objs.editor.pool');
goog.require('clojure.string');
goog.require('lt.objs.command');
goog.require('lt.objs.files');
goog.require('lt.objs.plugins');
goog.require('lt.objs.eval');
goog.require('lt.objs.clients');
goog.require('clojure.string');
goog.require('lt.objs.editor');
goog.require('lt.object');
goog.require('lt.object');
goog.require('lt.objs.eval');
goog.require('lt.objs.clients');
goog.require('lt.objs.editor.pool');
goog.require('lt.objs.command');
goog.require('lt.objs.editor');
lt.plugins.scss.node_require = (function node_require(mod_path){return require(lt.objs.files.join.call(null,lt.objs.plugins.user_plugins_dir,mod_path));
});
lt.plugins.scss.fs = lt.plugins.scss.node_require.call(null,"scss/node_modules/fs-extra");
lt.plugins.scss.node_sass = (function (){try{return lt.plugins.scss.node_require.call(null,"scss/node_modules/node-sass");
}catch (e9420){if(cljs.core.truth_((function (){var t__6842__auto__ = global.Error;var o__6843__auto__ = e9420;return (o__6843__auto__ instanceof t__6842__auto__);
})()))
{var e = e9420;var match = cljs.core.re_seq.call(null,/Try reinstalling `node-sass`?/,e.message);var errmsg = [cljs.core.str("WARNING!\n"),cljs.core.str("node-sass isn't installed properly on your system.\n"),cljs.core.str("Try rebuilding it using the instructionsfound here:\n"),cljs.core.str("http://github.com/lambdahands/lt-scss")].join('');if(cljs.core.seq.call(null,match))
{return cljs.core.println.call(null,errmsg);
} else
{throw e;
}
} else
{if(new cljs.core.Keyword(null,"else","else",1017020587))
{throw e9420;
} else
{return null;
}
}
}})();
lt.plugins.scss.relative_url_pattern = cljs.core.re_pattern.call(null,[cljs.core.str("(?m)[uU][rR][lL]\\([\"']?(?!.*?:\\/\\/)"),cljs.core.str("([^\\/\"'].+?)[\"']?\\)")].join(''));
lt.plugins.scss.relative_import_pattern = /@import\s*?[\"'](.*)[\"'];/m;
lt.plugins.scss.find_config = (function find_config(path){var fp = path;var at_root_QMARK_ = false;while(true){
var config_path = lt.objs.files.join.call(null,fp);var sub_root_QMARK_ = cljs.core._EQ_.call(null,config_path,"/");var next_path = [cljs.core.str(config_path),cljs.core.str("/../")].join('');var config_file = lt.objs.files.join.call(null,config_path,"./scss-config.json");var exists_QMARK_ = lt.plugins.scss.fs.existsSync(config_file);if(cljs.core.truth_(exists_QMARK_))
{return config_file;
} else
{if(at_root_QMARK_)
{return false;
} else
{if(sub_root_QMARK_)
{{
var G__9449 = config_path;
var G__9450 = true;
fp = G__9449;
at_root_QMARK_ = G__9450;
continue;
}
} else
{if(new cljs.core.Keyword(null,"else","else",1017020587))
{{
var G__9451 = next_path;
var G__9452 = false;
fp = G__9451;
at_root_QMARK_ = G__9452;
continue;
}
} else
{return null;
}
}
}
}
break;
}
});
/**
* @param {...*} var_args
*/
lt.plugins.scss.render_sass = (function() { 
var render_sass__delegate = function (data,opts){var options = cljs.core.merge.call(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data","data",1016980252),data], null),cljs.core.first.call(null,opts));return lt.plugins.scss.node_sass.renderSync(cljs.core.clj__GT_js.call(null,options));
};
var render_sass = function (data,var_args){
var opts = null;if (arguments.length > 1) {
  opts = cljs.core.array_seq(Array.prototype.slice.call(arguments, 1),0);} 
return render_sass__delegate.call(this,data,opts);};
render_sass.cljs$lang$maxFixedArity = 1;
render_sass.cljs$lang$applyTo = (function (arglist__9453){
var data = cljs.core.first(arglist__9453);
var opts = cljs.core.rest(arglist__9453);
return render_sass__delegate(data,opts);
});
render_sass.cljs$core$IFn$_invoke$arity$variadic = render_sass__delegate;
return render_sass;
})()
;
lt.plugins.scss.relativize_urls = (function relativize_urls(p__9421,p__9422){var vec__9425 = p__9421;var final$ = cljs.core.nth.call(null,vec__9425,0,null);var diff = cljs.core.nth.call(null,vec__9425,1,null);var vec__9426 = p__9422;var url_call = cljs.core.nth.call(null,vec__9426,0,null);var path = cljs.core.nth.call(null,vec__9426,1,null);return clojure.string.replace.call(null,final$,url_call,[cljs.core.str("url(\""),cljs.core.str(diff),cljs.core.str("/"),cljs.core.str(path),cljs.core.str("\")")].join(''));
});
lt.plugins.scss.relativize_imports = (function relativize_imports(p__9427,p__9428){var vec__9431 = p__9427;var final$ = cljs.core.nth.call(null,vec__9431,0,null);var diff = cljs.core.nth.call(null,vec__9431,1,null);var vec__9432 = p__9428;var import_call = cljs.core.nth.call(null,vec__9432,0,null);var path = cljs.core.nth.call(null,vec__9432,1,null);return clojure.string.replace.call(null,final$,import_call,[cljs.core.str("@import \""),cljs.core.str(diff),cljs.core.str("/"),cljs.core.str(path),cljs.core.str("\";")].join(''));
});
lt.plugins.scss.preprocess = (function preprocess(file_path,client_path,code,abs_urls,abs_imports){if(cljs.core._EQ_.call(null,".",file_path))
{} else
{}
var imports = cljs.core.re_seq.call(null,lt.plugins.scss.relative_import_pattern,code);var urls = cljs.core.distinct.call(null,cljs.core.re_seq.call(null,lt.plugins.scss.relative_url_pattern,code));var diff = lt.objs.files.relative.call(null,(function (){var or__6757__auto__ = client_path;if(cljs.core.truth_(or__6757__auto__))
{return or__6757__auto__;
} else
{return "";
}
})(),file_path);var final$ = (cljs.core.truth_(abs_urls)?code:cljs.core.reduce.call(null,((function (imports,urls,diff){
return (function (p1__9433_SHARP_,p2__9434_SHARP_){return lt.plugins.scss.relativize_urls.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__9433_SHARP_,diff], null),p2__9434_SHARP_);
});})(imports,urls,diff))
,code,urls));if(cljs.core.truth_(abs_imports))
{return code;
} else
{return cljs.core.reduce.call(null,(function (p1__9435_SHARP_,p2__9436_SHARP_){return lt.plugins.scss.relativize_imports.call(null,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [p1__9435_SHARP_,diff], null),p2__9436_SHARP_);
}),final$,imports);
}
});
lt.plugins.scss.create_client_specs = (function create_client_specs(info,origin){return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"editor.eval.css","editor.eval.css",1083014276),new cljs.core.Keyword(null,"origin","origin",4300251800),origin,new cljs.core.Keyword(null,"info","info",1017141280),info], null);
});
lt.plugins.scss.get_client_path = (function get_client_path(client){var G__9438 = new cljs.core.Keyword(null,"type","type",1017479852).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,client));if(cljs.core._EQ_.call(null,"LT-UI",G__9438))
{return lt.objs.files.lt_home.call(null,"core/");
} else
{if(new cljs.core.Keyword(null,"else","else",1017020587))
{return null;
} else
{return null;
}
}
});
lt.plugins.scss.include_libs_QMARK_ = (function include_libs_QMARK_(path,config,opts){var temp__4090__auto__ = cljs.core.js__GT_clj.call(null,(config["includes"]));if(cljs.core.truth_(temp__4090__auto__))
{var includes = temp__4090__auto__;var i = cljs.core.map.call(null,(function (p1__9439_SHARP_){return lt.objs.files.join.call(null,path,"/../",p1__9439_SHARP_);
}),includes);return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [true,cljs.core.merge.call(null,opts,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"includePaths","includePaths",949844120),cljs.core.clj__GT_js.call(null,cljs.core.vec.call(null,i))], null))], null);
} else
{return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [false,opts], null);
}
});
lt.plugins.scss.finalize_code = (function finalize_code(info,client_path,saving){var abs_urls = (cljs.core.truth_((function (){var or__6757__auto__ = saving;if(cljs.core.truth_(or__6757__auto__))
{return or__6757__auto__;
} else
{return cljs.core.not.call(null,client_path);
}
})())?true:false);var file_path = lt.objs.files.parent.call(null,new cljs.core.Keyword(null,"path","path",1017337751).cljs$core$IFn$_invoke$arity$1(info));var pre_code = ((function (abs_urls,file_path){
return (function (p1__9440_SHARP_){return lt.plugins.scss.preprocess.call(null,file_path,client_path,new cljs.core.Keyword(null,"code","code",1016963423).cljs$core$IFn$_invoke$arity$1(info),abs_urls,p1__9440_SHARP_);
});})(abs_urls,file_path))
;if(cljs.core.truth_((function (){var and__6745__auto__ = saving;if(cljs.core.truth_(and__6745__auto__))
{return !(lt.plugins.scss.config_file === false);
} else
{return and__6745__auto__;
}
})()))
{var config_file = lt.plugins.scss.find_config.call(null,file_path);var config = JSON.parse(lt.plugins.scss.fs.readFileSync(config_file));var opts = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"outputStyle","outputStyle",4473389218),(config["output-style"]),new cljs.core.Keyword(null,"sourceComments","sourceComments",3342946977),(config["comments"])], null);var libs_QMARK_ = lt.plugins.scss.include_libs_QMARK_.call(null,config_file,config,opts);var sass = lt.plugins.scss.render_sass.call(null,pre_code.call(null,cljs.core.first.call(null,libs_QMARK_)),cljs.core.last.call(null,libs_QMARK_));lt.plugins.scss.fs.outputFileSync(lt.objs.files.join.call(null,config_file,"/../",(config["build-dir"]),"/",clojure.string.replace.call(null,new cljs.core.Keyword(null,"name","name",1017277949).cljs$core$IFn$_invoke$arity$1(info),".scss",".css")),sass);
return sass;
} else
{return lt.plugins.scss.render_sass.call(null,(function (){return pre_code.call(null,false);
}));
}
});
lt.plugins.scss.react_enable_compile_on_save = (function react_enable_compile_on_save(this$){cljs.core.println.call(null,"SCSS: Enabled compile on save.");
return lt.object.add_tags.call(null,this$,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"scss-compile-save","scss-compile-save",2063130182)], null));
});
lt.plugins.scss.react_disable_compile_on_save = (function react_disable_compile_on_save(this$){cljs.core.println.call(null,"SCSS: Disabled compile on save.");
return lt.object.remove_tags.call(null,this$,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"scss-compile-save","scss-compile-save",2063130182)], null));
});
lt.plugins.scss.react_on_eval = (function react_on_eval(editor){var code = lt.objs.editor.__GT_val.call(null,new cljs.core.Keyword(null,"ed","ed",1013907473).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,editor)));var info = cljs.core.assoc.call(null,cljs.core.deref.call(null,editor).call(null,new cljs.core.Keyword(null,"info","info",1017141280)),new cljs.core.Keyword(null,"code","code",1016963423),code);var event = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"origin","origin",4300251800),editor,new cljs.core.Keyword(null,"info","info",1017141280),info,new cljs.core.Keyword(null,"saving","saving",4399457900),false], null);return lt.object.raise.call(null,lt.plugins.scss.scss_lang,new cljs.core.Keyword(null,"eval!","eval!",1110791799),event);
});
lt.plugins.scss.react_eval_on_save = (function react_eval_on_save(editor){var temp__4092__auto__ = new cljs.core.Keyword(null,"default","default",2558708147).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"client","client",3951159101).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,editor)));if(cljs.core.truth_(temp__4092__auto__))
{var default$ = temp__4092__auto__;var code = lt.objs.editor.__GT_val.call(null,new cljs.core.Keyword(null,"ed","ed",1013907473).cljs$core$IFn$_invoke$arity$1(cljs.core.deref.call(null,editor)));var info = cljs.core.assoc.call(null,cljs.core.deref.call(null,editor).call(null,new cljs.core.Keyword(null,"info","info",1017141280)),new cljs.core.Keyword(null,"code","code",1016963423),code);var save = lt.object.has_tag_QMARK_.call(null,editor,new cljs.core.Keyword(null,"scss-compile-save","scss-compile-save",2063130182));var event = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"origin","origin",4300251800),editor,new cljs.core.Keyword(null,"info","info",1017141280),info,new cljs.core.Keyword(null,"saving","saving",4399457900),!((save == null))], null);if(((cljs.core.deref.call(null,default$) == null)) || (cljs.core.not.call(null,lt.objs.clients.placeholder_QMARK_.call(null,default$))))
{return lt.object.raise.call(null,lt.plugins.scss.scss_lang,new cljs.core.Keyword(null,"eval!","eval!",1110791799),event);
} else
{if(cljs.core.truth_(save))
{return lt.plugins.scss.finalize_code.call(null,info,"",save);
} else
{return null;
}
}
} else
{return null;
}
});
lt.plugins.scss.react_eval_BANG_ = (function react_eval_BANG_(this$,event){var map__9442 = event;var map__9442__$1 = ((cljs.core.seq_QMARK_.call(null,map__9442))?cljs.core.apply.call(null,cljs.core.hash_map,map__9442):map__9442);var saving = cljs.core.get.call(null,map__9442__$1,new cljs.core.Keyword(null,"saving","saving",4399457900));var origin = cljs.core.get.call(null,map__9442__$1,new cljs.core.Keyword(null,"origin","origin",4300251800));var info = cljs.core.get.call(null,map__9442__$1,new cljs.core.Keyword(null,"info","info",1017141280));var client = lt.objs.eval.get_client_BANG_.call(null,lt.plugins.scss.create_client_specs.call(null,info,origin));var code = lt.plugins.scss.finalize_code.call(null,info,lt.plugins.scss.get_client_path.call(null,client),saving);return lt.objs.clients.send.call(null,client,new cljs.core.Keyword(null,"editor.eval.css","editor.eval.css",1083014276),cljs.core.assoc.call(null,info,new cljs.core.Keyword(null,"code","code",1016963423),code),new cljs.core.Keyword(null,"only","only",1017320222),origin);
});
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.scss","enable-compile-on-save","lt.plugins.scss/enable-compile-on-save",1851830550),new cljs.core.Keyword(null,"reaction","reaction",4441361819),(function (p1__9443_SHARP_){return lt.plugins.scss.react_enable_compile_on_save.call(null,p1__9443_SHARP_);
}),new cljs.core.Keyword(null,"desc","desc",1016984067),"SCSS: Enable compile on save",new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"object.instant","object.instant",773332388),null], null), null));
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.scss","disable-compile-on-save","lt.plugins.scss/disable-compile-on-save",2861372851),new cljs.core.Keyword(null,"reaction","reaction",4441361819),(function (p1__9444_SHARP_){return lt.plugins.scss.react_disable_compile_on_save.call(null,p1__9444_SHARP_);
}),new cljs.core.Keyword(null,"desc","desc",1016984067),"SCSS: Disable compile on save",new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"object.instant","object.instant",773332388),null], null), null));
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.scss","on-eval","lt.plugins.scss/on-eval",3492501009),new cljs.core.Keyword(null,"reaction","reaction",4441361819),(function (p1__9445_SHARP_){return lt.plugins.scss.react_on_eval.call(null,p1__9445_SHARP_);
}),new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"eval.one","eval.one",1173589382),null,new cljs.core.Keyword(null,"eval","eval",1017029646),null], null), null));
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.scss","eval-on-save","lt.plugins.scss/eval-on-save",3652751169),new cljs.core.Keyword(null,"reaction","reaction",4441361819),(function (p1__9446_SHARP_){return lt.plugins.scss.react_eval_on_save.call(null,p1__9446_SHARP_);
}),new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"save","save",1017427183),null], null), null));
lt.object.behavior_STAR_.call(null,new cljs.core.Keyword("lt.plugins.scss","eval!","lt.plugins.scss/eval!",4422308044),new cljs.core.Keyword(null,"reaction","reaction",4441361819),(function (p1__9447_SHARP_,p2__9448_SHARP_){return lt.plugins.scss.react_eval_BANG_.call(null,p1__9447_SHARP_,p2__9448_SHARP_);
}),new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"eval!","eval!",1110791799),null], null), null));
lt.object.object_STAR_.call(null,new cljs.core.Keyword("lt.plugins.scss","scss-lang","lt.plugins.scss/scss-lang",825267954),new cljs.core.Keyword(null,"tags","tags",1017456523),cljs.core.PersistentHashSet.EMPTY,new cljs.core.Keyword(null,"behaviors","behaviors",607554515),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("lt.plugins.scss","eval!","lt.plugins.scss/eval!",4422308044),new cljs.core.Keyword("lt.plugins.scss","eval-on-save","lt.plugins.scss/eval-on-save",3652751169)], null),new cljs.core.Keyword(null,"triggers","triggers",2516997421),new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"eval!","eval!",1110791799),null], null), null));
lt.plugins.scss.scss_lang = lt.object.create.call(null,new cljs.core.Keyword("lt.plugins.scss","scss-lang","lt.plugins.scss/scss-lang",825267954));
lt.plugins.scss.toggle_compile = (function toggle_compile(){var enable = new cljs.core.Keyword("lt.plugins.scss","enable-compile-on-save","lt.plugins.scss/enable-compile-on-save",1851830550);var disable = new cljs.core.Keyword("lt.plugins.scss","disable-compile-on-save","lt.plugins.scss/disable-compile-on-save",2861372851);if(cljs.core.truth_(lt.object.in_tag_QMARK_.call(null,new cljs.core.Keyword(null,"editor.scss","editor.scss",4270698499),enable)))
{lt.object.remove_tag_behaviors.call(null,new cljs.core.Keyword(null,"editor.scss","editor.scss",4270698499),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [enable], null));
return lt.object.tag_behaviors.call(null,new cljs.core.Keyword(null,"editor.scss","editor.scss",4270698499),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [disable], null));
} else
{lt.object.remove_tag_behaviors.call(null,new cljs.core.Keyword(null,"editor.scss","editor.scss",4270698499),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [disable], null));
return lt.object.tag_behaviors.call(null,new cljs.core.Keyword(null,"editor.scss","editor.scss",4270698499),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [enable], null));
}
});
lt.objs.command.command.call(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",1964298941),new cljs.core.Keyword(null,"scss.toggle-compile","scss.toggle-compile",665465130),new cljs.core.Keyword(null,"desc","desc",1016984067),"SCSS: Toggle compile on save",new cljs.core.Keyword(null,"exec","exec",1017031683),(function (){return lt.plugins.scss.toggle_compile.call(null);
})], null));
}

//# sourceMappingURL=scss_compiled.js.map