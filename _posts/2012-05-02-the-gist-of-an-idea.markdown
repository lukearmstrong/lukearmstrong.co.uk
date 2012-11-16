---
layout: post
date: 2012-05-02 22:00
title: The gist of an idea...
description: Can GitHub Gists be used to source control a document between many collaborators?
---


I have ideas for projects all the time, but so far I haven't made any of them a reality yet. I could use my usual excuse that I don't have time, but I do have time; I just can't face doing any more work after spending 60 hours either at work, or getting to and from work, that week.

Perhaps if I write about it, and people like it, it might give me the motivation to actually do it. So here goes nothing...


## The Problem...

I need to write a Technical Specification for a large web development project I am going to start work on soon.

I have a lot of questions before this specification can be completed, and many of these questions will only become apparent when writing it, so it would be great if other people working on the project could collaborate with me on it.

Our current process for doing a Technical Specification is to write a .doc, attach it to an e-mail so other people in the team can add notes or print it out to scribble on, then give it back to me. The .doc has a habit of sitting in the recepient's inbox for awhile, in which time I may have already made changes. After a few rounds of this, people may be editing old versions of the document, and sending those around too.

I have a real problem with Word processors, I spend the majority of my time pissing around with the formatting. This isn't just because OpenOffice/LibreOffice destroys the formatting of a Word document, it is because I find it easy to get distracted by the appearance of the content, rather than focusing on the quality of the content. I hope it's not just me.

Anyway, as you can imagine, all of this bullshit ends up making the process take more time and effort than it should.


## There's always a but...

Why don't I just use X, Y or Z? I'm not in the habit of reinventing the wheel for the sake of it, I use lots of different software and services, I just haven't stumbled across anything that solves this problem; Even though many may claim to.

I'm under no illusion that I can solve this problem before I need to do the job at hand, but hopefully it will be done before I have to write the next one.


## The Solution?

A document like this tends to evolve, so it would be nice to view previous versions, merge edits between collaborators; The sorts of things source control systems are good at.


### Source Control

Natually I thought of Git, and then I thought of GitHub. I know GitHub use Git to handle more than just code, it is used for Wikis and Gists and all sorts of other things.

At first I was thinking that a user's document would be a file saved in a repository, as this would give the power of git, with the option of making it private, and they could have other files (images, etc) with the document. But I imagine most people want to keep their documents private, so the more documents people make, or forks other people make, the more private repositories someone will need, which may make the cost prohibitive.

As luck would have it, when I was looking at the GitHub API, I took a look at the section on Gists. Users can have unlimited Gists, Gists can be private, and a Gist isn't just one lump of text, it can be many lumps of text, and other files such as images. Gists are also repositories, so can be forked by other users.

This saves me a hell of a lot of work. Gists on their own would do the trick, but it would take an awful lot of convincing to get an account manager to ever consider using it. So all it really needs is a different front end, the user doesn't necessarily care what a Gist or a Git repository is.


### No Formatting

It's just a distraction.

Formatting is something that should only be done once the document is ready to be printed.

When writing, it's just plain text, or it could be (markdown/textile/etc) which may make it easier to export to a Word processor for formatting. (Headings, lists, links, basic formatting, etc)


### Sections

As Gists can have multiple files, a single document could be broken down into many sections, which may make it easier for collaborators to merge their work together, or for something as simple as denoting a page break.


### No File Formats

The content is what matters, not what version of a particular word processor you have available to you.


### Other Files

Documents like this often reference or contain other files, such as wireframes, flow-charts, etc. It might also be worth looking into [supporting GraphViz](http://www.idryman.org/blog/2012/04/04/jekyll-graphviz-plugin/) somehow to make creating some of these quicker.


### Potential Issues

The documentation for the GitHub API (v3) mentions there is a limit of 5000 API requests, this limit is tracked by a number of things. This may, or may not, which will only be determined when I start playing with the API.


## Stay tuned...

Getting tired now, may write more tomorrow. I've thought of a name... **Octodocs**

[lukearmstrong/octodocs](https://github.com/lukearmstrong/octodocs)
