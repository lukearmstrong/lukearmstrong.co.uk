---
layout: post
date: 2012-11-04 12:30
title: "Using LESS in Production"
description: "Automate the conversion of your LESS files into a single CSS file, and minify using YUI Compressor."
published: false
---


This follows on from my previous article; [Minify your CSS and JavaScript](/2012/10/18/minify-your-css-and-javascript/).

Generally when developing, it makes sense split up your code into logical chunks, so instead of having a single CSS or JavaScript file 3000 lines long, you should split them up into smaller files for the tasks they do, or for the pages/sections of your site that they are for. This makes it much easier when working with other people, as they will know just by looking at the filenames where to find the code they need to change, and it reduces the chances of having to deal with a merge conflict because you probably won't be working in the same files at the same time.

Though, no matter how large, or how much traffic a website receives, reducing the amount of requests per page view gives a significant performance increase. So it makes sense for you to develop the site in a way which the browser only has to download one CSS file, and one JS file. Fortunately you don't have to work with one file, you can still have an easy to maintain set of source files that are used in development, and a single file which is used in production.


## less.js

Developers I work with have started to use [LESS](http://lesscss.org/) recently, unfortunately they have been using the JavaScript processor [_[less.js](https://github.com/cloudhead/less.js)_] when pushing it live, even though it should only be used in development.

_Though to be fair to them, it took me awhile to figure out how to automate the conversion of LESS to CSS when pushing to the production server, time they just didn't have when working on those sites. More often than not, you just need to get the job done, so even if it's not perfect at least it works..._


## Structuring your LESS files

Here is the folder structure:

    |-assets/
    | |-build/
    | |-img/
    | |-js/
    | | |-lib/
    | | |-src/
    | | |-vendor/
    | |-less/
    | | |-lib/
    | | |-src/
    | | |-style.less


**less/style.less** this file will only be used to _@import_ other LESS files, it should be commented and the files will be included in the specific order you require, so this is the only LESS file that will be in your `<head>` when in development.

**less/src** this folder will contain all of the LESS stylesheets you will make.

**less/lib** when downloading a jQuery plugin, you'll often get a CSS file with it. You must rename it to have a _.less_ extension for _@import_ to be handled by LESS. If you don't rename it, then it won't work, as it will be ignored by LESS as it will assume it is a normal CSS import.

**build** will contain a single minified CSS file, and a single minified JS file, the files used by the browser in production. You should never edit these files, and you should add them to your _.gitignore_ file to ensure they aren't committed.


### Download

I have created a repository on github for this article, [lukearmstrong/using-less-in-production](https://github.com/lukearmstrong/using-less-in-production). Clone it as it will make it easier to follow this article.


### less/style.less





### Gotchas

When referencing files, such as an image for a background, always reference them from the root of the public web directory, otherwise you will end up with a broken images when pushing it live. This is because in development, your files will be at a different depth from when you are in production.

    # /assets/less/src/my-stylesheet.less:
    ../../img/background.png => /assets/img/background.png  (200: Found)

    # /assets/build/style.css:
    ../../img/background.png => /img/background.png         (404: Not Found!)

    # So instead of using relative paths like this:
    background-image: url(../../img/background.png);

    # Always use full paths like this:
    background-image: url(/assets/img/background.png);


