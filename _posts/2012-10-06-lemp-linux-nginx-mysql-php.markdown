---
layout: post
date: 2012-09-27 00:01
title: "LEMP: Linux, Nginx, MySQL and PHP"
description: Ubuntu 12.04 LTS
#published: false
---

LEMP? Surely I mean LAMP? Nope...

**`L`** - Linux  
**`E`** - Nginx (pronounced _Engine X_)  
**`M`** - MySQL  
**`P`** - PHP  

I am going to explain how to install Nginx, MySQL and PHP on Ubuntu 12.04 LTS (Precise Pangolin).

## Why not Apache?

Well Apache isn't that efficient with resources (CPU/RAM), even when you don't have lots of traffic. We've had so many problems with it killing our servers that we have already migrated most of our sites to Nginx. Also, it is painfully slow when used with other languages I am interested in, like Ruby - I use Nginx and Unicorn for Ruby on Rails.


## Installing things...

When installing anything, you generally have 4 choices...

1. **Install the version in the Ubuntu repositories.**  
For the most part, this is what you should do. These are stable, are easy to install, and easy to keep updated. But sometimes you want or need the latest version, so you need to do something else.

2. **Install from another repository, or find a PPA on Launchpad.**  
I generally only do this when it is either maintained by, or recommended by, the developers of the software. I have tried ones made by individuals, which was nice of them to do, but sometimes you can get unlucky and end up installing/updating to a broken package, or end up using a repository that stops being updated.

3. **Compile from source.**  
Depending on the software, this can be quite simple, or it can be a pain in the arse to get it to compile (PHP). In some cases, it is not recommended at all (MySQL). It can teach you a lot about how something works, and what it requires to work, as once it has compiled you should go through the documentation to see what settings are in the various configuration files. To update, you have to manually download and compile the latest version, each time one is released.

4. **Find a package (.deb) to install a specific version, if available.**  
Even though I recommend finding a PPA on Launchpad, which essentially installs a (.deb) package, it also adds a repository so that you can receive updates for it. With a .deb, you would have to manually download and install updates. Well in most cases. Google provide a .deb for Chrome, it installs a repository so that it is easy to keep updated, but I haven't come across anyone else doing this.


## Preparing /var/www

Nearly every server setup I have seen keeps the web server's files in /var/www, so lets setup that folder now. Often your /var/www folder will need to be accessible by you, and other developers, so lets create a group to add these users to. Even if it will only be you, I would still recommend you do this.

### umask

