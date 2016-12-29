---
layout: post
date: 2016-12-28 21:00
title: Setup Wildcard Virtual Hosts for Apache
description: Fed up with setting up a virtual host each time you work on a new project? Here I explain how to setup wildcard virtual hosts with Apache.
opengraph_image: 2016-12-28-setup-wildcard-virtual-hosts-apache.png
---

Fed up with setting up a virtual host each time you work on a new project? Here I explain how to setup wildcard virtual hosts with Apache.

*This is a follow-up from my previous tutorial, [Setup Apache, MySQL and PHP using Homebrew on macOS Sierra](/2016/12/setup-apache-mysql-php-homebrew-macos-sierra/), this tutorial isn't intended to be used on production servers, but to make life easier when working with your local development environment.*

Ordinarily you would have to create a virtual host config file for each project you work on. But if you work on lots of different projects, and you find yourself just copying the same virtual host configuration, we can make life slightly easier by getting Apache to automatically pick up new sites.

## Enable Apache Module: mod_vhost_alias

Edit Apache's main configuration file `/usr/local/etc/apache2/2.4/httpd.conf`. Find the following line:

    #LoadModule vhost_alias_module libexec/mod_vhost_alias.so

Uncomment it by removing the `#` so it looks like this:

    LoadModule vhost_alias_module libexec/mod_vhost_alias.so

Save the file.


## Create a Wildcard Virtual Host

Next we need to create a Virtual Host that will catch any unhandled requests, we don't want to break the ability to create our own virtual hosts manually as that can be useful for certain projects.

Create this file: `/usr/local/etc/apache2/2.4/vhosts/_default.conf`

    UseCanonicalName Off

    <Directory "/usr/local/var/www/vhosts/_wildcard">
        Allow From All
        AllowOverride All
        Options Indexes FollowSymlinks MultiViews
        Require all granted
    </Directory>

    <VirtualHost _default_:*>
        VirtualDocumentRoot /usr/local/var/www/vhosts/_wildcard/%0

        <FilesMatch "\.php$">
            SetHandler proxy:fcgi://127.0.0.1:9070
        </FilesMatch>
    </VirtualHost>

*All wildcard sites will be using PHP 7.0, if you would prefer to use PHP 5.6, change the port number on this line `SetHandler proxy:fcgi://127.0.0.1:9070` to `9056`.*

Because we have changed Apache's settings, we need to restart it.

    $ sudo apachectl restart


## So how does this work?

It will take the domain name of the request, `wildcardtest1.site` and start serving files stored in `/usr/local/var/www/vhosts/_wildcard/wildcardtest1.site/`. So you could just start adding your project folders to `/usr/local/var/www/vhosts/_wildcard/` for each site you start working on.


## But, this won't work for me...

The projects I work on often have different folder structures, for example; Some may have their public web root in a sub-folder called `site/`, `public_html/`, `public/`, `htdocs/`, `httpdocs/`.

Because of this, I couldn't just use the same configuration for all sites.

Also, if you have any subdomains, even `www.wildcardtest1.site`, then it will be serving files from `/usr/local/var/www/vhosts/_wildcard/www.wildcardtest1.site/` instead of `/usr/local/var/www/vhosts/_wildcard/wildcardtest1.site/`.


## We can use symlinks instead

A symbolic link is essentially a shortcut to another location. So what I have decided to do is use symlinks to point to my project's public web root folder. So my wildcard projects still live in `/usr/local/var/www/vhosts/` with all my existing projects, but I point to them from the `/usr/local/var/www/vhosts/_wildcard/` folder.

We can also use symlinks to add multiple domains/sub-domains for the same project folder. As you'll see, even `www.` prefixed to the domain gets routed to a different location.

In my `/usr/local/var/www/vhosts/_wildcard/` folder:

    wildcardtest1.site     -> /usr/local/var/www/vhosts/wildcardtest1.site/public/
    wildcardtest2.site     -> /usr/local/var/www/vhosts/wildcardtest2.site/htdocs/
    wildcardtest3.site     -> /usr/local/var/www/vhosts/wildcardtest3.site/
    www.wildcardtest1.site -> /usr/local/var/www/vhosts/wildcardtest1.site/public/
    www.wildcardtest2.site -> /usr/local/var/www/vhosts/wildcardtest2.site/htdocs/
    www.wildcardtest3.site -> /usr/local/var/www/vhosts/wildcardtest3.site/


## Create a new symlink

Assuming you have copied your project folder to `/usr/local/var/www/vhosts/my-project/` and your public web root is in a sub-folder called `public/`

To create a symlink, open a terminal.

    $ cd /usr/local/var/www/vhosts/_wildcard/
    $ ln -s ../my-project/public/ my-project.site
    $ ln -s ../my-project/public/ www.my-project.site

Here we have created two symlinks for `my-project.site` and `www.my-project.site`, and they will point to `/usr/local/var/www/vhosts/my-project/public/`.


## Don't forget to update your /etc/hosts file

    $ sudo vi /etc/hosts

Add this line to the bottom of the file.

    127.0.0.1  my-project.site  www.my-project.site

So now when you go to [http://my-project.site/](http://my-project.site/) in your browser you should see your site.


## Summary

So now setting up new sites should just involve creating a symlink, and adding a line to your `/etc/hosts` file. You won't need to create any more virtual host config files, so you won't need to restart Apache either!

If you got stuck at any point, and want to reference my configuration files, you can browse them here:
[https://github.com/lukearmstrong/localhost](https://github.com/lukearmstrong/localhost)


## Further Reading

I didn't just figure this out on my own, the article below pretty much got me there.

- [Set up Automatic Virtual Hosts with Nginx and Apache](https://www.sitepoint.com/set-automatic-virtual-hosts-nginx-apache/) by [Bruno Skvorc](https://twitter.com/bitfalls)

I also include a link to the Apache Documentation in case you are interested in how this wildcard config actually works and what else you can do with `mod_vhost_alias`.

- [Apache Documentation: mod_vhost_alias](http://httpd.apache.org/docs/2.4/mod/mod_vhost_alias.html)