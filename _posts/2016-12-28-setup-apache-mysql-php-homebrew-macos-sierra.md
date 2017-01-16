---
date: 2016-12-28 20:40
title: Setup Apache, MySQL and PHP using Homebrew on macOS Sierra
description: Step by step instructions to setup a local development environment running multiple versions of PHP simultaneously.
opengraph_image: 2016-12-28-setup-apache-mysql-php-homebrew-macos-sierra.png
---

Step by step instructions to setup a local development environment running multiple versions of PHP simultaneously.

Sure, you could use [MAMP](https://www.mamp.info/en/) like many other developers out there, and there's nothing wrong with that, but setting things up this way will give you a better understanding of how all of these things come together and nearly everything you learn here will help you in the future if you need to setup Linux servers; Which in all likelihood you will do as understanding [DevOps](https://en.wikipedia.org/wiki/DevOps) is a useful skill to have.

I took the steps below using a clean install of macOS Sierra, so hopefully I have covered everything that you need to do. macOS Sierra / Xcode is bundled with Apache and PHP, but we won't be using these as it is an old version of PHP and messing around trying to update it could potentially break something. A disclaimer is necessary here, if you already have a functional development environment, and you decide to follow these steps, you can't hold me responsible if it all goes wrong and you break your current setup.


## Install Xcode and Xcode Command Line Tools

Open up the App Store and search for Xcode to install it.

Once it has installed, you'll need to open Xcode at least once as there is a Terms & Conditions prompt to accept before you can use the command line tools. Once you have got past the prompt, if any appears you may have already cleared it previously, open the Terminal and enter the command below to install Xcode Command Line Tools.

    $ xcode-select --install

*The $ is just to indicate this is a command prompt, do not enter it with the command.*


## Ensure the system installation of Apache is not running.

Enter this command to stop Apache if it is running, the second line below (not prefixed with $) is the error I received from the command, this is to be expected as it shouldn't be running.

    $ sudo apachectl stop
    /System/Library/LaunchDaemons/org.apache.httpd.plist: Could not find specified service

This command will stop Apache from starting on boot.

    $ sudo launchctl unload -w /System/Library/LaunchDaemons/org.apache.httpd.plist 2>/dev/null


## Install Homebrew

To install Homebrew, check for the latest installation instructions at [http://brew.sh/](http://brew.sh/), but when I installed it I ran the command below.

    $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

Homebrew has a utility that will check if everything is setup correctly, run this after installation.

    $ brew doctor
    Your system is ready to brew.


### Add Homebrew taps

*taps* are extra repositories containing formulae to install software, we will need to add these by entering the commands below.

    $ brew tap homebrew/apache
    $ brew tap homebrew/completions
    $ brew tap homebrew/dupes
    $ brew tap homebrew/php
    $ brew tap homebrew/versions


### Enable auto-completion for brew commands (optional)

You can skip this step if you want, but to help you use brew, you can enable auto-completion for commands; So when you type `brew` and mash the tab button you'll see what commands you can run.

    $ brew install bash-completion

After installation you should see a message telling you how to enable auto-completion, mine told me to add this to `~/.bash_profile`

    [ -f /usr/local/etc/bash_completion ] && . /usr/local/etc/bash_completion

Once you have done this, open a new terminal (or tab), and now you should have auto-completion hints when typing `brew` and then hitting tab several times.


## Install Apache

Now we are ready to install Apache 2.4

    $ brew install httpd24 --with-privileged-ports --with-http2

The next step involves using `apachectl` again, you may remember we used this right at the start to disable the system version of Apache. But now that we have installed Apache using Homebrew, `apachectl` will be controlling our version of Apache, not the system version. So let's check this has worked by typing:

    $ which apachectl
    /usr/local/bin/apachectl

Homebrew installs everything within `/usr/local/` so there is no danger of it conflicting with any system-level software. If you get anything else returned as the file path for apachectl, then something hasn't been setup properly, likely your `PATH` isn't setup correctly, run `brew doctor` again to check.

Assuming everything is fine, we are now ready to start Apache. You'll need to use `sudo` with this command because it opens port 80. *Don't use sudo when you don't need to, it could mess up file ownership and/or permissions.*

    $ sudo apachectl start

Now open your web browser and go to [http://127.0.0.1](http://127.0.0.1), you should see a message saying "It works!"

You should now set Apache to launch on startup.

    $ sudo brew services start homebrew/apache/httpd24


## Install PHP

I'll be installing PHP 5.6 and 7.0, as previous projects I have worked on are deployed to servers running PHP 5.x, so it is sensible to try to match your development environment to your production environment.

### Install PHP 5.6

    $ brew install php56 --with-fpm
    $ brew install php56-mcrypt
    $ brew install php56-xdebug

Because we will be installing multiple versions of PHP, we need to change the default PHP-FPM (FastCGI Process Manager) port from `9000` to something else, so I suggest setting it to `9056`.

Edit `/usr/local/etc/php/5.6/php-fpm.conf` and replace this line:

    listen = 127.0.0.1:9000

With this line:

    listen = 127.0.0.1:9056

Now we are ready to start PHP-FPM (this will also set it to launch on startup).

    $ brew services start homebrew/php/php56


### Setup Apache to work with PHP-FPM

Edit `/usr/local/etc/apache2/2.4/httpd.conf`

We need to enable some Apache modules, they have been commented out, so find these lines and remove the `#` to uncomment them.

    #LoadModule proxy_module libexec/mod_proxy.so
    #LoadModule proxy_fcgi_module libexec/mod_proxy_fcgi.so
    #LoadModule rewrite_module libexec/mod_rewrite.so

So it should now look like...

    LoadModule proxy_module libexec/mod_proxy.so
    LoadModule proxy_fcgi_module libexec/mod_proxy_fcgi.so
    LoadModule rewrite_module libexec/mod_rewrite.so

We need to configure Apache to attempt to load `index.php` by default, so find these lines.

    #
    # DirectoryIndex: sets the file that Apache will serve if a directory
    # is requested.
    #
    <IfModule dir_module>
        DirectoryIndex index.html
    </IfModule>

And change it to this.

    #
    # DirectoryIndex: sets the file that Apache will serve if a directory
    # is requested.
    #
    <IfModule dir_module>
        DirectoryIndex index.php index.html index.htm
    </IfModule>

We also need to enable virtual hosts, so find this line and uncomment it.

    #Include /usr/local/etc/apache2/2.4/extra/httpd-vhosts.conf

Now save the file.

We now need to edit the virtual hosts configuration file `/usr/local/etc/apache2/2.4/extra/httpd-vhosts.conf`

By default, all of your virtual hosts would go into this file, but it would soon become a mess once you have setup just a few sites. It's better to use individual files, so either delete or comment out all the lines in this file, and add this to the end.

    Include /usr/local/etc/apache2/2.4/vhosts/*.conf

This will read all the files with the `.conf` extension in that folder, so to add/edit/remove a virtual host, we just add/edit/delete the individual file. Now we are ready to setup our first virtual host. Create a directory for the config files to live in.

    $ mkdir -p /usr/local/etc/apache2/2.4/vhosts

Now create a file for our virtual host `/usr/local/etc/apache2/2.4/vhosts/_localhost.conf` and enter the configuration below.

    <Directory "/usr/local/var/www/vhosts/_localhost/php">
        Allow From All
        AllowOverride All
        Options +Indexes
        Require all granted
    </Directory>

    <VirtualHost *:*>
        ServerName php56.apache.localhost
        DocumentRoot "/usr/local/var/www/vhosts/_localhost/php"
        ProxyPassMatch ^/(.*\.php(/.*)?)$ fcgi://127.0.0.1:9056/usr/local/var/www/vhosts/_localhost/php/$1
    </VirtualHost>


Now we need to create the folder for the site files.

    $ mkdir -p /usr/local/var/www/vhosts/_localhost/php

Now create an `index.php` file with the following code in that folder.

    <?php

    phpinfo();

Because we have changed Apache's settings, we need to restart it.

    $ sudo apachectl restart

To get our new virtual host to work in the browser, we need to edit our `/etc/hosts` file. You'll need to use `sudo` to edit this file, so assuming you are comfortable using Vim...

	$ sudo vi /etc/hosts

Add this line to the bottom of the file.

	127.0.0.1  php56.apache.localhost

Now open your web browser, and go to [http://php56.apache.localhost](http://php56.apache.localhost), you should see the output from `phpinfo()` showing PHP 5.6.29 is installed.

You'll also see an error saying "It is not safe to rely on the system's timezone settings. You are *required* to use the date.timezone setting or the date_default_timezone_set() function."

To resolve this edit `/usr/local/etc/php/5.6/php.ini`, and find this line.

    ;date.timezone =

Remove the `;` to uncomment the setting and set the timezone to `UTC`.

    date.timezone = UTC

Now we have changed PHP's settings, we need to restart PHP-FPM.

    $ brew services restart homebrew/php/php56

If you refresh the browser you'll now see that the error has gone.

Now we have one version of PHP working with Apache, let's install PHP 7.0.


### Install PHP 7.0

First we need to run this, otherwise the installation will fail as there will conflicts.

    $ brew unlink php56

Now we can install PHP 7.0 with the same extensions as above.

    $ brew install php70 --with-fpm
    $ brew install php70-mcrypt
    $ brew install php70-xdebug

Again, because we are installing multiple versions of PHP we need to change the default FPM port from `9000` to something else, so I suggest setting it to `9070`. The layout of the config files is slightly different in this version of PHP.

Edit `/usr/local/etc/php/7.0/php-fpm.d/www.conf` and replace this line:

    listen = 127.0.0.1:9000

With this line:

    listen = 127.0.0.1:9070

To avoid the same error we had before, edit `/usr/local/etc/php/7.0/php.ini` and find:

    ;date.timezone =

Replace the line with:

    date.timezone = UTC

Now we are ready to start PHP-FPM (this will also set it to launch on startup).

    $ brew services start homebrew/php/php70

Edit our existing Apache virtual host config file to test PHP 7.0 is working, edit `/usr/local/etc/apache2/2.4/vhosts/_localhost.conf` and add this block to the end of the file.

    <VirtualHost *:*>
        ServerName php70.apache.localhost
        DocumentRoot "/usr/local/var/www/vhosts/_localhost/php"
        ProxyPassMatch ^/(.*\.php(/.*)?)$ fcgi://127.0.0.1:9070/usr/local/var/www/vhosts/_localhost/php/$1
    </VirtualHost>

Because we have changed Apache's settings, we need to restart it.

    $ sudo apachectl restart

Again, we need to create an entry in our `/etc/hosts` file.

    $ sudo vi /etc/hosts

Add this line to the end of the file.

    127.0.0.1  php70.apache.localhost

Now open your web browser, and go to [http://php70.apache.localhost](http://php70.apache.localhost), you should see the output from `phpinfo()` showing PHP 7.0.14 is installed.


## Install MySQL

    $ brew install mysql

Now lets start MySQL and get it to run on startup.

    $ brew services start mysql

I would recommend you setup a password for root, and only allow access from localhost. There is an easy way to do this.

    $ mysql_secure_installation


It's an interactive prompt, here were my responses.


    Would you like to setup VALIDATE PASSWORD plugin? n
    New password: root
    Re-enter new password: root
    Remove anonymous users? y
    Disallow root login remotely? y
    Remove test database and access to it? y
    Reload privilege tables now? y


I've noticed that since working on older projects, that MySQL is returning errors to PHP when doing `SELECT DISTINCT` or `GROUP BY` queries. Turned out it the default `sql_mode` in MySQL 5.7 is more restrictive than previous versions. Now, by default it is:

    ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

Now this is fine to leave as the default, I would recommend you leave the settings alone unless you have problems.

Initially I tried fixing some of the custom queries, but then started noticing problems from queries generated by WordPress' `get_posts()` function, and as I work on so many different WordPress sites I figured that I would end up wasting loads of time trying to fix these on other sites.

You can override this setting by creating a config file for mysql, create a file `/usr/local/etc/my.cnf` with these settings:

    [mysqld]
    #sql_mode=ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION # Default for MySQL 5.7
    sql_mode=STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION

    [client]
    user=root
    password=root

Now if you restart the MySQL server, you shouldn't be getting these errors.

    $ brew services restart mysql


## Summary

Now you should have everything you need to get started, each time you need to work on a new project, reference the previous steps to setup a new virtual host for it and restart Apache. In the future, if you need to install a different version of PHP, you can reference the steps here, and it should work.

If you got stuck at any point, and want to reference my configuration files, you can browse them here:
[https://github.com/lukearmstrong/localhost](https://github.com/lukearmstrong/localhost)


## Further Reading

- [Setup Wildcard Virtual Hosts for Apache](/2016/12/setup-wildcard-virtual-hosts-apache/)
- [Use Nginx and Apache at the same time](/2016/12/use-nginx-apache-at-the-same-time/)