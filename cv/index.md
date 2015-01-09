---
layout: page
date: 2014-02-04 23:00
title: CV
description: Curriculum Vitae for Luke Armstrong
---


I am a passionate developer who enjoys working within the fast evolving world of web development. My eight years of commercial experience within the industry has emerged from an initial interest at an early age, and is something which has lead to a continued pursuit of professional development on my part.

Initially a full time freelancer who completed sites outsourced by a local agency, I built up a portfolio before taking on outsourced projects from other agencies based in Liverpool, Brighton and Gloucestershire. Seeking employment was the next logical step, as the experience and knowledge that can be gained from working alongside other designers and developers is invaluable.


---

## Skills & Expertise

### Front-end Development
Hand-coded HTML5 and CSS3 and validated to W3C standards. Tested on several browsers across many platforms and devices. Using polyfills, or degrading gracefully, on browsers that do not support certain features. I have experience with Less and Sass pre-processors.

Responsive design is crucial now that many people are browsing using mobiles and tablets. Front-end optimization is even more important now that these devices are used over relatively slow free Wifi or 3G connections. I originally used Ant as my build tool, but am now using Gulp.

I am always researching and reading up about new techniques and tools, front-end development has evolved rapidly over the past few years.

### JavaScript
Using unobtrusive degradable techniques. I have experience writing with, and without, jQuery. Recently I have been using RequireJS to manage JavaScript files in projects. I have briefly played with Node.js using Express and Mongo.


### PHP
Experience writing bespoke web applications, content management systems and e-commerce systems. I have kept up with the latest releases of PHP, and switch to them as soon as they are released. I have experience with using Laravel, FuelPHP and CodeIgniter frameworks.

The PHP Community seems to have matured and become less fragmented over the past 2 years. I read up about projects like "PHP: The Right Way", and PHP-FIG: PSR 0/1/2/3/4. Composer is a very useful tool. I am interested in Symfony 2 components, "The League of Extraordinary Packages" and other interesting packages on packagist.

I'm predominately working with Laravel, currently using the beta for v5, though when working on smaller projects I will use Silex.

### MySQL
As I write bespoke CMS and e-commerce systems, these require me to design a database structure for each project. I am interested in monitoring applications and optimising queries to improve performance. I write migrations to create the database structure as this ensures the structure is kept under version control and it can be deployed on other servers easily, both of which are ideal for working in teams.

### Linux
I have used Ubuntu Linux as my workstation OS for the majority of my career, though did spend a year using a MacBook Air, which was nice. I have experience setting up and maintaining RHEL and Debian based servers. I have a Linode server, just to play with, it is running Ubuntu Server with Nginx, PHP 5.6, MySQL and Ruby (using Unicorn).

### Version Control Systems
Initially I started out with SVN whilst working at Propeller Communications, it was dreadfully slow, and a nightmare when it came to dealing with merge conflicts. We only put up with SVN for a single project, and switched to Mercurial for the next project. We used Mercurial for about a year, but once we started using frameworks that were hosted on GitHub, we made the switch to Git to be able to harness the power of Git submodules, and to easily contribute code back to the projects. I use Git in the command line.

---

## Experience


### Web Developer at [Intelligent Golf](http://www.intelligentgolf.co.uk/)
**08/2014 – 11/2014**

The intelligentgolf software is a web-based system, written in PHP, hosted on Amazon AWS.

Utilizing multiple (>20) EC2 Instances. Roughly 10 were permanent EC2 instances, running various services such as DNS (BIND Master and Slave), FTP, E-Mail (POP3/IMAP/SMTP/Webmail), Cron Jobs, Development Server, etc. The other EC2 instances servers are disposable web servers that were automatically provisioned and added to the ELB (elastic load balancer) scaling up to meet demand. When the traffic/usage reduced, instances were automatically removed from the ELB and terminated.

We also used various other AWS services:
- Amazon RDS; 2 MySQL instances setup with replication (master / slave)
- Amazon S3; to store all client specific content that wasn't committed to our git repository.
- Amazon ElastiCache; to store session data and cache content from S3.

