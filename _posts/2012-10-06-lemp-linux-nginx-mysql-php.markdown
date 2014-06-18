---
layout: post
date: 2012-10-06 01:37
title: "LEMP: Linux, Nginx, MySQL and PHP"
description: "How to install Nginx, MySQL and PHP on Ubuntu 12.04 LTS (Precise Pangolin)."
---

LEMP? Surely I mean LAMP? Nope...

- Linux
- Nginx (pronounced _Engine X_)
- MySQL
- PHP

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
Depending on the software, this can be quite simple, or it can be a pain in the arse to get it to compile (PHP). In some cases, it is not recommended at all (MySQL). It can teach you a lot about how something works, and what it requires to work, as once it has compiled you should go through the documentation to see what settings are in the various configuration files. Though to update the software, you have to manually download and compile the latest version again.

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
sudo usermod -a -G www-root luke
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

{% highlight text %}
deb http://nginx.org/packages/ubuntu/ precise nginx
deb-src http://nginx.org/packages/ubuntu/ precise nginx
{% endhighlight %}


Now you will need to update the package manager for this new repository to be used.

{% highlight sh %}
sudo apt-get update
{% endhighlight %}


Update is used to resynchronize the package index files from their sources. The indexes of available packages are fetched from the location(s) specified in `/etc/apt/sources.list`


### Install Nginx

Even if you skipped the step above, the command to install Nginx is the same.

{% highlight sh %}
sudo apt-get install nginx
sudo service nginx restart
{% endhighlight %}


### Test Nginx

Let's see if it works.

