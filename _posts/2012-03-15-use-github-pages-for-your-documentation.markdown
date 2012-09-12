---
layout: post
date: 2012-03-15 21:48
title: Use GitHub Pages for your Documentation
description: Host your API documentation alongside the code in your repository.
---

No one likes writing documentation, it gets put off because real work needs to be done, and tomorrow never comes. What is being documented is unlikely to be stable and is always subject to change, so it makes sense to document your code in comments as you go along, and generate documentation from that. Something I hope the cat herders will be encouraging us to do where I work.


## Install DocBlox

According to the [DocBlox installation documentation](http://docs.docblox-project.org/for-users/installation.html) the requirements are:

* PHP 5.2.6 or higher (5.2.5 and lower might work but is not supported, 5.3 is explicitly supported)
* XSL extension for PHP, only applicable when generating HTML via XSL (recommended)
* Graphviz, only applicable when generating Graphs (recommended)
* wkhtmltopdf, only applicable when generating PDFs (not enabled by default)

I've already installed PHP 5.3, and I as I use Ubuntu 11.10 it is easy to meet the other 3 requirements.

{% highlight sh %}
sudo apt-get install graphviz graphviz-dev libgv-php5 php-pear php5-xsl wkhtmltopdf
{% endhighlight %}

You may need to log out and log back in again to get the ```PATH``` to update, but don't bother until something starts mewing.

Now we can install DocBlox from PEAR. I can't help but notice that they use their own repository, I imagine this is because getting on the official PEAR repository [isn't as trivial as it should be](http://philsturgeon.co.uk/blog/2012/03/packages-the-way-forward-for-php). Anyway, the installation process is painless...

{% highlight sh %}
sudo pear channel-discover pear.docblox-project.org
sudo pear install DocBlox/DocBlox
{% endhighlight %}


## Prepare your project for DocBlox

For this example I forked the Symfony 2 repository, something well documentented to make this worth doing. I went to their repository, clicked fork, and now I can piss about with it. So lets get the code...

{% highlight sh %}
git clone git@github.com:lukearmstrong/symfony.git
{% endhighlight %}

Now to add a couple of files to the ```master``` branch.

{% highlight sh %}
cd symfony/
vi docblox.dist.xml
{% endhighlight %}

This is the configuration file for DocBlox, [read the documentation](http://docs.docblox-project.org/for-users/configuration.html) to see what the settings are for.

{% highlight xml %}
<?xml version="1.0" encoding="UTF-8" ?>
<docblox>
	<title>Symfony</title>
	<parser>
		<target>docblox/parser_output</target>
	</parser>
	<transformer>
		<target>docblox/transformer_output</target>
	</transformer>
	<files>
		<directory>.</directory>
		<ignore>/docblox/*</ignore>
	</files>
</docblox>
{% endhighlight %}


{% highlight sh %}
vi .gitignore
{% endhighlight %}

DocBlox will be generating our documentation to this location, so add this to your ```.gitignore```, all will become clear soon enough.

{% highlight text %}
/docblox/*
/docblox.xml
{% endhighlight %}


Commit ALL the things!

{% highlight sh %}
git add .
git commit -m "Setting up DocBlox"
git push origin master
{% endhighlight %}

## Setup GitHub Pages for your repository

GitHub Pages allow you to host a static website from your repository, it's worth looking into because what you are reading now is hosted on GitHub Pages too. So I'm safe in the knowledge that if I ever write anything of interest, my blog won't go down because of the traffic. Slashdot? Come at me bro!

### Create a new root branch

{% highlight sh %}
git symbolic-ref HEAD refs/heads/gh-pages
rm .git/index
git clean -fdx
{% endhighlight %}

God only knows what these commands do, but you end up on a new root branch called ```gh-pages```. [A better explanation can be found here](http://help.github.com/pages/#project_pages_manually).


### Prepare the root branch for DocBlox and GitHub Pages

As with the ```master``` branch, we also need to ignore the folder our documentation is generated in.

{% highlight sh %}
vi .gitignore
{% endhighlight %}

This means that when we switch between branches later on, anything in this folder will still be sat in the working directory.

{% highlight text %}
/docblox/*
/docblox.xml
{% endhighlight %}


Now a note on privacy. GitHub Pages sites are public, even if your repository is private. Public in the sense that anyone who knows the URL can see it, but they have to know the URL; It isn't published anywhere. You aren't likely to be putting things like passwords or anything sensitive in your comments, and your source code is never made public at any time, so this shouldn't be an issue. One simple thing you can do is ask nice search engine bots not to index it.

{% highlight sh %}
vi robots.txt
{% endhighlight %}


{% highlight text %}
User-agent: *
Disallow: /
{% endhighlight %}

Commit ALL the things!

{% highlight sh %}
git add .
git commit -m "Setting up GitHub Pages"
git push origin gh-pages
{% endhighlight %}

## Generate the Documentation using DocBlox

Switch back to the ```master``` branch.

{% highlight sh %}
git checkout master
{% endhighlight %}

Generate the documentation.

{% highlight sh %}
docblox
{% endhighlight %}

Switch back to your ```gh-pages``` branch.

{% highlight sh %}
git checkout gh-pages
{% endhighlight %}

As your ```docblox``` folder is ignored by both branches, you will need to copy the contents to the root for git to be able to track it.

{% highlight sh %}
cp -a docblox/transformer_output/* .
{% endhighlight %}

Commit ALL the things!

{% highlight sh %}
git add .
git commit -m "DocBlox generated documentation"
git push origin gh-pages
{% endhighlight %}

Now then. This could take up to 10 minutes to work the first time you push, but after that GitHub Pages will almost instantly update to reflect what you pushed to it.


## Re-generating the Documentation

Obviously this is a manual process, there is no magic here.

Lets say you generate your documentation, then decide to make some changes to your code. Regenerating your documentation is a fairly trivial exercise, here is all you need to do, assuming you are on the ```master``` branch and have a clean working directory, you can run the following commands.

{% highlight sh %}
docblox
git checkout gh-pages
cp -a docblox/transformer_output/* .
git add .
git commit -m "DocBlox re-generated documentation"
git push origin gh-pages
git checkout master
{% endhighlight %}

I'll probably write a bash script to re-generate the documentation at some point, but after a bottle of Sauvignon Blanc, now is probably not the right time.


## Conclusion

Here is what I ended up with:
[http://lukearmstrong.github.com/symfony/](http://lukearmstrong.github.com/symfony/)

Sods law, today, GitHub Pages have been [up and down](http://status.github.com) more times than your mother's knickers, so fuck knows when you will see this post, or the documentation site in my example; But in the time I have been playing with GitHub pages, it has been very quick and reliable.

Even if you don't use PHP, hopefully this has given you some ideas for how to acheive the same thing for your project.


## Update

[Docblox has now become phpDocumentor 2](http://www.docblox-project.org/2012/03/docblox-is-unmasked-it-is-really-phpdocumentor-2/). Great timing, I guess I'll be rewriting this blog post at some point.
