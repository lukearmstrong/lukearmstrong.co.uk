---
layout: default
date: 2014-02-04 23:00
title: Portfolio
description: Work completed whilst employed at The Higgs Design Company and Propeller Communications
---

# Portfolio


## Work completed whilst employed at The Higgs Design Company.

---

### Patina
[http://ipatina.com](http://ipatina.com) (under development)

Bespoke Web Application designed to replicate the functionality of an iOS App currently under development by another company.

- Lead Developer
- PHP 5.5
- [Laravel Framework](http://laravel.com/) (v4.1)
- Using the [Parse.com REST API](https://parse.com/docs/rest), for:
	- User Authentication
		- In conjunction with [Facebook Login](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/) and [Twitter Authentication](https://dev.twitter.com/docs/auth/implementing-sign-twitter) oAuth Services.
	- Querying and Searching Data
	- Creating, Modifying and Deleting Data
- Using [Amazon Simple Storage Service (S3)](http://aws.amazon.com/s3/), for:
	- Storing Images
	- Storing Videos
- Using [Amazon Elastic Transcoder](http://aws.amazon.com/elastictranscoder/) to transcode videos to other formats to reduce filesize and increase browser compatibility.
- Created an API, usage:
	- The App will upload an image or a video to Amazon S3
	- The App will then send a request to our API with the Parse Session Token and Parse Object ID for the record associated with the Image/Video.
	- We then authenticate requests from the App using [Parse.com Authentication](https://parse.com/docs/rest#users-validating)
	- If the object is:
		- An image, we download the original image from S3 and resize it into two more sizes and upload them back to S3.
		- A video, we send a request to the Amazon Elastic Transcoder to generate other formats from the video.
- [Apache Ant](http://ant.apache.org/) build script to reduce number of requests, and filesize, by:
	- Converting all [LESS](http://lesscss.org/) files into a single CSS file, and minifying.
	- Concatenating all JavaScript files into a single file, and minifying using Google's [Closure Compiler](https://developers.google.com/closure/compiler/)


---


### The Student Energy Project
[http://studentenergyproject.com](http://studentenergyproject.com) (development completed, but not launched)

This is a private system setup to process meter readings from smart electricity meters and display usage on graphs. The
project is designed to incentivise students living in halls of residence to reduce their energy usage below a recommended
usage allowance. For each unit they save, they earn X number of points, which can be spent on rewards provided by partners.

- Lead Developer
- PHP 5.5
- [Laravel Framework](http://laravel.com/) (v4.0)
- [Artisan commands](http://laravel.com/docs/commands) created to run as cron jobs, these:
	- Download meter readings from a custom built SOAP API.
	- Process the downloaded data into a usable format.
- Bespoke content management system to allow the entire system to be administered.
	- Able to create, update, delete:
		- Meters
		- Usage Profiles
		- Sites
		- Buildings
		- Rooms
		- Students
		- Rewards
	- Able to import a CSV to import Meters, Usage Profiles, Sites, Buildings and Rooms in bulk.
- Graphing using [Chart.js](http://www.chartjs.org/)
- [Apache Ant](http://ant.apache.org/) build script to reduce number of requests, and filesize, by:
	- Converting all [LESS](http://lesscss.org/) files into a single CSS file, and minifying.
	- Concatenating all JavaScript files into a single file, and minifying using Google's [Closure Compiler](https://developers.google.com/closure/compiler/)


---


### RMP Connect
[http://rmpenterprise.co.uk/products/rmp-connect](http://rmpenterprise.co.uk/products/rmp-connect)

This is a private SaaS system designed to allow companies to easily import, and search, the data they have collected when
interacting with students. This allows them to target specific groups of students when they are looking to recruit
placement or graduate students.

- Lead Developer
- PHP 5.4
- [Laravel Framework](http://laravel.com/) (v4.0)
- Authentication with roles. (The system can be completely managed by RMP Enterprise using the admin interface.)
- Import Data
	- From CSV
	- From [Akkroo](https://akkroo.com/) via the [Akkroo REST API](http://docs.akkroo.com/developers/api/)
- Export Data
	- To CSV
	- To [Pure360](http://www.pure360.com/) E-Mail Marketing System.
- Search/Filter for Students by:
	- University
	- Course
	- Start Year
	- Placement Year
	- Graduation Year
	- UCAS Points
	- Predicted/Final Grade
	- Interests
	- Programmes
	- Interactions
	- Gender
	- International
	- Favourites
- Each Student has a profile which can be used to record comments and to list Interactions; Events the student attended.
- [Apache Ant](http://ant.apache.org/) build script to reduce number of requests, and filesize, by:
	- Converting all [LESS](http://lesscss.org/) files into a single CSS file, and minifying.
	- Concatenating all JavaScript files into a single file, and minifying using Google's [Closure Compiler](https://developers.google.com/closure/compiler/)


---


### Natural Ketosis
[http://www.naturalketosis.co.uk/store/custom](http://www.naturalketosis.co.uk/store/custom)

This was an existing website developed in CodeIgniter before I joined The Higgs Design Company. I setup an integration with the Shopify API to pull back products, collections, tags and used them to build a custom interface to allow a customer to select the quantities of each product in their diet box.

The user gets sent through the Shopify checkout proceedure with a single product in their order, but the note indicates which items they have selected.

This allows our client to easily manage the products that could go into a box.




---


### Le Scarpe
[http://www.lescarpe.co.uk/](http://www.lescarpe.co.uk/)

Converted a static HTML/CSS build to a Shopify template.


---

## Work completed whilst employed at Propeller Communications.

---


### Orlebar Brown
[http://www.orlebarbrown.co.uk/](http://www.orlebarbrown.co.uk/)

- Lead Developer
- PHP 5.3
- [FuelPHP](http://fuelphp.com/) MVC Framework
- Bespoke CMS & E-Commerce system
- Database Design
- [Netsuite](http://www.netsuite.com/) Integration for managing products, price lists, stock levels, orders, and customers.
- [Sagepay](http://www.sagepay.com/) Integration for accepting payment at the checkout; PCI compliant.
- [Feefo](http://www.feefo.com/) Integration, an independent customer feedback system.
- OB Club Membership system, giving subscribers a 10% discount on orders, and integrated with our e-marketing system.
- Customer account login area, showing details of previous orders, and making the checkout process quicker by pre-filling address details.
- [Apache Ant](http://ant.apache.org/) build script to reduce number of requests, and filesize, by:
	- Concatenating all CSS files into a single file, and minifying using Yahoo's [YUI Compressor](http://yui.github.com/yuicompressor/).
	- Concatenating all JavaScript files into a single file, and minifying using Google's [Closure Compiler](https://developers.google.com/closure/compiler/)
- Geolocation
- [GNU gettext](http://en.wikipedia.org/wiki/Gettext) for translating static text throughout the code, and dynamic text stored in the database.
- Multiple sites, for different countries, in different currencies, with stock in different warehouses, and written in different languages.
	- [United Kingdom](http://www.orlebarbrown.co.uk/): English, GBP £, UK Warehouse
	- [United States of America](http://www.orlebarbrown.com/): US English, USD $, US Warehouse
	- [Germany](http://www.orlebarbrown.de/): German, EUR €, UK Warehouse
	- [Australia](http://www.orlebarbrown.au.com/): English, Initially AUD $, Changed to GBP £, UK Warehouse
- Mobile Sites
	- [United Kingdom](http://mobile.orlebarbrown.co.uk/): English, GBP £, UK Warehouse


---


### Young's Hotels
[http://www.youngshotels.co.uk/](http://www.youngshotels.co.uk/)

- Lead Developer
- PHP 5.2
- [CodeIgniter](http://ellislab.com/codeigniter) MVC Framework (with a Bespoke ORM)
- Bespoke CMS
- Online availability search and multiple room booking facility integrated with [Micros](http://www.micros.com/) (Opera).
- [Google Maps](https://developers.google.com/maps/) Integration
- Microsites for each Hotel
	- Content controlled by the main website's CMS
	- Availability search and booking integrated with main site.
	- 17 Websites:
		- [Alexander Pope, Twickenham](http://www.alexanderpope.co.uk/)
		- [The Bear, Esher](http://bearesher.co.uk/)
		- [Brewers Inn, Wandsworth](http://www.brewersinn.co.uk/)
		- [Brook Green, Hammersmith](http://www.brookgreenhotel.co.uk/)
		- [Bull's Head, Chislehurst](http://www.thebullsheadhotel.co.uk/)
		- [Duke's Head, Wallington](http://www.dukesheadsurrey.co.uk/)
		- [Red Lion, Radlett](http://www.redlionradlett.co.uk/)
		- [Riverside Inn, Chelmsford](http://www.riversideinnessex.co.uk/)
		- [The Alma, Wandsworth](http://www.almawandsworth.com/)
		- [The Bridge, Greenford](http://www.thebridgehotel.com/)
		- [The City Gate, Exeter](http://www.citygatehotel.com/)
		- [The Coach & Horses, Kew](http://www.coachhotelkew.co.uk/)
		- [The Crown, Chertsey](http://www.crownchertsey.co.uk/)
		- [The Foley, Claygate](http://www.thefoley.co.uk/)
		- [The Greyhound, Carshalton](http://www.greyhoundhotel.net/)
		- [The Rose & Crown, Wimbledon](http://www.roseandcrownwimbledon.co.uk/)
		- [The Windmill, Clapham](http://www.windmillclapham.co.uk/)


---


### XL Video
[http://www.xlvideo.tv/](http://www.xlvideo.tv/)

- Lead Developer
- PHP 5.2
- Bespoke CMS
- [Google Maps](https://developers.google.com/maps/) Integration
- UK site built initially, modified to serve 5 more countries, some featuring multiple languages. (7 sites are currently live, more could go live if the content was translated.)
	- [United Kingdom](http://www.xlvideo.tv/): English
	- [Belgium](http://en.xlvideo.be/): English
	- [France](http://www.xlvideo.fr/): French
	- [Germany](http://www.xlvideo.de/): German
	- [Germany](http://en.xlvideo.de/): English
	- [Netherlands](http://en.xlvideo.nl/): English
	- [United States of America](http://www.xlvideo.us.com/): English


---


### Gill Marine
[http://www.gillmarine.com/gb/](http://www.gillmarine.com/gb/)

- Developer
- PHP 5.2
- Bespoke CMS & E-Commerce
- [Sagepay](http://www.sagepay.com/) Integration for accepting payment at the checkout; PCI compliant.
- [Google Maps](https://developers.google.com/maps/) Integration
- UK site built initially, modified to serve several other countries in different languages.
	- [United Kingdom](http://www.gillmarine.com/gb/): English, GBP £
	- [Australia](http://www.gillmarine.com/au/): English, AUD $
	- [Denmark](http://www.gillmarine.com/dk/): English, Danish Krone KR
	- [France](http://www.gillmarine.com/fr/): French,  EUR €
	- [Germany](http://www.gillmarine.com/de/): German, EUR €
	- [Greece](http://www.gillmarine.com/gr/): English, EUR €
	- [Ireland](http://www.gillmarine.com/ie/): English, EUR €
	- [Italy](http://www.gillmarine.com/it/): Italian, EUR €
	- [Netherlands](http://www.gillmarine.com/nl/): English, EUR €
	- [New Zeland](http://www.gillmarine.com/nz/): English, NZD $
	- [Norway](http://www.gillmarine.com/no/): English, Norwegian Krone KR
	- [Portugal](http://www.gillmarine.com/pt/): English,  EUR €
	- [Russia](http://www.gillmarine.com/ru/): English, Russian Ruble РУБ
	- [Spain](http://www.gillmarine.com/es/): English, EUR €
	- [Sweden](http://www.gillmarine.com/se/): English, Swedish Krona KR
	- [Turkey](http://www.gillmarine.com/tr/): English, Turkish Lira TL


- B2B site (under development)
	- Lead Developer
	- PHP 5.4
	- [FuelPHP](http://fuelphp.com/) MVC Framework
	- [Apache Ant](http://ant.apache.org/) build script to reduce number of requests, and filesize, by:
		- Converting [LESS](http://lesscss.org/) to CSS, and minifying using Yahoo's [YUI Compressor](http://yui.github.com/yuicompressor/).
		- Concatenating all JavaScript files into a single file, and minifying using Google's [Closure Compiler](https://developers.google.com/closure/compiler/).
	- Integrated with their internal systems that manage Sales Reps, Accounts, Orders, Prices, Stock.
	- Private system requiring username and password to access.
	- Uses the existing B2C database for content.
	- Available in multiple languages:
		- English
		- French
		- German
		- Italian
	- Each account has it's own price list, prices are either in:
		- GBP £
		- EUR €
	- Users able to create orders for their account.
	- Sales Reps able to create orders for the accounts they manage, and modify prices on a per order basis.


---


### Maintenance/Changes:

Hundreds more sites, the agency has developed over 1000 websites.


---


## Links

**CV:**        [http://lukearmstrong.co.uk/cv/](http://lukearmstrong.co.uk/cv/)

**GitHub:**    [https://github.com/lukearmstrong](https://github.com/lukearmstrong)

**Linked In:** [http://uk.linkedin.com/pub/luke-armstrong/59/a01/557/](http://uk.linkedin.com/pub/luke-armstrong/59/a01/557/)

**Twitter:**   [@6c61](https://twitter.com/6c61)


