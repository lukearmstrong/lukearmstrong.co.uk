---
layout: post
date: 2012-11-18 11:15
title: "CAPTCHA"
description: "Only make your users do it once!"
---


The other day I noticed a couple of links on a Wikipedia page were broken. So I thought I would edit the page to fix the links, should only take a minute - or so I thought.

When I went to edit the page there was a warning recommending I create an account.

> You are not currently logged in. If you save any edits, your IP address will be recorded publicly in this page's edit history. If you create an account, you can conceal your IP address and be provided with many other benefits. Messages sent to your IP can be viewed on your talk page.


So I decided to create an account. It recommended I choose a username that identifies me personally, so I chose _lukearmstrong_ as my username. I completed the CAPTCHA, filled out the form, and hit submit...

> Login error
> Username entered already in use. Please choose a different name.


The form was cleared except the username. So I completed the CAPTCHA again, changed my username to _luke_armstrong_, re-entered my password again, and again, and hit submit...

> Login error
> The name "Luke armstrong" is too similar to the existing account:
> Lukearmstrong (contribs)
> Please choose another name.


## Bloody Hell!

So I completed the CAPTCHA again, changed my username to *6c61*, re-entered my password again, and again, and hit submit.


## Finally!

Then I got an e-mail asking to confirm my address, so clicked the link and logged into my new account.


## But... Wikipedia still wasn't conviced I was human

I went to edit the page to fix the links, previewed my changes to make sure the links worked, marked it as a minor edit, then hit save.

The page reloaded, but this time at the top of the page was another CAPTCHA. Give me strength... I had invested this much time into it already, so I just sighed and completed the CAPTCHA to save my edit to the page.


## I don't hate CAPTCHAs

I understand why Wikipedia needs to use a CAPTCHA; If it didn't, it wouldn't be too long before some cretin made a bot to insert links in pages to dodgy websites selling pills that will probably make your cock drop off; [Their explanation is here](http://en.wikipedia.org/wiki/Special:Captcha).

Wikipedia isn't the only site that does this, nearly every website that uses a CAPTCHA behaves like this, it was just the straw the broke the camel's back.


## Solution

The answer is very simple... **Ask me once**.

Ask me once really does mean just once. Some of you reading this article may not consider this next scenario.

Even if I fail a validation rule on the form, but successfully complete the CAPTCHA, don't reload the sodding form with another CAPTCHA. Check if the user has successfully completed the CAPTCHA, and simply flag their session as being human so they are never prompted to fill out a CAPTCHA on the current form, or on any form, from then on.

It really isn't that much extra effort, but makes a big difference on forms where you may have to fill them out several times because you have to pick a username that no one else has picked.
