# SyntaxDB Atom Plugin

![Front](https://raw.githubusercontent.com/Coteh/syntaxdb-atom-plugin/master/screenshots/front.png)

An atom package that provides a simple interface to search and view the [SyntaxDB](https://syntaxdb.com/) database.

# Installation
For regular user installation, head over to the [Atom package page](https://atom.io/packages/syntaxdb-atom-plugin) and install it through there, or head over to `Preferences -> Install` in Atom and search for "syntaxdb-atom-plugin".

You can also install it via the command line by entering:
```
apm install syntaxdb-atom-plugin
```

# How to Use
To use the atom package, make sure it's installed, then press Ctrl-Alt-S to activate the SyntaxDB search panel.
To activate the language filter, which displays all concepts on the SyntaxDB database by language, press Ctrl-Alt-L.

![Search View](https://raw.githubusercontent.com/Coteh/syntaxdb-atom-plugin/master/screenshots/SearchView.gif)  
*SyntaxDB plugin search bar*

On the search panel, type in a search query (eg. "for loop in Java") and press enter. A list view will then appear, displaying the results
it has gathered from the SyntaxDB API. Selecting any of these results will bring up a results view for the entry, displaying
its syntax as well as additional information.

![Results View](https://raw.githubusercontent.com/Coteh/syntaxdb-atom-plugin/master/screenshots/ResultsView.gif)  
*Currently, the results view displays notes, syntax, example(s), and documentation about the specified syntax.*

It is also possible to place the syntax example provided by SyntaxDB directly into your document. To do this, make sure the Example tab
is currently selected, then press the "Place in Document" button. (or press shift-enter)

![Placing Example into Document](https://raw.githubusercontent.com/Coteh/syntaxdb-atom-plugin/master/screenshots/PlaceExample.gif)  
*Example of placing an example into a document.*

# Development
To install the package for development purposes, first clone the repository:
```
git clone https://github.com/Coteh/syntaxdb-atom-plugin.git
```

Navigate to root directory of project and install dependencies:
```
npm install
```

Then link the package:
```
apm link
```
This will create a symlink in your Atom packages folder to your clone of the repository, effectively installing it.

Whenever you make a change to the package, reload Atom window to see the changes.

# Issues
- Previous tab shortcut registers twice if not released immediately. [#2](https://github.com/Coteh/syntaxdb-atom-plugin/issues/2)
- [View more issues here](https://github.com/Coteh/syntaxdb-atom-plugin/issues)

# Future Additions
- Finish spec tests
- Improve package activation time
- Save common results to cache (via View serialization or some other method)
