---
date: 2016-12-29 23:32
title: Use Nginx and Apache at the same time
description: How to run Nginx and Apache with multiple versions of PHP on your development environment at the same time.
opengraph_image: 2016-12-29-use-nginx-apache-at-the-same-time.png
---

Whilst the majority of the projects I work on are using PHP and running on Apache in production, I often play with other languages and frameworks that tend to prefer using [Nginx](https://nginx.org/en/). So I've decided to install Nginx alongside Apache so that I can use both.

*This is a follow-up from my previous tutorial, [Setup Apache, MySQL and PHP using Homebrew on macOS Sierra](/2016/12/setup-apache-mysql-php-homebrew-macos-sierra/), this tutorial isn't intended to be used on production servers, but to make life easier when working with your local development environment.*

Nginx will be the primary web server listening on port `80`, Apache will be listening on port `8080`, so I will proxy all unhandled requests to port `8080` for any projects that I need to run under Apache.

## Setup Apache to listen on port 8080

Edit `/usr/local/etc/apache2/2.4/http.conf` and find the line:

    Listen 80

Change it to:

    Listen 8080

Now restart apache.

    $ sudo apachectl restart

In your browser if you go to [http://localhost/](http://localhost/) it should show an error, but if you go to [http://localhost:8080/](http://localhost:8080/) you should see that Apache is running and showing whatever your default virtual host is.


## Install Nginx

    $ brew install nginx --with-http2

The default settings for the brew installation of nginx are to listen on port `8080`, we need to change this to `80`. Edit `/usr/local/etc/nginx/nginx.conf` and find this line:

    Listen 8080

Change it to:

    Listen 80

Also, we need to change another part of the config to test things are working, so find these lines:

    location / {
        root   html;
        index  index.html index.htm;
    }

And change them to:

    location / {
        root   /usr/local/var/www/vhosts/_localhost/nginx;
        index  index.html index.htm;
    }

Now lets create a test page.

    $ mkdir -p /usr/local/var/www/vhosts/_localhost/nginx
    $ echo "Hello World from Nginx" > /usr/local/var/www/vhosts/_localhost/nginx/index.html

Now lets see if it works, start the nginx server.

    $ sudo brew services start nginx

Going to [http://localhost/](http://localhost/) in your browser should now show the message *"Hello World from Nginx"*.


## Configure Nginx to run PHP

If you followed [my previous tutorial](/2016/12/setup-apache-mysql-php-homebrew-macos-sierra/), you should have PHP 5.6 and PHP 7.0 installed. Just to give you an example of how to get these working with Nginx, I will show you how to setup a couple of virtual hosts.

First though, we need to setup Nginx to read config files for our virtual hosts. Edit `/usr/local/etc/nginx/nginx.conf` and replace the entire config with this:

    user nobody nobody;
    worker_processes 1;

    events {
        worker_connections 1024;
    }

    http {
        include           mime.types;
        default_type      application/octet-stream;
        sendfile          on;
        keepalive_timeout 65;

        # Virtual Hosts Config
        include servers/*;
    }

Make a new config file for your virtual host `/usr/local/etc/nginx/servers/_localhost.conf`

    $ mkdir -p /usr/local/etc/nginx/servers
    $ vi /usr/local/etc/nginx/servers/_localhost.conf

Enter the following config, it will setup your original `localhost` site, and create virtual hosts `php70.nginx.localhost` for PHP 7.0 and `php56.nginx.localhost` for PHP 5.6.

    #
    # Localhost
    #
    server {
        listen 80;
        server_name localhost nginx.localhost;

        root /usr/local/var/www/vhosts/_localhost/nginx;
        index index.html index.htm;
    }


    #
    # PHP 7.0
    #
    server {
        listen 80;
        server_name php70.nginx.localhost;

        root /usr/local/var/www/vhosts/_localhost/php;
        index index.php index.html index.htm;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php {
            fastcgi_index index.php;
            fastcgi_pass 127.0.0.1:9070;

            include fastcgi_params;
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_param PATH_INFO $fastcgi_path_info;
            fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }


    #
    # PHP 5.6
    #
    server {
        listen 80;
        server_name php56.nginx.localhost;

        root /usr/local/var/www/vhosts/_localhost/php;
        index index.php index.html index.htm;

        location / {
            try_files $uri $uri/ /index.php?$query_string;
        }

        location ~ \.php {
            fastcgi_index index.php;
            fastcgi_pass 127.0.0.1:9056;

            include fastcgi_params;
            fastcgi_split_path_info ^(.+\.php)(/.+)$;
            fastcgi_param PATH_INFO $fastcgi_path_info;
            fastcgi_param PATH_TRANSLATED $document_root$fastcgi_path_info;
            fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        }
    }

Now that you've changed your Nginx config, you'll need to restart the server.

    $ sudo brew services restart nginx

Now add these lines to your `/etc/hosts` file.

    127.0.0.1  nginx.localhost
    127.0.0.1  php56.nginx.localhost
    127.0.0.1  php70.nginx.localhost

Now open these URLs in your web browser, if you visit [http://nginx.localhost](http://nginx.localhost) you should see your test page, then [http://php56.nginx.localhost](http://php56.nginx.localhost) the output of `phpinfo()` from PHP 5.6, then [http://php70.nginx.localhost](http://php70.nginx.localhost) the output of `phpinfo()` from PHP 7.0.

Now you can create any other virtual host files in `/usr/local/etc/nginx/servers` when you need to setup any sites in the future, you don't need to edit the file we just created.


## Proxy unhandled requests to Apache

Now we need to get Apache working again using *“real”* domain names without needing to add the `:8080` port to the end. We need to setup a new virtual host in Nginx which will catch any request not satisfied by our other Nginx virtual hosts, and will be proxied to Apache to be handled normally.

Make a new config file for your virtual host `/usr/local/etc/nginx/servers/_default.conf`

    #
    # Any unhandled requests should go to Apache
    #
    server {
        listen 80 default_server;
        server_name _;

        location / {
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_pass_request_headers on;
            proxy_pass http://127.0.0.1:8080;
        }
    }

This virtual host is set as the default and simply passes the request to port `8080` to be handled by Apache. Now that you've changed your Nginx config, you'll need to restart the server.

    $ sudo brew services restart nginx

So now if you go to any Apache virtual host you setup previously, it should still be working. Here are the two URLs we setup for Apache in the previous tutorial;

- Apache: PHP 7.0 – [http://php70.apache.localhost](http://php70.apache.localhost)
- Apache: PHP 5.6 – [http://php56.apache.localhost](http://php56.apache.localhost)


## Summary

Now you should have Nginx and Apache both setup with PHP 5.6 and PHP 7.0, all running at the same time without needing to stop one to start another.

If you got stuck at any point, and want to reference my configuration files, you can browse them here:
[https://github.com/lukearmstrong/localhost](https://github.com/lukearmstrong/localhost)

