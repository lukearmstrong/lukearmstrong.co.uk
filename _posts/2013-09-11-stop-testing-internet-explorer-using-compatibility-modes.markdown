---
layout: post
date: 2013-09-11 10:27
title: "Stop testing in Internet Explorer using compatibility modes"
description: "TL;DR? Use a VM instead!"
---

Since Internet Explorer 8, it has been possible to change the _Browser Mode_ and _Document Mode_ to emulate previous versions of Internet Explorer. These were originally intended for making new versions of Internet Explorer work with websites developed by people that ignored web standards.

These compatibility modes are not a substitute for testing in the actual version of that browser, on the operating system that it is likely to be used on. Standalone installers, such as IE Tester, are emulators and cannot be trusted to provide an accurate testing environment either.

We have a Windows 8 machine in the office for testing, it has Internet Explorer 10 installed on it.

Today we received an e-mail from a client; One of their customers had reported a problem with the website, and was unable to make an order. We didn't know which version of Internet Explorer their customer was using, so we used each compatibility mode to try to reproduce the bug. All of the compatibility modes we tried seemed to work fine, so I decided to test using a VM instead.

![VirtualBox](/images/2013-09-11-stop-testing-internet-explorer-using-compatibility-modes/virtualbox.png)

It turns out we had left a `console.log()` in our JavaScript code, this caused IE7 to throw an error.


---

### Resources

Microsoft recently launched [modern.IE](http://www.modern.ie/) where you can [download virtual machine images](http://www.modern.ie/en-us/virtualization-tools#downloads) for various versions of Windows and Internet Explorer.

I recommend that you use [VirtualBox](https://www.virtualbox.org/) to run the VMs - it is free, open source and works on Windows, Mac OSX and Linux.