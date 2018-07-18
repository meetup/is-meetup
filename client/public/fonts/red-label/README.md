__Contents__

1. [Red Label](#red-label)
    * [What and why](#what-and-why)
2. [Requirements](#requirements)
	* [Installing Command Line Tools](#installing-command-line-tools)
3. [Coding with Red Label](#coding-with-red-label)
	* [How it works in HTML](#how-it-works-in-html)
	* [How it works in CSS](#how-it-works-in-css)
		* [Size Markup](#size-markup)
		* [Type Markup](#type-markup)
		* [Accessibility](#accessibility)
4. [Designing with Red Label](#designing-with-red-label)
	* [Designing a new icon](#designing-a-new-icon)
	* [Scaling Up](#scaling-up)
	* [Adding to or Updating red-label.glyphs](#adding-to-or-updating-red-labelglyphs)
		* [Create a feature branch](#create-a-feature-branch)
		* [Open Glyphs](#open-glyphs)
		* [Updating a Character](#updating-a-character)
		* [Or, Adding a New Character](#or-adding-a-new-character)
		* [Exporting from Glyphs](#exporting-from-glyphs)
		* [Building Font Changes](#building-font-changes)
		* [Updating SCSS When Adding Icons](#updating-scss-when-adding-icons)
5. [Creating a Release](#creating-a-release)
	* [Do not merge pull requests into master](#do-not-merge-pull-requests-into-master)
	* [New Release Process](#new-release-process)
6. [Resolving Merge Conflicts](#resolving-merge-conflicts)
	* [Conflicts in Binary Font Files](#conflicts-in-binary-font-files)
	* [Conflicts in Glyph Files](#conflicts-in-glyph-files)
7. [Updating Github Pages](#updating-github-pages)
8. [Updating Red Label on Meetup.com](#updating-red-label-on-meetupcom)
	* [Meetup's git server](#meetup's-git-server)
	* [Chapstick](#chapstick)
	* [QA](#qa)

# Red Label

An icon font named for Meetup's logo, and, purportedly, a favored scotch of Winston Churchill.

http://meetup.github.io/red-label

## What and why

An icon font is a custom font that has icons instead of letters and numbers in parts (or the entire) font space. 

Icon fonts are an alternative to traditional method of CSS Spriting, which involved putting a number of small images together in one large image, then adjusting background-position properties to show the right part of that image.

As sprites get old, they get out of date, and perhaps don't get updated. Suddenly, you end up with multiple image requests and a lot of difficult to maintain code.

Sprites are also not resolution-agnostic. As we serve images to many different display densities and resolutions, with sprited images, we would have to generate a sprite for each display resolution (sprites_1x, sprites_1.5x, sprites_2x, etc).

Instead, we can use an icon font, which means we maintain one set of icons that works nearly everywhere, is resolution-agnostic, is easy to work with in code, and provides a place to go for the "canonical" version of an icon shape.



# Requirements

- Mac OS X 10.6 or higher.
- Xcode 4.0 or higher.

For Glyph Creation:
- [Glyphs Mini][a]: font editing software. We have a license; ask systems if you would like a copy.
- Your favorite image editing software: for creating and bitmap-tuning vectors before adding them into Glyphs.

For Command Line and Font Generation:
- [Antimony][b]: a commandline toolkit I built for Meetup that will take an Opentype font (`.otf`) and export it into browser-friendly formats. __This is currently in "alpha" territory, and has only been tested on OSX, and not Linux.__
- [Sass][d]
- [Jekyll][e]

## Installing Command Line Tools

Red Label needs a few different command line tools in order to generate new builds.

To install dependencies, open a terminal and go to the red label repo. Then run:

```bash
$ ./install
```

All the dependencies should install.

[a]: http://glyphsapp.com/glyphs-mini/
[b]: https://github.com/sjhcockrell/antimony/
[d]: http://sass-lang.com
[e]: http://jekyllrb.com



# Coding with Red Label

## How it works in HTML

Red Label is simple to use in HTML. Here's how you add an icon of a lock:

```html
<i class="icon-lock"></i>
```

That's it. You can adjust the size you want it to appear with a CSS class, or a custom font-size.

Red Label uses the `<i>` element for icons in HTML. Using the `<i>` seems like a reasonable practice, since `<em>` is favored for emphasis in HTML5. This leaves `<i>` available for non-semantic presentational markup.


## How it works in CSS

Red Label comes with _size_ and _type_ class markup in `sass/red-label.scss`.

### Size Markup

Red Label is designed to look good on an 8px grid. You can use any size you want for the icons, but they're designed to look good at these stock font sizes.

```css
.icon-s  { font-size: 16px } /* 1   */
.icon-m  { font-size: 24px } /* 1.5 */
.icon-l  { font-size: 32px } /* 2   */
.icon-xl { font-size: 64px } /* 4   */
```

### Type Markup

Red Label uses the `:before` CSS pseudoelement to insert a unicode character inside an `<i>` (or any other element) you apply an icon class to.

All icon classes follow this CSS naming convention: `.icon-` + description of the icon.

Open `sass/red-label.scss` to read more.

### Accessibility

Using CSS `:before` and `:after` pseudo-elements works with Voice Over on Mac and JAWS. 

We use the `:after` pseudoelement in Red Label icon classes to provide a bit of invisible contextual data, so that a screen reader, when it encounters a lock icon, will read out loud "A lock icon," instead of something that is confusing.

# Designing with Red Label

Red Label is designed to look good at on a base-8 grid on multiples of 16. (16, 24, 32, etc). This takes advantage of the browser's default font sizing, where 1em = 16px.


## Designing a new icon

Start with a new 16x16 (or whichever canvas size is closest to the size you want your icon to be) canvas in Photoshop. 

Paste the desired icon as a shape layer (or vector image) into Photoshop. 

Snap the vector to the nearest pixels as much as possible. This eliminates fuzzy pixels, and reduces the potential for the browser's anti-aliasing algorithms to make the icons blurry.

> NOTE: If your icon looks crisp at a 16px font size on a standard 1x resolution monitor, it will work great for other resolutions and larger sizes.

## Scaling Up

After your pixel-snapped vector shape looks good, you need to scale the image size such that the canvas is 2048x2048.

Each character in Glyphs is intended to have a bounding box of 2048x2048 pixels. This is because the font is set up to use 2048 pixels-per-em to ensure high-resolution icons when we transfer our vectors in. (For now, this seems to have minimal affect on the font size in KB.)

In Photoshop, go to `Image > Image Size`. Update the pixel dimensions to 2048 x 2048.

## Adding to or Updating red-label.glyphs

### Create a feature branch

Before making any changes, you should create a new feature branch off of `master`.

First, make sure master is up to date and isn't dirty. (This means it doesn't have uncommitted changes.)

```bash
$ git checkout master
$ git pull
```

Then, create a feature branch.

```bash
$ git branch YOUR_BRANCH_NAME_HERE
$ git checkout YOUR_BRANCH_NAME_HERE
```

### Open Glyphs

In the `meetup/red-label` repository, the master glyphs file is stored in `glyphs/red-label.glyphs`. Go ahead and open it.

You should see an interface divided into a few sections. All of Red Label's icons are stored in the "Other" section, the default place where Glyphs shows unicode characters.

### Updating a Character

Double click on any existing character. It should open in a new tab.

Delete the existing path.

Copy and paste your scaled-up vector shape from Photoshop to Glyphs.

### Or, Adding a New Character

Press the "plus" button on the bottom bar of the app window. Alternatively, you can select `Glyphs > New Glyph`.

You should see a new glyph added with the default name of `newGlyph`.

Double click on this new glyph. It will open in a new tab.

By default, all new glyphs will have a default width of 600. You probably want your icon to fit neatly in a square.

Click on `W: 600` in the floating window, and change 600 to 2048.

Copy and paste your scaled-up vector shape from Photoshop to Glyphs.

Now, we need to give this glyph an unused unicode space.

Read through the SCSS file, `sass/red-label.scss`, to find a unicode character value that makes sense.

If `E000` were available, for example, you can either click on the `newGlyph` entry on the floating window where you edited the character width value, OR double click on the glyph name while looking at the whole font.

### Exporting from Glyphs

Glyphs lets us export a `.otf` file. All other font file types are generated from the `.otf` version.

Go to `File > Export`, or press `⌘+E`. 

Change the export destination to point to the `/font/` folder in the red-label repository.

Press `Next` and `Export Font`.

### Building Font Changes

Assuming you have [antimony][b] installed, run

```bash
$ ./build
```

And you're done.

If you're making significant changes, you should update the github pages.

### Updating SCSS When Adding Icons

You need to add a new CSS `.icon-*` class hook so that people can use your icon.

Open `sass/_red-label-core.scss`.

Add an `@include icon(...)` statement, and provide a class name,  the unicode character that you want shown, and some accessibility text.

You're done.

# Creating a Release

## Do not merge pull requests into `master` - target `dev`

__IMPORTANT__: Do not merge pull requests that have not been validated by QA in Chapstick into `red-label:master`. We'll have to cherry-pick them out onto a feature branch again so that other folks don't work from busted code.

Instead, target all pull requests to the `dev` branch, from which releases will be cut. `master` will reflect only what has been deployed to production.

## New Release Process

Creating releases on `master` has created unpleasant dependency issues, so the release process and scripts have changed slightly.

- Create a new release branch named `release_<tag number>`, cut from `dev`

```bash
[dev] $ git branch release_0.3.0
[dev] $ git checkout release_0.3.0
```

- All of the approved and merged pull requests should already be in your release branch, but you can manually merge any remaining feature branches going into this release into your `release_*` branch.

```bash
[release_0.3.0] $ git pull origin social_icons
[release_0.3.0] $ git pull origin settings_icons
```

- Run the `make-release.sh` script on your `release_*` branch. This will create a tag referring to the head of your branch.
- When prompted by the release script, add a tag name (in this case, 0.3.0, which matches the release branch name) and a brief message.

```bash
[release_0.3.0] $ ./make-release
```

- Go to [Releases in Github](https://github.com/meetup/red-label/releases).
- Press "Draft a New Release"
- Choose the tag you just created (e.g. 0.3.0).
- Mark it as a __Pre-release__
- When it's been validated in Chapstick by QA, merge your `release_*` branch into `master`, _and_ merge it separately into `dev`, then delete the branch.

# Resolving Merge Conflicts

Red Label has a mix of binary and non-binary files font-related files. Binary files can't be diffed in git.

For example:
- `*.eot`, `*.woff`, `*.ttf`, and `*.otf` files are binary files.
- `*.glyphs` and `*.svg` files are JSON-like and XML-like non-binaries.

In places where there are merge conflicts, binary files will almost always be a culprit.

## Conflicts in Binary Font Files

Since there's no way to resolve merge conflicts in binary files, the solution is to remove all the files in the `font/` directory and re-run the `build.sh` script after resolution.

## Conflicts in Glyph Files

Occasionally, you'll end up with conflicts in the glyphs files. Usually, these are minor.

Examples:
- timestamps on when a character was edited don't match because a character was edited in two separate branches
- the most recently edited character metadata at the top of the `*.glyphs` file differs.

You can edit the `red-label.glyphs` file in your favorite text editor or difftool, and resolve the conflicts by hand.

Before committing the conflict resolution, open the `red-label.glyphs` file in Glyphs to make sure the file hasn't become corrupted. As long as everything's there, you're good to go.

# Updating Github Pages

There are two ways to update GH Pages using the update-ghpages script.

To update GH pages, run the following from the repo root:

```bash
$ ./update-ghpages
```

If you run update-ghpages while on a feature branch, you'll generate docs at `http://meetup.github.io/red-label/branches/<your branch name>/`.

If you run update-ghpages from master, you'll generate new master docs, viewable at `http://meetup.github.io/red-label/`.

# Updating Red Label on Meetup.com

## Meetup's git server

Because we don't want to have a dependency on Github for a production build, we maintain a separate remote endpoint for Red Label on our own servers.

If you want to update Red Label in Chapstick, you have to push your tags to the repo of Red Label on our own servers as well as Github's.

__Technically, you don't need to worry about this, since the make-release script will push your new tag to both Github and Chapstick for you. But if you want more control, keep reading.__

### Setting up a Chapstick Remote

Adding a named remote called "chapstick" in your Red Label git repo can make this a bit easier to remember if you have to debug things.

Here's what you'd do:

```bash
$ git remote add chapstick ssh://git.dev.meetup.com/usr/local/git_repo/red-label.git
$ git remote -v
```

You should see two remotes now: "chapstick" and "origin."

To push tags to chapstick without using the make-release script, you can now:

```bash
$ git push --tags chapstick
```

You should see any new version tags noted in git's output.

## Chapstick

SSH into your devbox.

```bash
$ cd /usr/local/meetup/
$ git submodule status
```

This tells us what version of redlabel our branch has. A good command to know!

```bash
$ cd /usr/local/meetup/gitmodules/red-label
$ git describe
```

This tells us the same thing, from inside the submodule.

First, we need to pull down any new tags that've been created:

```bash
$ git fetch --tags
```

Now we need to checkout the new tag:

```bash
$ git checkout <new_version_tag>
```

Then, commit this change:

```bash
$ cd /usr/local/meetup
$ git add gitmodules/red-label
$ git commit -m "Upgraded to Red Label <new_version_tag>"
```

And rebuild, to wrap things up.

```bash
$ ant
```

Once you've rebuilt using `ant`, you should see your changes to icons on dev.


### What if there's QA conflicts?

If there's a conflict in qa, it means that some other branch wants a different version of red-label. You can *probably* resolve that just by having all the branches ask for the same (highest) version of red-label.

### More Info

There's more info on using submodules in chapstick in

    /usr/local/meetup/gitmodules/README.md

## QA

For the most part, we're QA-ing releases ourselves, rather than having them QA-ed from chapstick.

When adding a Chapstick bug, you can run `./update-ghpages` to create a Github page for the release. The script should generate a URL that looks like `http://meetup.github.io/red-label/branches/release_0.3.0/`.

Just make sure all the glyphs are there, and they look the way that you think they should before shipping it to Chapstick.