If you are using Ubuntu 11.10 or 12.04, you can skip this step. The [default umask was changed from 0022 to 0002](https://wiki.ubuntu.com/OneiricOcelot/TechnicalOverview/Alpha2#Default_file_permissions) in Ubuntu 11.10 (Oneiric Ocelot)

Running the `umask` command should show `0002`

{% highlight sh %}
umask
# 0002
{% endhighlight %}

If it does, you **do not** need to do this next step. If it doesn't, you need to edit the `/etc/profile` file and add `umask 0002` at the end. Running this command will do this for you.

{% highlight sh %}
sudo echo "umask 0002" >> /etc/profile
{% endhighlight %}

You will need to log out and back in for the changes to take effect.


### Permissions

Create a group, we will call it `www-root`.

{% highlight sh %}
sudo groupadd www-root
{% endhighlight %}

Then add your user(s) to it.

{% highlight sh %}
sudo usermod -a -G www-root lukea
{% endhighlight %}

Log out and back in and out for it to take effect.

Now create the `/var/www` directory, and give the users of this `www-root` group the permission to create folders and write files within it, and for those permissions to always be set for the users of this group. 

{% highlight sh %}
sudo mkdir /var/www
sudo chown -R root:www-root /var/www
sudo chmod 2775 /var/www
{% endhighlight %}





## Nginx

If you want the latest stable version (v1.2.3), you don't have to compile from source, they provide official repositories for RHEL, CentOS, Debian and Ubuntu. Otherwise, if you prefer to use the version packaged by Ubuntu (v1.1.19), you can skip this step.

### Add the official Nginx repository

To use another repository, you need to download the key, and add it to the list of trusted keys.

{% highlight sh %}
wget http://nginx.org/keys/nginx_signing.key
sudo apt-key add nginx_signing.key
{% endhighlight %}

Now you can add the repository by creating this file:

{% highlight sh %}
sudo vi /etc/apt/sources.list.d/nginx.list
{% endhighlight %}

And adding this to it:

{% highlight sh %}
deb http://nginx.org/packages/ubuntu/ precise nginx
deb-src http://nginx.org/packages/ubuntu/ precise nginx
{% endhighlight %}

Now you will need to update the package manager for this new repository to be used.

{% highlight sh %}
sudo apt-get update
{% endhighlight %}

Update is used to resynchronize the package index files from their sources. The indexes of available packages are fetched from the location(s) specified in /etc/apt/sources.list


### Install Nginx

Even if you skipped the step above, the command to install Nginx is the same.

{% highlight sh %}
sudo apt-get install nginx
sudo service nginx restart
{% endhighlight %}

### Test Nginx

Let's see if it works.

http://localhost/
(or whatever your Hostname/IP Address is)





## MySQL

The documentation for MySQL specifically states that attempting to compile from source will result in the death of kittens, so for the sake of your sanity, lets not do that.

MySQL do provide `.deb` packages for Debian (v5.5.27), and I would assume they would work for Ubuntu, but there doesn't seem to be anything gained in having the latest version of MySQL as you would have to manually update it. Also, it's not clear what is included in the `.deb`, because there are 6 different packages for RHEL/Oracle, yet only 1 for Debian.

So, to keep things simple, we will be installing the package provided by Ubuntu (v5.5.22).


### Install MySQL

{% highlight sh %}
sudo apt-get install mysql-client mysql-server
{% endhighlight %}

It will prompt you to set a password for the administrative "root" user, so set one, do not leave it blank.





## PHP

PHP is a strange one.

At a conference I went to earlier this year, [PHP UK Conference 2012](http://2012.phpconference.co.uk/), [Rasmus Lerdorf](http://en.wikipedia.org/wiki/Rasmus_Lerdorf) was pissed off that web developers were using versions of PHP that were 6 years old. Yep, PHP 5.2 is 6 years old. 6 fucking years old, and even web hosts that are supposed to be good, like Rackspace, were using it [until very recently on their Cloud Sites hosting](http://feedback.rackspace.com/forums/71021-product-feedback/suggestions/997049-php-5-3-support-in-cloud-sites).

The reason for this, quite frankly, is that PHP is a bastard to compile from source.

The first time I tried, I remember spending several days trying to install PHP 5.2 on CentOS 5.0 (32-bit). It's not just the first time that is hard, when I tried the same steps on a 64-bit OS I had loads of fun getting the bugger to work.

A simple solution for this, would be for the PHP developers to provide packages *of the latest version* for popular distributions. Unfortunately Zend seem more bothered with trying to sell LAMP stacks to IT managers.

Ubuntu's official repositories come with PHP 5.3.10 - but PHP 5.4 has some nice features you could be using. PHP 5.3 was first released 3 years ago, you should *always* use the latest version of PHP.

So today, we are going to install PHP 5.4.7, by compiling it from source, christ...



### Dependency Hell

PHP depends on a lot of other things (libraries) to work, you can install PHP on its own, without configuring any extensions, but it wouldn't do very much. It wouldn't even be able to connect to a database. Compiling it requires various odds and sods too, so hopefully this lot will do the trick.

{% highlight sh %}
sudo apt-get install autoconf automake bison build-essential curl flex gettext imagemagick libbz2-dev libc-client2007e-dev libc6-dev libcurl4-openssl-dev libicu-dev libgraphicsmagick1-dev libgraphicsmagick3 libkldap4 libldb-dev libmagickcore4 libmagickwand4 libmcrypt-dev libmysqlclient-dev libmysqld-dev libreadline6 libreadline6-dev libsqlite3-0 libsqlite3-dev libssl-dev libtool libvips-dev libxml2-dev libxslt-dev libyaml-dev ncurses-dev openssl re2c sendmail sqlite3 wget zlib1g zlib1g-dev
{% endhighlight %}


### Download PHP

Find your nearest mirror on the [PHP Downloads page](http://php.net/downloads.php), but check if a newer version of PHP has been released since I have written this article, and download that instead.

At the moment, PHP 5.4.7 is the latest version, so these are the commands I ran to download from my closest mirror.

{% highlight sh %}
wget http://php.net/get/php-5.4.7.tar.bz2/from/uk.php.net/mirror
mv mirror php-5.4.7.tar.bz2
tar -xvjf php-5.4.7.tar.bz2
{% endhighlight %}


### Compile PHP

{% highlight sh %}
cd php-5.4.7
./configure --help
{% endhighlight %}

This should list all of the options available to you. There are so many they haven't even included them all in this list. I imagine this stems from a time before "it just works". Anyway, enough bitching, this is what I used....

{% highlight sh %}
./configure --enable-bcmath --with-bz2 --enable-calendar --with-curl --enable-exif --enable-fpm --enable-ftp --with-gd --enable-gd-jis-conv --enable-gd-native-ttf --with-gettext --enable-intl --enable-mbstring --with-mcrypt --enable-mysqlnd --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-openssl --with-pdo-mysql=mysqlnd --with-pear --with-pspell --enable-soap --enable-sockets --with-tidy --with-xsl --enable-zip --with-zlib
{% endhighlight %}

Now to actually compile it.

{% highlight sh %}
make
{% endhighlight %}

Running `make` is the point where it might fail because it doesn't like something you set in your `configure` command. If you get an error running `make`, it usually means you don't have a library installed, when writing this article I spent a lot of time googling the error messages, and as soon as I got past one error, another would take it's place and the merry dance would continue.

I'm hoping that by writing everything down like this, and testing it, it should also work for you.

Once `make` has succeeded without throwing an error, you should do the PHP developers a favor by running their tests. This only takes a few minutes, and it will only ask for your e-mail address to submit them, but please do it as it could improve PHP for everyone who uses it.

{% highlight sh %}
make test
{% endhighlight %}

Now to actually install it.

{% highlight sh %}
sudo make install
{% endhighlight %}

Once it is installed, you should run this command to make that hellish experience feel worth it.

{% highlight sh %}
php -v
# PHP 5.4.7 (cli) (built: Sep 23 2012 19:44:48) 
# Copyright (c) 1997-2012 The PHP Group
# Zend Engine v2.4.0, Copyright (c) 1998-2012 Zend Technologies
{% endhighlight %}



### It worked for me&trade;

If it didn't work for you, you could install [PHP 5.4.6 from an unofficial PPA](https://launchpad.net/~ondrej/+archive/php5).

{% highlight sh %}
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:nginx/stable
sudo apt-get update
sudo apt-get install php5-cli php5-curl php5-fpm php5-gd php5-imagick php5-mcrypt php5-mysqlnd php-pear php5-sqlite
{% endhighlight %}

Though if you do this, the rest of this article won't be referencing the same locations for configuration files, so you will need to use some common sense to find your configuration files. Generally they are all floating around in /etc/

### Configure PHP

When you download PHP, it comes with two example settings files. For some reason it doesn't appear to use either of them, nor is it clear where they should be put. Fortunately I have my crystal ball with me today, so I can tell you that this should do the trick...

{% highlight sh %}
sudo cp ~/php-5.4.7/php.ini-development /usr/local/lib/php.ini
{% endhighlight %}


### Configure PHP FPM

We are going to be using php-fpm (FastCGI Process Manager), so we need to configure it.

{% highlight sh %}
cd /usr/local/etc
sudo cp php-fpm.conf.default php-fpm.conf
sudo vi php-fpm.conf
{% endhighlight %}

These are the settings you need to change. Find them, as they will already be in there. In each pair below, find the first line, and change it to the second line.

{% highlight sh %}
;pid = run/php-fpm.pid
pid = run/php-fpm.pid

;listen = run/php-fpm.socket
listen = run/php-fpm.socket

;pm.start_servers = 20
pm.start_servers = 20

;user = nobody
user = www-data

;group = nobody
group = www-data
{% endhighlight %}

Now we need to setup a "service" to run PHP FPM on boot, and make it easy to restart when we break things.

{% highlight sh %}
sudo cp ~/php-5.4.7/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
sudo chmod +x /etc/init.d/php-fpm
{% endhighlight %}

Now you should be able to run php-fpm.

{% highlight sh %}
sudo service start php-fpm
{% endhighlight %}


### Configure Nginx

In /etc/nginx, there should be two folders; `sites-available` and `sites-enabled`. `sites-available` is where the configuration files for your _virtual hosts_ live, and `sites-enabled` contains [symbolic links](http://en.wikipedia.org/wiki/Symbolic_link) (aka. symlinks) to those configuration files; so if you want a site to be live, you create a symbolic link, if you want to take a site offline, you delete the symbolic link. That way, you never lose the configuration file. Note that any changes to the nginx configuration, including creating or deleting these symbolic links, requires a reload/restart of nginx.

There is also a configuration file called default, lets keep a copy of it as it contains useful comments and configuration examples. It references files outside of /var/www, so I prefer to just set it aside, and create a new default _virtual host_.

{% highlight sh %}
sudo mv /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak
{% endhighlight %}

In /etc/nginx, there is also a `conf.d` folder, that also contains a configuration file for a default host. Lets rename these too.

{% highlight sh %}
sudo mv /etc/nginx/conf.d/default /etc/nginx/conf.d/default.bak
sudo mv /etc/nginx/conf.d/example-ssl /etc/nginx/conf.d/example-ssl.bak
{% endhighlight %}

Lets setup our own default virtual host configuration.

{% highlight sh %}
sudo vi /etc/nginx/sites-available/default
{% endhighlight %}

Copy and paste the following into this file.

{% highlight sh %}
server {
    listen 80;
    server_name localhost;

    access_log /var/log/nginx/localhost-access.log;
    error_log  /var/log/nginx/localhost-error.log error;

    root /var/www/default/;
    index index.php index.html index.htm;

    location ~ \.php {
        fastcgi_index index.php;
		fastcgi_pass unix:/usr/local/var/run/php-fpm.socket;

        include fastcgi_params;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param PATH_INFO $fastcgi_path_info;
        fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
{% endhighlight %}

The symlink for this virtual host already exists, but if it didn't, we would need to run these commands.

{% highlight sh %}
cd /var/nginx/sites-enabled/
sudo ln -s ../sites-available/default
{% endhighlight %}

As we have made a configuration change to nginx, it would be wise to test our changes. If you make a mistake, and then restart nginx, it will go down and stay down until you figure out what the problem is and fix it.

{% highlight sh %}
sudo service nginx configtest 
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
{% endhighlight %}

We are not yet ready to restart yet. First, we need to create a folder for our virtual host in /var/www.

{% highlight sh %}
cd /var/www
mkdir default
{% endhighlight %}

Now lets create a page, just so we can test our virtual host is working when we restart nginx.

{% highlight sh %}
cd default
echo "Hello World" > index.htm
{% endhighlight %}

Now to restart nginx.

{% highlight sh %}
sudo service restart nginx
{% endhighlight %}

If you go to http://localhost/ in your browser, then you should see "Hello World"

#### Test PHP

As we have created our default virtual host, which contained some configuration for PHP FPM, we could create a php file to be run by PHP. It's quite useful to test PHP like this, as even at this point you can still go back and re-compile PHP with different options.

{% highlight php %}
vi /var/www/localhost/info.php
{% endhighlight %}

Copy and paste this into this file.

{% highlight php %}
<?php

phpinfo();
{% endhighlight %}

Now if you visit http://localhost/info.php you should see lots of information about your PHP installation. If you scroll down to the section titled "date", you should see this error message:

{% highlight php %}
Warning: phpinfo(): It is not safe to rely on the system's timezone settings. You are *required* to use the date.timezone setting or the date_default_timezone_set() function. In case you used any of those methods and you are still getting this warning, you most likely misspelled the timezone identifier. We selected the timezone 'UTC' for now, but please set date.timezone to select your timezone. in /var/www/default/info.php on line 3
{% endhighlight %}

So we need to edit our `php.ini` file to define this setting, otherwise this error message could be shown every time you try to use the `date()` function.

{% highlight php %}
sudo vi /usr/local/lib/php.ini
{% endhighlight %}

Again, find the first line, and replace it with the second line:

{% highlight php %}
;date.timezone =
date.timezone = Europe/London 
{% endhighlight %}

As we have made a configuration change, we need to restart php-fpm.

{% highlight php %}
sudo service php-fpm restart
{% endhighlight %}



## phpMyAdmin

Even though some things you are better off doing on the command line, such as importing/exporting databases, phpMyAdmin can be very useful for web developers. Also, it gives me an opportunity to demonstrate the entire LEMP stack is working together, and how to set up another _virtual host_ for Nginx.


