---
layout: post
date: 2013-03-12 22:00
title: "Using LESS in Production"
description: "Automate the conversion of your LESS files into a single CSS file,
and minify using YUI Compressor."
published: false
---


[LESS](http://lesscss.org/) comes with a JavaScript pre-processor which makes it
really easy to get started; [less.js](https://github.com/cloudhead/less.js)

Sass is increasing in popularity, it is seemingly more popular than LESS, but in
my opinion `less.js` makes using LESS more accessible than Sass. You don't need
to install Ruby, for the Sass gem. You don't need to remember to keep it running
to watch specific files, and you don't need to know where to output the CSS
files for the browser. It just works™.

But saying that, you **should not** use `less.js` once the site is live, so I am
going to explain what I do to use LESS in production.


## Download

I have created a repository on github for this article,
[lukearmstrong/using-less-in-production](https://github.com/lukearmstrong/using-less-in-production).
Clone it as it will make it easier to follow this article.


## Structuring your LESS files

I find it helps to break up my styles into logical chunks across several files,
but we know we should not use too many files otherwise this decreases
performance by causing the browser to make more requests than is necessary.

Fortunately, when using LESS, we can have the best of both worlds.

    |-assets/
    | |-build/
	| | |-style.css
    | |-less/
    | | |-lib/
    | | |-src/
    | | |-style.less


**/assets/less/style.less**  
This file will only be used to `@import` other LESS files,
it should be commented and the files will be included in the specific order you
require, so this is the only LESS file that will be in your `<head>` when in
development.

**/assets/less/src/**  
This folder will contain all of the LESS stylesheets you will make.

**/assets/less/lib/**  
When downloading a jQuery plugin, you'll often get a CSS file with
it. You must rename it to have a `.less` extension for `@import` to be handled
by LESS. If you don't rename it, then it won't work, as it will be ignored by
LESS as it will assume it is a normal CSS import.

**/assets/build/**  
Will contain a single minified CSS file, the file used by the browser
in production. You should never edit this file, and you should add it to
your `.gitignore` file to ensure it isn't committed.


### Relative vs Absolute urls

When referencing files, such as an image for a background, always reference them
from the root of the public web directory, otherwise you will end up with broken
images when pushing it live. This is because in development, your files will be
at a different depth from when you are in production.

	# /assets/less/src/my-stylesheet.less:
	../../img/background.png  =>  /assets/img/background.png  (200: Found)

	# /assets/build/style.css:
	../../img/background.png  =>  /img/background.png         (404: Not Found!)

	# So instead of using relative paths like this:
	background-image: url(../../img/background.png);

	# Always use absolute paths like this:
	background-image: url(/assets/img/background.png);


## Converting LESS to CSS


### Install Node.js

    sudo apt-get install python-software-properties python g++ make
	sudo add-apt-repository ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install nodejs


### Install lessc

    sudo npm install -g less
    # npm http GET https://registry.npmjs.org/less
	# npm http 408 https://registry.npmjs.org/less
	# npm ERR! registry error parsing json
	# npm http GET https://registry.npmjs.org/less
	# npm http 304 https://registry.npmjs.org/less
	# npm http GET https://registry.npmjs.org/less/-/less-1.3.3.tgz
	# npm http 200 https://registry.npmjs.org/less/-/less-1.3.3.tgz
	# npm http GET https://registry.npmjs.org/ycssmin
	# npm http 200 https://registry.npmjs.org/ycssmin
	# npm http GET https://registry.npmjs.org/ycssmin/-/ycssmin-1.0.1.tgz
	# npm http 200 https://registry.npmjs.org/ycssmin/-/ycssmin-1.0.1.tgz
	# /usr/bin/lessc -> /usr/lib/node_modules/less/bin/lessc
	# less@1.3.3 /usr/lib/node_modules/less
	# └── ycssmin@1.0.1


### Convert LESS to CSS

    lessc public/assets/less/style.less public/assets/css/style.css


### Use YUI Compressor to output minfied CSS

    lessc --yui-compress public/assets/less/style.less public/assets/css/style.css


### Ant Build Script

    <?xml version="1.0" ?>
    <project default="less" basedir=".">
    
        <target name="load.properties">
            <echo>-- Initialize Variables</echo>
    
            <property name="less.path" value="public/assets/less" />
            <echo message="less.path:   ${less.path}" />
    
            <property name="build.path" value="public/assets/build" />
            <echo message="build.path:  ${build.path}" />
    
    		<echo></echo>
    		<echo>-- Tools</echo>
    
    		<property name="lessc.path" value="ant/less/bin/lessc" />
    		<echo message="lessc.path:  ${lessc.path}" />
        </target>
    
    	<target name="less" depends="load.properties">
    		<echo>Convert LESS to CSS (Minified using YUI Compressor)</echo>
    		<echo>${lessc.path} ${less.path}/style.less > ${build.path}/style.min.css --yui-compress</echo>
    
    		<exec executable="${lessc.path}" output="${build.path}/style.min.css" failonerror="true">
    			<arg line="${less.path}/style.less" />
    			<arg line="--yui-compress" />
    		</exec>
    	</target>
    
    </project>


### Git post-receive hook

Now we need to ensure our build script is run each time we push to the live
site. On your server, create this file as your post-receive hook;
`.git/hooks/post-receive`

    #!/bin/bash
    
     
    # Hooks run from within .git/ directory
    if [ $(basename $(pwd)) == ".git" ]; then
    	cd ..
    	export GIT_DIR=.git
    fi
    
    
    # Get branch name from argument
    BRANCH_NAME=$1
    
     
    # Default to master branch
    if [ -z "$BRANCH_NAME" ]; then
            BRANCH_NAME=master
    fi
    
     
    # Checkout to latest revision in branch, without checking out branch
    git checkout $(git rev-parse $BRANCH_NAME)
    git reset --hard HEAD
    git submodule update --init
     
     
    # Run Build Script 
    ant







## Futher Reading

This follows on from my previous article; [Minify your CSS and
JavaScript](/2012/10/18/minify-your-css-and-javascript/).


---


- style.less
- command line lessc
- ant build script
- .gitignore
- git post-receive hook