I learnt an awful lot about building new servers, maintaining existing servers, and administering the various AWS services we were using. Whilst I was employed as a web developer, the operations side of the role was just as important, I found it very interesting.

The other side to my role was maintaining the intelligentgolf software, the code-base is predominately written in PHP and has been evolving over the past 8 years with the input from roughly 6 developers, all working at different times.

This resulted in over 500,000 lines of procedural PHP code with no documentation, no tests no comments, no consistency, mixtures of PHP/HTML/CSS/JS in the same file, no classes, functions using global variables, error reporting disabled, >8000 line files...

Depending on the client's requirements, it was integrated with various other competitors software, most of which did not have an API, so using an ODBC connection to a Microsoft Access database running on a Windows POS (Point of Sale) Till System was fun to debug.

I was the only full-time developer, and after 3 months I burn't myself out and resigned due to stress.


### Web Developer at [RMP Enterprise](http://rmpenterprise.co.uk/)
**03/2014 – 08/2014**

The Higgs Design Company has merged with RMP Enterprise, we have become the in-house development team for this very successful London based company.

I have joined RMP Enterprise to continue developing and maintaining web applications.


### Web Developer at [The Higgs Design Co.](http://higgsdesign.com/)
**04/2013 – 03/2014**

Working as part of a much smaller team, 2 developers and 2 designers, has given me valuable experience communicating with clients directly, and managing my time and resources to meet deadlines independently.

I have developed bespoke applications using v4 of the Laravel Framework. These applications have needed me to develop integrations using APIs from Akkroo, Amazon Web Services, Facebook, Twitter, Parse.com, Pure360, Shopify and bespoke APIs.


### Web Developer at [Propeller Communications](http://www.propcom.co.uk/)
**11/2009 – 04/2013**

Working as a developer at a successful agency with offices in Rugby and London. Here I developed bespoke CMS and e-commerce systems using PHP 5.4 and MySQL. I work alongside 40 other designers, front-end developers and back-end developers, with roughly 5-6 people on each project. I have lead the development of several projects.

We initially wrote every project from scratch, around a core library of reusable code. Then we decided to switch to using the CodeIgniter Framework, we used that for several projects, but when PHP 5.3 was released we moved onto using FuelPHP.

I have developed integrations using APIs from SagePay, Netsuite, Micros, Google Maps, Postcode Anywhere, and countless others.

Whilst the majority of our work is for clients, I have also been involved in the development of internal systems. We have developed our own e-marketing system that is used by hundreds of clients, I worked on part of the system that allows a user to build a mailer from a template.


### Web Developer at [FGI Training & Consultancy](http://www.fgiltd.co.uk/)
**08/2008 – 07/2009**

Working in-house, alongside a graphic designer and marketing executive, to re-brand the company and develop a new website with the ability to book training courses.

I built the site to the XHTML 1.0 Strict standard, with CSS 2, and unobtrusive and degradable JavaScript. It was developed without using a framework, and whilst it was not following the MVC pattern, I had separated controller logic and view code by using Smarty. I also wrote a database abstraction layer for MySQLi, and a session handling class which stored sessions in the database.

Shortly after launching the new site the spending on PPC campaigns was reduced significantly, as we were consistently ranked in the first 3 results for our search terms.


### Freelance Web Developer
**05/2006 – 08/2008**

Bespoke frontend, CMS and e-commerce development. Using ASP.NET 2.0 and MySQL or PHP and MySQL. Working entirely with agencies, they outsourced the development to me.



---


## Links

Portfolio: [http://lukearmstrong.co.uk/portfolio/](http://lukearmstrong.co.uk/portfolio/)

GitHub: [https://github.com/lukearmstrong](https://github.com/lukearmstrong)

LinkedIn: [https://www.linkedin.com/pub/luke-armstrong/59/a01/557](https://www.linkedin.com/pub/luke-armstrong/59/a01/557)
