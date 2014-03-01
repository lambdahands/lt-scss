## SCSS for Light Table

An experimental SCSS plugin for Light Table.

## Installation

Installation is simple. Find the SCSS plugin in LightTable's plugin manager and click "install".

## Setup

A bit of setup is required to get this plugin up and running.

### node-sass

This plugin uses [node-sass](https://github.com/andrew/node-sass) to render SASS performantly. This package implements a C library, so the host machine's architecture taken into account. Unfortunately, this means you'll most likely have to rebuild `node-sass` using [nw-gyp](https://github.com/rogerwang/nw-gyp) so LightTable (more specifically, node-webkit) can understand we're using node-sass without looking at us like we're crazy.

I've prebuilt an OS X binary on my Mac using 10.9 Mavericks and LightTable 0.6.4.
There is also a prebuilt binary for 64bit Linux.

Other operating systems have pre-placed folders for later reference in case you're rebuilding node-sass.

Here's a step-by-step guide to get the package up and running (if this is giving you trouble, please open an issue!):

1. Open up a terminal, crack your knuckles.
2. Install nw-gyp `npm install -g nw-gyp`
3. Navigate to your plugins folder:
  - OS X: `cd ~/Library/Application Support/LightTable/plugins/`
  - Linux: `cd ~/.config/LightTable/plugins/`
  - Windows: `cd %APPDATALOCAL%/LightTable/plugins/`
4. Change directory to the SCSS plugin's node-sass build: `cd scss/node_modules/node-sass`
5. Rebuild the node-sass binary: `nw-gyp rebuild --target=0.8.4` (LightTable currently uses node-webkit 0.8.4)
6. Find the proper binary directory, labeled as `[os]-[arch]-v8-[version]`: `ls bin/`. In my case it was `darwin-ia32-v8-3.20`. **NOTE**: node-webkit seems to use Node `3.2.0` and does not currently support 64-bit versions on OS X or Windows.
7. Copy over binding.node to its respective binary directory. For example: `cp build/Release/binding.node bin/darwin-ia32-v8-3.20/binding.node`

You should be good to go! Fire up a browser tab and open a .scss file to start hacking away.

## Usage

### Evaluating Files

Evaluation occurs similarly to the CSS plugin:

`ctrl/cmd + Enter` will send the code to a client, either a browser tab or the LightTable UI. Evaluation also occurs automatically on save.

When evaluating without a configuration file, `@import` statements are currently supported, but with a stricter syntax.

SASS allows this:

```sass
@import "foo/bar", "foo/baz";
```

But you'll have to write these imports on a new line:

```sass
@import "foo/bar";
@import "foo/baz";
```

Again, you only have to follow this convention if you aren't using a configuration file with an `includes` option. See below for further details.

### Compiling CSS Files

#### Enabling the Behavior

To enable file compilation on save by default, add this to your behaviors:

```clojure
:editor.scss [(:lt.plugins.scss/enable-compile-on-save)]
```

#### Adding a Configuration File

The plugin looks a configuration file **above or next to your source files** named `scss-config.json`.

This means two things:

1. You can't place your configuration file in a sub-folder of your source file.
2. If you "nest" projects, you're in for a bad time.

Four options are currently supported:

```json
{
  "src-dir": "scss",
  "build-dir": "css",
  "output-style": "expanded",
  "includes": ["lib/"]
  "comments": true
}
```

The `src-dir` is where your .scss files live, and the `build-dir` is where you want them compiled. You can also customize the output style as `nested, expanded, compact, or compressed` and control whether or not to show comments in the output files.

You can include libraries in your configuration file, relative to the directory it lives in. The `includes` option takes an array of strings specifying the folder(s) to look in when using an `@import` statement in your code.

If you're thinking *"Hey, that's not enough options!"* then I suggest you look into a build tool like [grunt](http://gruntjs.com/) or [gulp](http://gulpjs.com/). More functionality is planned for later releases.

## Special Thanks (shoutouts)

- A big thanks to the [Node](http://nodejs.org/) and [node-webkit](https://github.com/rogerwang/node-webkit) teams for making awesome tools.
- Shoutout to Chris Granger and all of the contributors to [LightTable](http://lighttable.com)
- Thanks to [David Nolen](http://swannodette.github.io/) for sending me down the Clojure[Script] rabbit hole.
- Shoutout to [Marco Munizaga](http://marcopolo.io/) for his guidence in developing this plugin.

## License

Copyright (C) 2014 Philip Joseph.

This plugin is a modified version of the [official Light Table CSS plugin](https://github.com/LightTable/CSS).

Distributed under the GPLv3, see license.md for the full text.
