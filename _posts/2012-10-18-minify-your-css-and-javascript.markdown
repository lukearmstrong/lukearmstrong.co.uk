---
layout: post
date: 2012-10-18 02:30
title: "Minify your CSS and JavaScript"
description: "Use Apache Ant, YUI Compressor and Google Closure Compiler to concatenate and minify your CSS and JavaScript."
---

What I am about to explain is nothing new. So I'm not going to explain why you should be doing this, you should already know, my aim is to show you how I have done it.

I first started reading up on optimizing the front-end over 4 years ago, thanks to the [research done at Yahoo!](http://developer.yahoo.com/performance/); Yet in all that time I have only done it on three sites.

#### TL;DR?

* Concatenating your CSS/JS into one file significantly reduces the number of requests to your server for each page load.
* Some (?) browsers can only make a maximum of 2 simultanous requests per domain.
* Requests can be expensive, though [using a server like Nginx](/2012/10/06/lemp-linux-nginx-mysql-php/) can help reduce the resources required to handle them.
* Minification reduces file size, significantly, thus reducing the time a user spends loading your site, and your bandwidth bill.


#### People are scared of doing this, they worry that...

* Things will suddenly stop working because the concatenation/minification process has buggered up their CSS/JS.
* It will take too long to set up a process to push changes to a live site.
* It may cause issues when working with a team.

The first issue is resolved by writing CSS and JavaScript that can be safely included on all pages on your site. If you aren't already doing this, dafuq are you doing?

The second issue is resolved by reading this article.

The third issue isn't an issue, providing you aren't an asshole about it. When working on a site, especially a site that is currently live but you haven't worked on, you just need to get something done. The key is to ensure you don't bugger people about by expecting them to add references to files to several different files. This article explains that you can just chuck a CSS or JS file in a directory, and the site will use it in development, and your server will include it when concatenating and minifying your files when pushing it live. No buggering about with including the files in the HTML, or in the build script, it should just work.

The latest site I have done this on has had more than 20 different people working on it, making changes on it on almost a daily basis for the past year, and seemingly this process didn't get in their way.

_I expect people I work with to tell me I am doing something that is a pain in the arse, and this method hasn't resulted in anything being thrown at me yet, so I can only assume people are happy with it._


## Requirements

To do this, we are going to be using [Apache Ant](http://ant.apache.org/), [YUI Compressor](http://yuilibrary.com/projects/yuicompressor/) and [Google Closure Compiler](https://developers.google.com/closure/compiler/). All free, cross-platform software.


### Apache Ant

This will be our build tool. We will set up an XML file telling it where our CSS and JS files live, and it will concatenate them into a single file to be run through our minification tools.

**Linux:** It is simple enough to install this from your package manager, on Ubuntu (and I presume Debian):

{% highlight sh %}
sudo apt-get install default-jdk ant ant-contrib
{% endhighlight %}

**Windows:** It can be a pain in the arse to install Ant on Windows, luckily [WinAnt](http://code.google.com/p/winant/) makes this process much easier.

**Mac:** [Ports](http://html5boilerplate.com/docs/Build-script/#if-youre-on-mac-or-linux) or [Brew](http://www.calvinfroedge.com/installing-apache-ant-with-homebrew-on-mac-os-x/)? Sorry I can't be of any more help, I would like a Macbook Air, but I am too poor to buy one... though I will have one, one day... one day [my precious](http://www.apple.com/uk/macbookair/)...


### YUI Compressor

This will be used to minify our CSS.

**Download:** <http://yuilibrary.com/download/yuicompressor/>


### Google Closure Compiler

This will be used to minify our JavaScript.

**Download:** <http://closure-compiler.googlecode.com/files/compiler-latest.zip>

*On several occassions now this tool has warned us of bugs in our code, stuff like a trailing comma in an array or object, thus pointing out things that won't work in Internet Explorer but will generally work in other browsers. Google have also released something called [Google Closure Linter](https://developers.google.com/closure/utilities/), and there are also other Lint tools out there; such as [JS Lint](http://jslint.com/), though I haven't used either yet.*



## A warning about testing in Internet Explorer

> Removal of Style Sheet Limits  
> In Internet Explorer 9 and earlier, there is a limit of 31 style sheets per webpage. There is also a nesting limit of four levels deep for style sheets that are linked using @import rules.  
> In Internet Explorer 10 (as well as Metro style apps using JavaScript), this limit has been removed. There is no limit to the number of style sheets you can reference per webpage in Internet Explorer 10 or Metro style apps using JavaScript for Windows 8. You are also not limited in the number of times you can nest @import rules inside style sheets.

**Source:** <http://msdn.microsoft.com/library/ie/hh673536.aspx#removal_of_style_sheet_limits>  


## Research

There are various ways of achieving what I have explained, so here are a few things to read up about.


### HTML5 Boilerplate

This project has a build script, they've gone a little bit further than I have, so I recommend you [read up about it](http://html5boilerplate.com/docs/Build-script/). I haven't yet, but I've been meaning to look into compressing images too.


### Ruby on Rails: Asset Pipeline

I've used this and my god I wish I had discovered it before swearing at Ant for hours on end trying to translate simple terminal commands into XML. But alas, we use PHP where I work. Even if you don't use Ruby on Rails, it's always worth reading up about other languages and frameworks because [it might give you some ideas](http://guides.rubyonrails.org/asset_pipeline.html).


### Getting PHP to minify the files when they have changed.

The PHP implementations I have seen of this approach are stupid. It just doesn't make any sense...

* It is inefficient to serve your static assets via PHP, your web server can handle these requests much faster.
* I haven't seen a PHP implementation beat alternatives on filesize.
* It takes time to minify the files, imagine if your request was the one held up for 10 seconds whilst the files were being minified.
* If more than one request triggers the css/js files to be minified, will the server attempt to minify it more than once?

**Just dont do it.** PHP does not have any _"middleware"_, so anything you do using PHP will impact on how quickly a request is handled; No amount of caching will negate that. Besides, the only time your CSS or JavaScript changes is when YOU change them, so the answer couldn't be simpler - when you change them, minify them!

This leads us onto...


## The solution!

Where you are unable to use the Ruby on Rails asset pipline, for example a site that uses PHP, your best bet is to use Ant to handle this for you.

I have made a repository on Github to show all of the files I am working with, please clone it and play with it as it is getting rather late and I'm on my second bottle of Sauvignon Blanc, so I'm not sure how much longer I can be arsed to explain this...

**GitHub:** [lukearmstrong/minify-css-js](https://github.com/lukearmstrong/minify-css-js/)

### My Ant Build Script...

When you run `ant` in a folder, it will look for a file called `build.xml`, which contains instructions for commands to run. I have added a lot of output text to the example below, so hopefully you can see that the code required for the actual commands is very simple.

#### build.xml [[source]](https://github.com/lukearmstrong/minify-css-js/blob/master/build.xml)

{% highlight xml %}
<?xml version="1.0" ?>
<project default="default" basedir=".">


    <target name="default" depends="load.properties, css.concatenate, css.minify, js.concatenate, js.minify" />


    <target name="load.properties">
        <echo>Initialize Variables</echo>

        <property name="css.path" value="public/css" />
        <echo message="css.path:                   ${css.path}" />

        <property name="js.path" value="public/js" />
        <echo message="js.path:                    ${js.path}" />

        <property name="build.path" value="public/build" />
        <echo message="build.path:                 ${build.path}" />

        <property name="yuiCompressor.path" value="ant/yuicompressor-2.4.7.jar" />
        <echo message="yuiCompressor.path:         ${yuiCompressor.path}" />

        <property name="googleClosureCompiler.path" value="ant/compiler.jar" />
        <echo message="googleClosureCompiler.path: ${googleClosureCompiler.path}" />
    </target>


    <target name="css.concatenate" depends="load.properties">
        <echo># Concatenate CSS files:</echo>
        <echo>cat ${css.path}/1-normalize.css  >  ${build.path}/style.css</echo>
        <echo>cat ${css.path}/2-base.css       >> ${build.path}/style.css</echo>
        <echo>cat ${css.path}/screen/*.css     >> ${build.path}/style.css</echo>
        <echo>cat ${css.path}/3-helpers.css    >> ${build.path}/style.css</echo>
        <echo>cat ${css.path}/4-responsive.css >> ${build.path}/style.css</echo>
        <echo>cat ${css.path}/responsive/*.css >> ${build.path}/style.css</echo>
        <echo>cat ${css.path}/5-print.css      >> ${build.path}/style.css</echo>
        <echo>cat ${css.path}/print/*.css      >> ${build.path}/style.css</echo>

        <concat destfile="${build.path}/style.css" encoding="UTF-8" eol="lf" fixlastline="yes" outputencoding="UTF-8">
            <filelist dir="${css.path}" files="1-normalize.css" />
            <filelist dir="${css.path}" files="2-base.css" />
            <fileset dir="${css.path}/screen/">
                <include name="*.css" />
            </fileset>
            <filelist dir="${css.path}/" files="3-helpers.css" />
            <filelist dir="${css.path}/" files="4-responsive.css" />
            <fileset dir="${css.path}/responsive/">
                <include name="*.css" />
            </fileset>
            <filelist dir="${css.path}/" files="5-print.css" />
            <fileset dir="${css.path}/print/">
                <include name="*.css" />
            </fileset>
        </concat>
    </target>


    <target name="css.minify" depends="load.properties">
        <echo># Minify CSS using YUI Compressor:</echo>
        <echo>java -jar ${yuiCompressor.path} ${build.path}/style.css -o ${build.path}/style.min.css</echo>

        <apply executable="java" parallel="false">
            <fileset dir="${build.path}" includes="style.css" />
            <mapper type="glob" from="style.css" to="${build.path}/style.min.css" />
            <arg line="-jar" />
            <arg path="${yuiCompressor.path}" />
            <srcfile />
            <arg line="-o" />
            <targetfile />
        </apply>
    </target>


    <target name="js.concatenate" depends="load.properties">
        <echo># Concatenate JS files:</echo>
        <echo>cat ${js.path}/lib/*.js >  ${build.path}/scripts.js</echo>
        <echo>cat ${js.path}/src/*.js >> ${build.path}/scripts.js</echo>

        <concat destfile="${build.path}/scripts.js" encoding="UTF-8" eol="lf" fixlastline="yes" outputencoding="UTF-8">
            <fileset dir="${js.path}/lib/">
                <include name="*.js" />
            </fileset>
            <fileset dir="${js.path}/src/">
                <include name="*.js" />
            </fileset>
        </concat>
    </target>


    <target name="js.minify" depends="load.properties">
        <echo># Minify JavaScript using Google Closure Compiler:</echo>
        <echo>java -jar ${googleClosureCompiler.path} --js ${build.path}/scripts.js --js_output_file ${build.path}/scripts.min.js</echo>

        <apply executable="java" parallel="false">
            <fileset dir="${build.path}" includes="scripts.js" />
            <mapper type="glob" from="scripts.js" to="${build.path}/scripts.min.js" />
            <arg line="-jar" />
            <arg path="${googleClosureCompiler.path}" />
            <arg line="--js" />
            <srcfile />
            <arg line="--js_output_file" />
            <targetfile />
        </apply>
    </target>	


</project>
{% endhighlight %}

Now when you run `ant`, it will concatenate all of your CSS files into `public/build/style.css`, and then use YUI Compressor to minify them to `public/build/style.min.css`.

Then it will concatenate all of your JavaScript files into `public/build/scripts.js`, and use Google Closure Compiler to minify them to `public/build/scripts.min.js`.

{% highlight sh %}
ant

# Buildfile: /var/www/minify-css-js/build.xml
# 
# load.properties:
#      [echo] Initialize Variables
#      [echo] css.path:                   public/css
#      [echo] js.path:                    public/js
#      [echo] build.path:                 public/build
#      [echo] yuiCompressor.path:         ant/yuicompressor-2.4.7.jar
#      [echo] googleClosureCompiler.path: ant/compiler.jar
# 
# css.concatenate:
#      [echo] # Concatenate CSS files:
#      [echo] cat public/css/1-normalize.css  >  public/build/style.css
#      [echo] cat public/css/2-base.css       >> public/build/style.css
#      [echo] cat public/css/screen/*.css     >> public/build/style.css
#      [echo] cat public/css/3-helpers.css    >> public/build/style.css
#      [echo] cat public/css/4-responsive.css >> public/build/style.css
#      [echo] cat public/css/responsive/*.css >> public/build/style.css
#      [echo] cat public/css/5-print.css      >> public/build/style.css
#      [echo] cat public/css/print/*.css      >> public/build/style.css
# 
# css.minify:
#      [echo] # Minify CSS using YUI Compressor:
#      [echo] java -jar ant/yuicompressor-2.4.7.jar public/build/style.css -o public/build/style.min.css
# 
# js.concatenate:
#      [echo] # Concatenate JS files:
#      [echo] cat public/js/lib/*.css >  public/build/scripts.js
#      [echo] cat public/js/src/*.css >> public/build/scripts.js
# 
# js.minify:
#      [echo] # Minify JavaScript using Google Closure Compiler:
#      [echo] java -jar ant/compiler.jar --js public/build/scripts.js --js_output_file public/build/scripts.min.js
# 
# default:
# 
# BUILD SUCCESSFUL
# Total time: 4 seconds
{% endhighlight %}


#### index.php [[source]](https://github.com/lukearmstrong/minify-css-js/blob/master/public/index.php)

As an example I am using the [HTML5 Boilerplate](http://html5boilerplate.com/) HTML, CSS and JavaScript. You will notice that I have split the CSS file into smaller files to allow me to include our site specific CSS/JS between the various parts of it.

This is purely an example, and you may want to change this to suit your needs, but it just demonstrates that you can develop using any number of files, split into logical files/directories, and have a generic solution that can be used for any project. Just because your users will benefit from having all of their CSS and JS in a file for each, doesn't mean that you have to create a single file and write all of your code in it.

Sure, it doesn't really matter if you are just working on your own, but a guaranteed way of pissing everyone off in your team is to put all the things in one file, because you will spend an awful lot of time buggering about with merge conflicts.

##### CSS

The idea is that you add files to the directories; `public/css/screen`, `public/css/responsive`, `public/css/print` - and the site and the build script will use them.

##### JS

With javascript there are 3 directories setup:

* `public/js/vendor` this contains files you need to use separately, for example I have jquery, modernizr, and dd_belatedPNG.  
* `public/js/lib` this contains files that will be concatenated and minified first, so you should put things in this folder such as jQuery plugins, etc, that the rest of your JavaScript relies on.  
* `public/js/src` this contains files that will be concatenated and minified last, so these are generally the site specific files that are making use of functions previously defined in `vendor` or `lib`.

{% highlight php %}
<?php require_once '../all-the-things.php'; ?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8">        <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9">               <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js">                      <!--<![endif]-->
    <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />

        <title>Minify your CSS and JavaScript</title>
        <meta name="description" content="...">

        <meta name="viewport" content="width=device-width" />

        <?php if ( ! LIVE): ?>
            <link rel="stylesheet" href="/css/1-normalize.css" />
            <link rel="stylesheet" href="/css/2-base.css" />
            <?php foreach (getFiles('css/screen', 'css') as $_file): ?>
                <link rel="stylesheet" href="/css/screen/<?= $_file ?>" />
            <?php endforeach; ?>
            <link rel="stylesheet" href="/css/3-helpers.css" />
            <link rel="stylesheet" href="/css/4-responsive.css" />
            <?php foreach (getFiles('css/responsive', 'css') as $_file): ?>
                <link rel="stylesheet" href="/css/responsive/<?= $_file ?>" />
            <?php endforeach; ?>
            <link rel="stylesheet" href="/css/5-print.css" />
            <?php foreach (getFiles('css/print', 'css') as $_file): ?>
                <link rel="stylesheet" href="/css/print/<?= $_file ?>" />
            <?php endforeach; ?>
		<?php else: ?>
            <link rel="stylesheet" href="/build/style.min.css" />
        <?php endif; ?>

        <!-- Only put JavaScript in the <head> that won't work in the <body> -->
        <script src="/js/vendor/modernizr-2.6.1.min.js"></script>

        <!--[if lt IE 7]>
            <script src="/js/vendor/DD_belatedPNG_0.0.8a-min.js"></script>
            <script>
                /* EXAMPLE */
                DD_belatedPNG.fix('img, .png_bg');
  
                /* string argument can be any CSS selector */
                /* .png_bg example is unnecessary */
                /* change it to what suits you! */
            </script>
        <![endif]-->
    </head>
    <body>
        <!--[if lt IE 7]>
            <p class="chromeframe">You are using an outdated browser. <a href="http://browsehappy.com/">Upgrade your browser today</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to better experience this site.</p>
        <![endif]-->

        <!-- Add your site or application content here -->
        <p>Hello world! This is HTML5 Boilerplate.</p>

        <?php if ( ! LIVE): ?>
            <!-- Use a local copy of jQuery in development for speed -->
            <script src="/js/vendor/jquery-1.8.2.min.js"></script>

            <!-- 1. JavaScript files in /js/lib will be included first -->
            <?php foreach (getFiles('/js/lib', 'js') as $_file): ?>
                <script src="/js/lib/<?= $_file ?>" />
            <?php endforeach; ?>

            <!-- 2. JavaScript files in /js/src will be included last -->
            <?php foreach (getFiles('/js/src', 'js') as $_file): ?>
                <script src="/js/src/<?= $_file ?>" />
            <?php endforeach; ?>
        <?php else: ?>
            <!-- Use jQuery from a CDN in production, fallback to a local copy if there is a problem -->
            <script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js"></script>
            <script>window.jQuery || document.write('<script src="/js/vendor/jquery-1.8.2.min.js"><\/script>')</script>

            <!-- Minified JS files (/js/lib, /js/src) -->
            <script src="/build/scripts.min.js"></script>

            <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
            <script>
                var _gaq=[['_setAccount','UA-XXXXX-X'],['_trackPageview']];
                (function(d,t){var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
                g.src=('https:'==location.protocol?'//ssl':'//www')+'.google-analytics.com/ga.js';
                s.parentNode.insertBefore(g,s)}(document,'script'));
            </script>
        <?php endif; ?>
    </body>
</html>
{% endhighlight %}


## Automating Builds

Balls to running `ant` each time you want to deploy a change to a live site. Stuff like this shouldn't get in the way.

A clever chap, [Zach Holman](http://zachholman.com/), puts this simply... _"Use humans to drink with, use computers to do things"_, so lets automate builds.

I assume you are using `git`, if you aren't, then [please have a look at this tutorial](http://try.github.com/).

### Git

`git` allows us to create a hook, a hook runs some commands when a certain event is triggered. So for example, you could push some new code to your test or live server, and your hook can be setup to run ant.

If you have never used hooks before, they are not transferred using git, hooks only exist locally. If you setup a hook on your repository, and push it to github, and someone else forks it, they will not receive your hooks when they clone. This is to protect them from you being a dick.

So for each server you will be deploying this repository on, you need to create a hook.

{% highlight sh %}
touch .git/hooks/post-receive
chmod +x .git/hooks/post-receive
vim .git/hooks/post-receive
{% endhighlight %}

{% highlight sh %}
#!/bin/bash

# Hooks runs from within .git directory
if [ $(basename $(pwd)) == ".git" ]; then
	cd ..
	export GIT_DIR=.git
fi

ant
{% endhighlight %}

You will also need to add this to your repository configuration...

{% highlight sh %}
vim .git/config
{% endhighlight %}

{% highlight sh %}
[receive]
    denyCurrentBranch = warn
{% endhighlight %}

### Mercurial

`hg` also allows this, off the top of my head, I'm hoping this works for you. If not, [RTFM](http://mercurial.selenic.com/wiki/Hook).

{% highlight sh %}
vim .hg/hgrc
{% endhighlight %}

{% highlight sh %}
[hooks]
changegroup = ant
{% endhighlight %}