[http://localhost/](http://localhost/)





## MySQL

The documentation for MySQL specifically states that attempting to compile from source will result in the death of kittens, so for the sake of your sanity, lets not do that.

MySQL do provide `.deb` packages for Debian (v5.5.27), and I would assume they would work for Ubuntu, but there doesn't seem to be anything gained in having the latest version of MySQL as you would have to manually update it. Also, it's not clear what is included in the `.deb`, because there are 6 different packages for RHEL/Oracle, yet only 1 for Debian.

So, to keep things simple, we will be installing the packages provided by Ubuntu (v5.5.22).


### Install MySQL

{% highlight sh %}
sudo apt-get install mysql-client mysql-server
{% endhighlight %}

It will prompt you to set a password for the administrative `root` user, so set one, do not leave it blank.

_Do not use the same password as your server's root user, we are all guilty of it, but never use the same password for more than one thing._


### Secure MySQL

Your MySQL installation is not secure, so we need to run a script to sort a few things out...

{% highlight sh %}
mysql_secure_installation

NOTE: RUNNING ALL PARTS OF THIS SCRIPT IS RECOMMENDED FOR ALL MySQL
      SERVERS IN PRODUCTION USE!  PLEASE READ EACH STEP CAREFULLY!


In order to log into MySQL to secure it, we'll need the current
password for the root user.  If you've just installed MySQL, and
you haven't set the root password yet, the password will be blank,
so you should just press enter here.

Enter current password for root (enter for none):
{% endhighlight %}

Enter the password you just set when installing MySQL.

{% highlight sh %}
OK, successfully used password, moving on...

Setting the root password ensures that nobody can log into the MySQL
root user without the proper authorisation.

You already have a root password set, so you can safely answer 'n'.

Change the root password? [Y/n] n
{% endhighlight %}

**No**, there's no need to change it.

{% highlight sh %}
By default, a MySQL installation has an anonymous user, allowing anyone
to log into MySQL without having to have a user account created for
them.  This is intended only for testing, and to make the installation
go a bit smoother.  You should remove them before moving into a
production environment.

Remove anonymous users? [Y/n] y
{% endhighlight %}

**Yes**, remove anonymous users.

{% highlight sh %}
Normally, root should only be allowed to connect from 'localhost'.  This
ensures that someone cannot guess at the root password from the network.

Disallow root login remotely? [Y/n] y
{% endhighlight %}

**Yes**, root should not be able to login remotely, if you want to connect remotely then create a new user to do so.

{% highlight sh %}
By default, MySQL comes with a database named 'test' that anyone can
access.  This is also intended only for testing, and should be removed
before moving into a production environment.

Remove test database and access to it? [Y/n] y
{% endhighlight %}

**Yes**, remove the test database.

{% highlight sh %}
Reloading the privilege tables will ensure that all changes made so far
will take effect immediately.

Reload privilege tables now? [Y/n] y
{% endhighlight %}

**Yes**.





## PHP

PHP is a strange one.

At a [conference](http://2012.phpconference.co.uk/) I went to earlier this year, [Rasmus Lerdorf](http://en.wikipedia.org/wiki/Rasmus_Lerdorf) was pissed off that web developers were using versions of PHP that were 6 years old. Yep, PHP 5.2 is 6 years old. 6 fucking years old, and even web hosts that are supposed to be good, like Rackspace, were using it [until very recently on their Cloud Sites hosting](http://feedback.rackspace.com/forums/71021-product-feedback/suggestions/997049-php-5-3-support-in-cloud-sites).

The reason for this, quite frankly, is that PHP is a bastard to compile from source.

The first time I tried, I remember spending several days trying to install PHP 5.2 on CentOS 5.0 (32-bit). It's not just the first time that is hard, when I tried the same steps on a 64-bit OS I had loads of fun getting the bugger to work.

A simple solution for this, would be for the PHP developers to provide packages *of the latest version* for popular distributions. Unfortunately Zend seem more bothered with trying to sell LAMP stacks to IT managers.

Ubuntu's official repositories come with PHP 5.3.10 - but PHP 5.4 has some nice features you could be using. PHP 5.3 was first released 3 years ago, you should *always* use the latest version of PHP.

So today, we are going to install PHP 5.4.7, by compiling it from source, christ...


### Dependency Hell

PHP depends on a lot of other things (libraries) to work, you can install PHP on its own, without configuring any extensions, but it wouldn't do very much. It wouldn't even be able to connect to a database. Compiling it requires various odds and sods too, so hopefully this little lot should do the trick...

{% highlight sh %}
sudo apt-get install autoconf automake bison build-essential curl flex gettext imagemagick libaspell15 libbz2-dev libc-client2007e-dev libc6-dev libcurl4-openssl-dev libicu-dev libgraphicsmagick1-dev libgraphicsmagick3 libkldap4 libldb-dev libmagickcore4 libmagickwand4 libmcrypt-dev libmysqlclient-dev libmysqld-dev libpspell-dev libreadline6 libreadline6-dev libsqlite3-0 libsqlite3-dev libssl-dev libtidy-0.99-0 libtidy-dev libtool libvips-dev libxml2-dev libxslt-dev libyaml-dev ncurses-dev openssl re2c sendmail sqlite3 wget zlib1g zlib1g-dev
{% endhighlight %}


### Download PHP

Find your nearest mirror on the [PHP Downloads page](http://php.net/downloads.php), but check if a newer version of PHP has been released since I have written this article, and download that instead.

At the moment, PHP 5.4.7 is the latest version, so these are the commands I ran to download from my closest mirror.

{% highlight sh %}
wget http://php.net/get/php-5.4.7.tar.bz2/from/uk.php.net/mirror -O php-5.4.7.tar.bz2
tar -xvjf php-5.4.7.tar.bz2
{% endhighlight %}


### Compile PHP

{% highlight sh %}
cd php-5.4.7
./configure --help
{% endhighlight %}


This should list all of the options available to you. There are so many they haven't even included them all in this list. I imagine this stems from a time before "it just works". Anyway, enough bitching, this is what I used....

{% highlight sh %}
./configure --enable-bcmath --with-bz2 --enable-calendar --with-curl --enable-exif --enable-fpm --enable-ftp --with-gd --enable-gd-jis-conv --enable-gd-native-ttf --with-gettext --enable-intl --enable-mbstring --with-mcrypt --enable-mysqlnd --with-mysql=mysqlnd --with-mysqli=mysqlnd --with-openssl --with-pdo-mysql=mysqlnd --with-pear --enable-phar --with-pspell --enable-soap --enable-sockets --with-tidy --with-xsl --enable-zip --with-zlib
{% endhighlight %}


Running `configure` is the point where it might fail, if you get an error it usually means you don't have a library installed, when writing this article I spent a lot of time googling the error messages, and as soon as I got past one error, another would take it's place and the merry dance would continue.

I'm hoping that by writing everything down like this, and testing it, it should also work for you.

Now to actually compile it, this took 11 minutes and 26 seconds on my Linode (512MB RAM), so go and make a cup of tea.

{% highlight sh %}
make
{% endhighlight %}


Once `make` has finished, you should do the PHP developers a favour by running their tests. This step isn't required, and it will only ask for your e-mail address to submit them, but please do it as it could improve PHP for everyone who uses it.

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
# PHP 5.4.7 (cli) (built: Oct  5 2012 23:40:18)
# Copyright (c) 1997-2012 The PHP Group
# Zend Engine v2.4.0, Copyright (c) 1998-2012 Zend Technologies
{% endhighlight %}


### It worked for me&trade;

You **do not** need to do this if you successfully compiled PHP from source, but if it didn't work for you, you could install [PHP 5.4.6 from an unofficial PPA](https://launchpad.net/~ondrej/+archive/php5).

{% highlight sh %}
sudo apt-get install python-software-properties
sudo add-apt-repository ppa:ondrej/php5
sudo apt-get update
sudo apt-get install php5-cli php5-curl php5-fpm php5-gd php5-imagick php5-mcrypt php5-mysqlnd php-pear php5-sqlite
{% endhighlight %}

Though if you do this, the rest of this article won't be referencing the same locations for configuration files, so you will need to use some common sense to find your configuration files. Generally they are all floating around in /etc/


### Configure PHP

When you download PHP, it comes with two example settings files:

- **php.ini-development**
Contains settings suitable for development, such as displaying errors in the browser.
- **php.ini-production**
Contains settings suitable for live servers, such as logging errors instead of displaying them.

Pick the one that applies to you, and copy it to `/usr/local/lib/php.ini`

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

{% highlight text %}
;pid = run/php-fpm.pid
pid = run/php-fpm.pid

;user = nobody
user = www-data

;group = nobody
group = www-data

;listen = 127.0.0.1:9000
listen = var/run/php-fpm.socket
{% endhighlight %}


Now we need to setup a "service" to run PHP FPM on boot, and make it easy to restart when we break things.

{% highlight sh %}
sudo cp ~/php-5.4.7/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm
sudo chmod +x /etc/init.d/php-fpm
{% endhighlight %}


Now you should be able to run php-fpm.

{% highlight sh %}
sudo service php-fpm start
{% endhighlight %}


Now lets set it up so that it starts on boot, Nginx and MySQL are already setup to start on boot.

{% highlight sh %}
sudo update-rc.d php-fpm defaults
# Adding system startup for /etc/init.d/php-fpm ...
#   /etc/rc0.d/K20php-fpm -> ../init.d/php-fpm
#   /etc/rc1.d/K20php-fpm -> ../init.d/php-fpm
#   /etc/rc6.d/K20php-fpm -> ../init.d/php-fpm
#   /etc/rc2.d/S20php-fpm -> ../init.d/php-fpm
#   /etc/rc3.d/S20php-fpm -> ../init.d/php-fpm
#   /etc/rc4.d/S20php-fpm -> ../init.d/php-fpm
#   /etc/rc5.d/S20php-fpm -> ../init.d/php-fpm
{% endhighlight %}


### Configure Nginx

There is a configuration file called `default.conf` in `/etc/nginx/conf.d/`, lets keep a copy of it as it contains useful comments and configuration examples. It references files outside of `/var/www`, so I prefer to just set it aside, and create a new default _virtual host_.

{% highlight sh %}
cd /etc/nginx/conf.d/
sudo mv default.conf default.conf.bak
sudo mv example-ssl.conf example-ssl.conf.bak
{% endhighlight %}


Now lets setup our own default virtual host configuration.

{% highlight sh %}
sudo vi /etc/nginx/conf.d/default.conf
{% endhighlight %}


Copy and paste the following into this file.

{% highlight text %}
server {
    listen 80;
    server_name localhost;

    access_log /var/log/nginx/localhost-access.log;
    error_log  /var/log/nginx/localhost-error.log error;

    root /var/www/default/;
    index index.php index.htm index.html;

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


In /etc/nginx, you should create two folders; `sites-available` and `sites-enabled`.

{% highlight sh %}
cd /etc/nginx/
sudo mkdir sites-available
sudo mkdir sites-enabled
{% endhighlight %}


`sites-available` is where the configuration files for your _virtual hosts_ live, and `sites-enabled` contains [symbolic links](http://en.wikipedia.org/wiki/Symbolic_link) (aka. symlinks) to those configuration files; so if you want a site to be live, you create a symbolic link, if you want to take a site offline, you delete the symbolic link. That way, you never lose the configuration file. Note that any changes to the nginx configuration, including creating or deleting these symbolic links, requires a reload/restart of nginx.

To get nginx to read the files in `sites-available`, we need to edit this file:

{% highlight sh %}
sudo vi nginx.conf
{% endhighlight %}


Find this line:

{% highlight text %}
include /etc/nginx/conf.d/*.conf;
{% endhighlight %}


And add this line directly below it, so it sits in the `http {}` group.

{% highlight text %}
include /etc/nginx/sites-enabled/*;
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
sudo service nginx restart
{% endhighlight %}


If you go to [http://localhost/](http://localhost/) in your browser, then you should see "Hello World".


### Test PHP

As we have created our default virtual host, which contained some configuration for PHP FPM, we could create a php file to be run by PHP. It's quite useful to test PHP like this, as even at this point you can still go back and re-compile PHP with different options.

{% highlight sh %}
vi /var/www/default/info.php
{% endhighlight %}


Copy and paste this into this file.

{% highlight php %}
<?php

phpinfo();
{% endhighlight %}


Now if you visit [http://localhost/info.php](http://localhost/info.php) you should see lots of information about your PHP installation. If you used the `php.ini-development` file earlier, when you scroll down to the section titled "date", you should see this error message:

> Warning: phpinfo(): It is not safe to rely on the system's timezone settings. You are *required* to use the date.timezone setting or the date\_default\_timezone\_set() function. In case you used any of those methods and you are still getting this warning, you most likely misspelled the timezone identifier. We selected the timezone 'UTC' for now, but please set date.timezone to select your timezone. in /var/www/default/info.php on line 3


Even if you used the `php.ini-production` file earlier, you still need to edit your `php.ini` file to define this setting, otherwise this error will be triggered every time you use the `date()` function.

{% highlight sh %}
sudo vi /usr/local/lib/php.ini
{% endhighlight %}


Again, find the first line, and replace it with the second line:

{% highlight text %}
;date.timezone =
date.timezone = Europe/London
{% endhighlight %}


As we have made a configuration change, we need to restart php-fpm.

{% highlight sh %}
sudo service php-fpm restart
{% endhighlight %}





## phpMyAdmin

Even though some things you are better off doing on the command line, such as importing/exporting databases, phpMyAdmin can be very useful for web developers. Also, it gives me an opportunity to demonstrate the entire LEMP stack is working together, and how to set up another _virtual host_ for Nginx.


### Download phpMyAdmin

At the time of writing, v3.5.2.2 was the latest stable version. But please check the [phpMyAdmin website](http://www.phpmyadmin.net/) to download the latest version. Even though I am english, other people may not be, so be nice and download the all-languages version.

{% highlight sh %}
cd
wget http://downloads.sourceforge.net/project/phpmyadmin/phpMyAdmin/3.5.2.2/phpMyAdmin-3.5.2.2-all-languages.tar.bz2
tar -xvjf phpMyAdmin-3.5.2.2-all-languages.tar.bz2
cp -r phpMyAdmin-3.5.2.2-all-languages /var/www/phpmyadmin.dev/
{% endhighlight %}


### Setup Nginx Virtual Host

Create a config file.

{% highlight sh %}
sudo vi /etc/nginx/sites-available/phpmyadmin.dev
{% endhighlight %}


Copy and paste this into this file. You will notice this is very similar to our default config, so compare it to the default config to understand what has changed. Understanding this will help you when you come to add your own _virtual hosts_.

{% highlight text %}
server {
    listen 80;
    server_name .phpmyadmin.dev;

    access_log /var/log/nginx/phpmyadmin.dev-access.log;
    error_log  /var/log/nginx/phpmyadmin.dev-error.log error;

    root /var/www/phpmyadmin.dev/;
    index index.php;

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


For this new virtual host to be enabled, we need to create a symlink in the sites-enabled folder.

{% highlight sh %}
cd /etc/nginx/sites-enabled
sudo ln -s ../sites-available/phpmyadmin.dev
{% endhighlight %}


Again, make sure you test your nginx config does not have any syntax errors.

{% highlight sh %}
sudo service nginx configtest
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
{% endhighlight %}


Obviously the phpmyadmin.dev domain doesn't exist, so we have to add it to our hosts file.

{% highlight sh %}
sudo sh -c "echo '127.0.0.1\tphpmyadmin.dev' >> /etc/hosts"
{% endhighlight %}


Now if we restart the server...

{% highlight sh %}
sudo service nginx restart
{% endhighlight %}


...we should see phpMyAdmin in our browser if we go to [http://phpmyadmin.dev/](http://phpmyadmin.dev/)

A login screen should show up, but unfortunately it won't work no matter what username or password we enter.


> \#2002 Cannot log in to the MySQL server.


To log in, we need to edit our php.ini file.

{% highlight sh %}
sudo vi /usr/local/lib/php.ini
{% endhighlight %}


These are the settings you need to change. Find them, as they will already be in there. In each pair below, find the first line, and change it to the second line.

{% highlight text %}
pdo_mysql.default_socket=
pdo_mysql.default_socket = /var/run/mysqld/mysqld.sock

mysql.default_socket =
mysql.default_socket = /var/run/mysqld/mysqld.sock

mysqli.default_socket =
mysqli.default_socket = /var/run/mysqld/mysqld.sock
{% endhighlight %}


Now we need to restart PHP as we have changed the configuration.

{% highlight sh %}
sudo service php-fpm restart
{% endhighlight %}


Now phpMyAdmin should let you login!

There are lots of configuration options for phpMyAdmin, I would suggest locking it down as much as possible, you can lock it down to your IP, you can force SSL, you can prevent logging in with root, you can setup a whitelist of users that can login. All of which probably belong in an article by itself.





## Future Reading.

Obviously this article is just intended to get you started, I would definitely recommend that you look into all of the things covered in this article to try and gain a better understanding.
