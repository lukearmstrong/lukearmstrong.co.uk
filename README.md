# My Blog

🌍[http://lukearmstrong.co.uk/](http://lukearmstrong.co.uk/)


## Development

### Getting Started

I am using [Jekyll](https://jekyllrb.com/) to build my blog as this is the first static site generator system [GitHub Pages](https://pages.github.com/) supported, so I've welcomed their kind offer of free hosting and decided to use this for my website.

Whilst MacOS comes with a version of [Ruby](https://www.ruby-lang.org/en/), I would recommend you install [rbenv](https://github.com/rbenv/rbenv) using [homebrew](https://brew.sh/) to allow you to install the latest version, and this will let you switch between different versions for different projects if you decide to use Ruby for other things.

```
brew install rbenv
```

Once you have configured rbenv for your shell and installed the latest version of Ruby.

```
rbenv install 2.7.1
rbenv global 2.7.1
```

You now need to install bundler, this is the recommended way to handle Ruby Gems (dependencies) for a project.

```
gem install bundler
```

To install the required Ruby Gems for this project, run:

```
bundle install
```

### Running Jekyll

To build the site locally, which will watch changes to your files, run:

```
bundle exec jekyll serve
```

Visit [http://localhost:4000](http://localhost:4000/) in your browser, you will need to refresh when you make changes.
