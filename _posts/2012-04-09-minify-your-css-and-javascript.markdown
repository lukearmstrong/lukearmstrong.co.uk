---
layout: post
title: Minify your CSS and JavaScript
date: 2012-04-09 22:39
published: false
comments: true
categories:
- ant
- css
- javascript
---

What I am about to explain is nothing new. So I'm not going to explain why you should be doing this, you should already know, my aim is to show you how I have done it.

I first started reading up on optimizing the front-end nearly 4 years ago, thanks to the [research done at Yahoo!](http://developer.yahoo.com/performance/); Yet in all that time I have only done it on two sites.

People are scared of doing this, they worry that...

* Things will suddenly stop working because the minification process has buggered up their CSS/JS.
* It will take too long to set up a process to push changes to a live site.
* It may cause issues when working with a team.

The latest site I have done this on has had more than 20 different people working on it, over the course of 9 months, and seemingly the process didn't get in their way. 


## Requirements

To do this, we are going to be using [Apache Ant](http://ant.apache.org/), [YUI Compressor](http://yuilibrary.com/projects/yuicompressor/) and [Google Closure Compiler](https://developers.google.com/closure/compiler/). All free, cross-platform software.

### Apache Ant

This will be our build tool. We will set up an XML file telling it where our CSS and JS files live, and it will concatenate them into a single file to be run through our minification tools.

**Linux:** It is simple enough to install this from your package manager, on Ubuntu 11.10:

{% highlight sh %}
sudo apt-get install ant
{% endhighlight %}

**Windows:** It can be a pain in the arse to install Ant on Windows, luckily [WinAnt](http://code.google.com/p/winant/) makes this process much easier.

**Mac:** [Ports](http://html5boilerplate.com/docs/Build-script/#if-youre-on-mac-or-linux) or [Brew](http://www.calvinfroedge.com/installing-apache-ant-with-homebrew-on-mac-os-x/)? Sorry I can't be of any more help, I'm too poor to have ever had one.


### YUI Compressor

This will be used to minify our CSS.

**Download:** <http://yuilibrary.com/download/yuicompressor/>


### Google Closure Compiler

This will be used to minify our JavaScript.

**Download:** <http://closure-compiler.googlecode.com/files/compiler-latest.zip>

*On several occassions now this tool has warned us of bugs in our code, stuff like a trailing comma in an array or object, and even pointed out things that won't work in IE but will generally work in other browsers. Google have also released something called [Google Closure Linter](https://developers.google.com/closure/utilities/), and there are also other Lint tools out there; such as [JS Lint](http://jslint.com/).*





## A warning about testing in Internet Explorer

> Removal of Style Sheet Limits
> In Internet Explorer 9 and earlier, there is a limit of 31 style sheets per webpage. There is also a nesting limit of four levels deep for style sheets that are linked using @import rules.
> In Internet Explorer 10 (as well as Metro style apps using JavaScript), this limit has been removed. There is no limit to the number of style sheets you can reference per webpage in Internet Explorer 10 or Metro style apps using JavaScript for Windows 8. You are also not limited in the number of times you can nest @import rules inside style sheets.

**Source:** <http://msdn.microsoft.com/library/ie/hh673536.aspx#removal_of_style_sheet_limits>
**Example:** </examples/ie-stylesheet-limit.html>


## Research

There are various ways of achieving what I have explained, so here are a few things to read up about.


### HTML5 Boilerplate

This project has a build script, they've gone a little bit further than I have, so I recommend you [read up about it](http://html5boilerplate.com/docs/Build-script/). I haven't yet, but I've been meaning to look into compressing images too.


### Ruby on Rails: Asset Pipeline

I've not looked into this yet, but noticed it when I was playing with Ruby on Rails the other day. Even if you don't use Ruby on Rails, it's always worth reading up about other languages and frameworks because [it might give you some ideas](http://guides.rubyonrails.org/asset_pipeline.html).


### Getting PHP to minify the files when they have changed.

The implementations I have seen of this approach are stupid. It just doesn't make any sense...

* It is inefficient to serve your static assets via PHP, your web server can handle these requests much faster.
* I haven't seen a PHP implementation beat alternatives on filesize.
* It takes time to minify the files, imagine if your request was the one held up for 10 seconds whilst this was going on.
* What if more than one request triggers the css/js files to be minified, will the server attempt to minify it more than once?




## build.xml

{% highlight xml %}
<?xml version="1.0" ?>
<project default="js.minify" basedir=".">

	<target name="load.properties">
		<echo>Initialize Variables</echo>

		<property name="public.path" value="httpdocs" />
		<echo message="public.path: ${public.path}" />

		<property name="yuiCompressor.path" value="includes/build/yuicompressor-2.4.6.jar" />
		<echo message="yuiCompressor.path: ${yuiCompressor.path}" />

		<property name="googleClosureCompiler.path" value="includes/build/google-closure-compiler-1346.jar" />
		<echo message="googleClosureCompiler.path: ${googleClosureCompiler.path}" />
	</target>

	<target name="css.concatenate" depends="load.properties">
		<echo>Concatenate CSS files: /css/_build/style.css</echo>
	    <concat destfile="${public.path}/css/_build/style.css" encoding="UTF-8" eol="lf" fixlastline="yes" outputencoding="UTF-8">
			<filelist dir="${public.path}/css/boilerplate/" files="1-reset.css" />
			<fileset dir="${public.path}/css/screen/">
				<include name="*.css" />
				<exclude name=".hgkeep" />
			</fileset>
			<filelist dir="${public.path}/css/boilerplate/" files="2-helpers.css" />
			<filelist dir="${public.path}/css/boilerplate/" files="3-responsive.css" />
			<fileset dir="${public.path}/css/responsive/">
				<include name="*.css" />
				<exclude name=".hgkeep" />
			</fileset>
			<filelist dir="${public.path}/css/boilerplate/" files="4-print.css" />
			<fileset dir="${public.path}/css/print/">
				<include name="*.css" />
				<exclude name=".hgkeep" />
			</fileset>
	    </concat>
	</target>

	<target name="css.minify" depends="css.concatenate">
	    <echo>Minify CSS using YUI Compressor: /css/_build/style.css => /css/_build/style.min.css</echo>
		<apply executable="java" parallel="false">
			<fileset dir="${public.path}/css/_build/" includes="style.css" />
			<mapper type="glob" from="style.css" to="${public.path}/css/_build/style.min.css" />
			<arg line="-jar" />
			<arg path="${yuiCompressor.path}" />
			<srcfile />
			<arg line="-o" />
			<targetfile />
		</apply>
	</target>

	<target name="js.concatenate" depends="css.minify">
		<echo>Concatenate JS files: /js/_build/scripts.js</echo>
	    <concat destfile="${public.path}/js/_build/scripts.js" encoding="UTF-8" eol="lf" fixlastline="yes" outputencoding="UTF-8">
			<fileset dir="${public.path}/js/lib/">
				<include name="*.js" />
				<exclude name=".hgkeep" />
			</fileset>
			<fileset dir="${public.path}/js/run/">
				<include name="*.js" />
				<exclude name=".hgkeep" />
			</fileset>
	    </concat>
	</target>

	<target name="js.minify" depends="js.concatenate">
	    <echo>Minify JavaScript using Google Closure Compiler: /js/_build/scripts.js => /js/_build/scripts.min.js</echo>
		<apply executable="java" parallel="false">
			<fileset dir="${public.path}/js/_build/" includes="scripts.js" />
			<mapper type="glob" from="scripts.js" to="${public.path}/js/_build/scripts.min.js" />
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


## PHP

{% highlight php %}
<? IF (Fuel::$env === Fuel::DEVELOPMENT): ?>
	<link rel="stylesheet" type="text/css" href="/css/boilerplate/1-reset.css" />
	<? FOREACH (File::read_dir(DOCROOT.'css/screen') as $_file): ?>
		<link rel="stylesheet" type="text/css" href="/css/screen/<?= $_file ?>" />
	<? ENDFOREACH; ?>
	<link rel="stylesheet" type="text/css" href="/css/boilerplate/2-helpers.css" />
	<link rel="stylesheet" type="text/css" href="/css/boilerplate/3-responsive.css" />
	<? FOREACH (File::read_dir(DOCROOT.'css/responsive') as $_file): ?>
		<link rel="stylesheet" type="text/css" href="/css/responsive/<?= $_file ?>" />
	<? ENDFOREACH; ?>
	<link rel="stylesheet" type="text/css" href="/css/boilerplate/4-print.css" />
	<? FOREACH (File::read_dir(DOCROOT.'css/print') as $_file): ?>
		<link rel="stylesheet" type="text/css" href="/css/print/<?= $_file ?>" />
	<? ENDFOREACH; ?>
<? ELSE: ?>
	<link rel="stylesheet" type="text/css" href="/css/_build/style.min.css?v=<?= date('YmdHis', filemtime(DOCROOT.'css/_build/style.min.css')); ?>" />
<? ENDIF; ?>

<script type="text/javascript" src="/js/_build/modernizr-2.0.6.js"></script>

<? IF (Fuel::$env === Fuel::DEVELOPMENT): ?>
	<script type="text/javascript" src="/js/_build/jquery-1.6.4.min.js"></script>
	<? FOREACH (File::read_dir(DOCROOT.'js/lib') as $_file): ?>
		<script type="text/javascript" src="/js/lib/<?= $_file ?>"></script>
	<? ENDFOREACH; ?>
	<? FOREACH (File::read_dir(DOCROOT.'js/run') as $_file): ?>
		<script type="text/javascript" src="/js/run/<?= $_file ?>"></script>
	<? ENDFOREACH; ?>
<? ELSE: ?>
	<script type="text/javascript" src="//ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js"></script>
	<script type="text/javascript">window.jQuery || document.write('<script type="text/javascript" src="/js/_build/jquery-1.6.4.min.js"><\/script>')</script>
	<script type="text/javascript" src="/js/_build/scripts.min.js?v=<?= date('YmdHis', filemtime(DOCROOT.'js/_build/scripts.min.js')); ?>"></script>
<? ENDIF; ?>

<!--[if lte IE 6]>
	<script type="text/javascript" src="/js/_build/DD_belatedPNG_0.0.8a-min.js"></script>
	<script type="text/javascript">DD_belatedPNG.fix("img, .png_bg");</script>
<![endif]-->
{% endhighlight %}

