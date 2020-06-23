---
date: 2020-06-24 00:00
title: Self-Signed TLS/SSL Certificate
description: How to generate a self-signed certificate for developing locally.
opengraph_image: 2020-06-24-self-signed-ssl-certificate.jpg
---

When attempting to set up a self-signed SSL certificate for local development, you expect to get a warning from your browser and you can click something to ignore it and your site will load.

But this time I couldn't skip past the warning, it blocked the site over TLS/SSL (https://) entirely.

```
NET::ERR_CERT_INVALID
```

> localhost normally uses encryption to protect your information. When Google Chrome tried to connect to localhost this time, the website sent back unusual and incorrect credentials. This may happen when an attacker is trying to pretend to be localhost, or a Wi-Fi sign-in screen has interrupted the connection. Your information is still secure because Google Chrome stopped the connection before any data was exchanged.
>
> You cannot visit localhost at the moment because the website sent scrambled credentials that Google Chrome cannot process. Network errors and attacks are usually temporary, so this page will probably work later.

After some research it turned out that Apple had recently changed the requirements around TLS certificates which prevented browsers from letting you ignore the warning. (MacOS Catalina 10.15 / iOS 13)

- RSA keys must use key sizes greater than or equal to 2048 bits.
- Must use a hash algorithm from the SHA-2 family in the signature algorithm.
- Must present the DNS name of the server in the Subject Alternative Name extension of the certificate.
- Must contain an ExtendedKeyUsage (EKU) extension containing the id-kp-serverAuth OID.
- Must have a validity period of 825 days or fewer (as expressed in the NotBefore and NotAfter fields of the certificate).

_Source:_ [https://support.apple.com/en-us/HT210176](https://support.apple.com/en-us/HT210176)


## Generate Self-signed TLS (SSL) Certificate

So to meet these requirements we will need to create an config file for OpenSSL.

It's best to save this file in your project, as it will be project specific depending on the domain name you want to use locally. Create a new text file called `openssl.cnf`

```
[req]
default_bits           = 2048
default_md             = sha256
encrypt_key            = no
prompt                 = no
distinguished_name     = subject
req_extensions         = req_ext
x509_extensions        = x509_ext

[ subject ]
C                      = US
ST                     = New York
L                      = New York City
O                      = Liberty Island
OU                     = UNATCO Headquarters
emailAddress           = ajacobson@unatco.org
CN                     = localhost

[ req_ext ]
subjectKeyIdentifier   = hash
basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth, clientAuth
subjectAltName         = @alternate_names
nsComment              = "Self-Signed SSL Certificate"

[ x509_ext ]
subjectKeyIdentifier   = hash
authorityKeyIdentifier = keyid,issuer
basicConstraints       = CA:FALSE
keyUsage               = digitalSignature, keyEncipherment
extendedKeyUsage       = serverAuth, clientAuth
subjectAltName         = @alternate_names
nsComment              = "Self-Signed SSL Certificate"

[ alternate_names ]
DNS.1                  = localhost
DNS.2                  = example.test
DNS.3                  = www.example.test
IP.1                   = 127.0.0.1
```

You'll need to update the `example.test` and `www.example.test` lines with the domain name you are using locally.

Now you can run this command to generate the SSL certificate and private key.

```
openssl req -config openssl.cnf \
-new -sha256 -newkey rsa:2048 -nodes -keyout private.key \
-x509 -days 825 -out certificate.crt
```

When you use this certificate in your nginx config for your local development server, you should get this error in Chrome.

```
NET::ERR_CERT_AUTHORITY_INVALID
```

But this error you can bypass by clicking **Advanced** and **Proceed to localhost (unsafe)**.

You won't need to add the certificate to your Keychain, which is ideal when testing from other devices on your local network and using a service like [xip.io](http://xip.io/)
