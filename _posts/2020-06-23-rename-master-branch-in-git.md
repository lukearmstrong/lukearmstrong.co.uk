---
date: 2020-06-23 08:00
title: Rename master branch in git
description: Things you might want to consider before doing this, and troubleshooting issues afterwards.
opengraph_image: 2020-06-23-rename-master-branch-in-git.png
---

This isn't something that needs to be debated, the words we use matter, so I've decided to stop using the following words...

- master
- slave
- whitelist
- blacklist

I found myself using them a lot when talking about infrastructure or configuration, but depending on what you are talking about, there are lots of alternatives.

| Word      | Alternatives                       |
|-----------|------------------------------------|
| master    | primary, main                      |
| slave     | secondary, mirror, replica, worker |
| whitelist | allow list                         |
| blacklist | deny list, blocklist               |

This is not an exhaustive list, on either side of the table, but you can easily find many more synonyms in a [thesaurus](https://www.thesaurus.com/) for a word you want to stop using.


## Renaming the master branch in git

We talked about this where I work, and we've settled on using `main` as our default branch name. It's short and self-explanatory, and as a bonus it starts with `ma` so when using tab-completion on the command line you won't be frustrated when typing from muscle-memory.

You can pick whatever you like though, `production` or `live` or `develop` may suit you better depending on your git workflow and how you like to handle development and releases.


### On a new repository

```
git init
git checkout -b main
```

That's it.

Whilst `master` is the default name for your branch if you made a commit without creating a branch, it will never exist if you create a `main` branch and then commit.


### On an existing repository

There are a couple of things you'll need to consider before doing this.


#### 1. Services

If you have scripts or other services that rely on a branch called `master` existing, you will need to create your new `main` branch and re-configure these to use it instead.

These services could be continuous integration systems running automated tests, continuous delivery systems deploying your application to servers, or settings like default branch settings on GitHub, or branch policies for pull requests.

It might not even be possible to change it, I can't change the branch name for this repository because GitHub Pages builds from the `master` branch for a _"user"_ repository. If this was a _"project"_ repository, then I could choose to build from the `gh-pages` branch.


#### 2. People

If you work in a team, you shouldn't just decide to do this without talking about it first. Whilst it doesn't need to be debated, someone may know of another script or a service you weren't aware of.

But even if you are confident you have everything covered, you would be a complete dick if you caused someone to lose their work, or unable to merge their pull-request, or unable to deploy changes to the application because they didn't know you had reconfigured services.

Communication is critical. If you don't tell them, the `master` branch will come back the next time they push anyway, and they will continue to branch from it and merge into it, so this isn't just something you can decide to do on your own.

Before you do anything, checkout `master` and make sure you are up to date.

```
git checkout master
git fetch -p
git merge --ff-only
git log --graph --oneline
```

`master` is like any other branch. There is nothing special about it. A branch is simply a label pointing to a single commit.

So, all you need to do is create a new branch and start using that instead.

```
git checkout -b main
git push origin main -u
```

`master` and `main` are now pointing to the same commit. As your new branch is now available remotely, you can re-configure any services or scripts or settings to use the new `main` branch.

At the very least you'll need to use the GitHub web interface to set your new default branch to be `main`.

Once you have re-configured all services, I would recommend you delete the `master` branch to avoid confusion. First, delete the `master` branch locally.

```
git branch -d master
```

Then you will need to delete the `master` branch remotely. Here is the command to delete a remote branch from the command line:

```
git push origin --delete master
```

You will usually find that you get a permissions error, and you have to do this using the GitHub web interface to delete the branch instead.

That's it.


---


### Troubleshooting

#### Errors from git

I renamed the `master` branch to `main` for a repository hosted on BitBucket, using the web interface, and received this error the next time I did a fetch.

```
# (refs/remotes/origin/HEAD has become dangling)
```

Then when trying to use tab-completion, I kept getting this error.

```
# warning: ignoring broken ref refs/remotes/origin/HEAD
```

After googling the error and finding the answer on Stack Overflow, I learned that you can see what `origin/HEAD` is pointing to by running this command:

```
git symbolic-ref refs/remotes/origin/HEAD
# refs/remotes/origin/master
```

To fix it, you just need to make `origin/HEAD` point to `origin/main`

```
git symbolic-ref refs/remotes/origin/HEAD refs/remotes/origin/main
```

You can now check this has worked by running:

```
git fetch -p
git symbolic-ref refs/remotes/origin/HEAD
# refs/remotes/origin/main
```


#### GitHub Pages

Earlier I mentioned how I couldn't create a new branch called `main` and get GitHub Pages to build from it as it was stuck on `master`. It appears there are two types of repository, a _"user"_ repository and a _"project"_ repository. I created this years ago and called the repository `lukearmstrong.github.io` which designated it as a special _"user"_ repository so GitHub pages would automatically build from `master`, and this setting could not be changed.

In the end I created a new repository on GitHub, called `lukearmstrong.co.uk` and this designated it as a _"project"_ repository, which allowed me to build from a `gh-pages` branch, so I created this branch in my existing repository locally and pushed it to the new remote.

Remember to delete the CNAME file in your old repository first. The easiest way to do this is by using the GitHub settings interface for the old repository, and removing the text in the "Custom domain" field and hitting save. This will then allow you to use the domain for your new repository by just leaving the CNAME file in your local repository.

```
git remote rename origin old
git checkout -b gh-pages
git branch -d master
git remote add origin git@github.com:lukearmstrong/lukearmstrong.co.uk.git
git push origin gh-pages -u
git remote remove old
```

The only branch that exists on my new GitHub repository is `gh-pages` which is fairly self-explanatory as to what it does, and GitHub Pages is able to use this to build my Jekyll blog from.
