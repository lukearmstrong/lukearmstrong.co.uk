---
date: 2020-06-25 08:00
title: Self-signed SSL Certificate
description: Developing locally using a self-signed SSL certificate.
opengraph_image: 2020-06-25-self-signed-ssl-certificate.png
---

If the self-signed SSL certificate expires and you need to regenerate it, then navigate to the SSL directory.

```
cd docker/nginx/ssl/
```

Generate the SSL certificate and private key.

```
openssl req -config openssl.cnf \
-new -sha256 -newkey rsa:2048 -nodes -keyout private.key \
-x509 -days 825 -out certificate.crt
```
