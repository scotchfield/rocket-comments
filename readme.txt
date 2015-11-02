=== Rocket Comments ===
Contributors: sgrant
Donate link: http://scootah.com/
Tags: comment, comments, ajax, wp-api, json-api, json
Requires at least: 4.3-alpha
Tested up to: 4.4-beta
Stable tag: 1.0
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Responsive comments with the WordPress REST API.

== Description ==

Replace the standard WordPress comment system with a Backbone-powered single-page approach using the power of the WordPress REST API.

- Comments are loaded asynchronously and stored as Backbone models.
- Submitting new comments or replies to existing comments are handled without reloading the page, and added to the active page as necessary.
- New comments load automatically without a page refresh.
- Built to respect the comment form structure used by the twenty* themes.
- Support for single-page comment pagination.

== Installation ==

Place all the files in a directory inside of wp-content/plugins (for example, rocket-comments), and activate the plugin. Ensure that the <a href="https://wordpress.org/plugins/rest-api/">WordPress REST API (Version 2)</a> plugin is installed and activated.

== Frequently Asked Questions ==

= Why do my comments look bad? =

Rocket Comments replaces the existing WordPress comment form with a new template. While this works with many existing themes, it's possible that your theme uses a different template, or has a custom style that makes the comments look worse. You can visit the Rocket Comments settings page and change the Comment Style to see if that helps.

If you still see problems, Rocket Comments offers an optional filter. If you have development experience, you can hook into it and write your own template based on your existing style. (Please let us know if you do so we can bring your changes into the plugin for other users!)

= Why are my comments not updating unless I reload the page? =

You can try visiting the Rocket Comments settings page and making sure that the "Seconds between comment fetch" option is set to a value greater than zero.

== Screenshots ==

1. Threaded comments that look just like existing WordPress comments.
2. A comment form that looks like existing WordPress comment forms. Notices are displayed using a non-invasive status bar in the top-right corner of the screen.
3. The Rocket Comments settings page, with a number of customizable options.

== Changelog ==

= 1.0 =
* First release!

== Upgrade Notice ==

= 1.0 =
First public release.
