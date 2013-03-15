---
layout: post
date: 2013-03-12 22:00
title: "Using LESS in Production"
description: "Automate the conversion of your LESS files into a single CSS file,
and minify using YUI Compressor."
published: false
---


This follows on from my previous article; [Minify your CSS and
JavaScript](/2012/10/18/minify-your-css-and-javascript/).

## less.js

[LESS](http://lesscss.org/) comes with a JavaScript pre-processor which makes it
really easy to get started; [less.js](https://github.com/cloudhead/less.js)

Sass is increasing in popularity, it is seemingly more popular than LESS, but in
my opinion `less.js` makes using LESS more accessible than Sass. You don't need
to install Ruby, for the Sass gem. You don't need to remember to keep it running
to watch specific files, and you don't need to know where to output the CSS
files for the browser. It just works™.

But saying that, you **should not** use `less.js` once the site is live, so I am
going to explain what I do to use LESS in production.



- style.less
- command line lessc
- ant build script
- .gitignore
- git post-receive hook




### Download

I have created a repository on github for this article,
[lukearmstrong/using-less-in-production](https://github.com/lukearmstrong/using-less-in-production).
Clone it as it will make it easier to follow this article.


## Structuring your LESS files

Here is the folder structure:

    |-assets/
    | |-build/
    | |-less/
    | | |-lib/
    | | |-src/
    | | |-style.less


**less/style.less** this file will only be used to _@import_ other LESS files,
it should be commented and the files will be included in the specific order you
require, so this is the only LESS file that will be in your `<head>` when in
development.

**less/src** this folder will contain all of the LESS stylesheets you will make.

**less/lib** when downloading a jQuery plugin, you'll often get a CSS file with
it. You must rename it to have a _.less_ extension for _@import_ to be handled
by LESS. If you don't rename it, then it won't work, as it will be ignored by
LESS as it will assume it is a normal CSS import.

**build** will contain a single minified CSS file, and a single minified JS
file, the files used by the browser in production. You should never edit these
files, and you should add them to your _.gitignore_ file to ensure they aren't
committed.


### less/style.less





### Gotchas

#### Rename .css files to have a .less extension

when downloading a jQuery plugin, you'll often get a CSS file with
it. You must rename it to have a _.less_ extension for _@import_ to be handled
by LESS. If you don't rename it, then it won't work, as it will be ignored by
LESS as it will assume it is a normal CSS import.


#### Relative vs Absolute urls

When referencing files, such as an image for a background, always reference them
from the root of the public web directory, otherwise you will end up with a
broken images when pushing it live. This is because in development, your files
will be at a different depth from when you are in production.

	# /assets/less/src/my-stylesheet.less:
	../../img/background.png  =>  /assets/img/background.png  (200: Found)

	# /assets/build/style.css:
	../../img/background.png  =>  /img/background.png         (404: Not Found!)

	# So instead of using relative paths like this:
	background-image: url(../../img/background.png);

	# Always use absolute paths like this:
	background-image: url(/assets/img/background.png);


## Converting LESS to CSS

Command Line

### Ant Build Script

### Git

As you should
