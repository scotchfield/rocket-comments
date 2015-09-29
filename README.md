# rocket-comments
Responsive comments with WP-API

[![Build status](https://api.travis-ci.org/scotchfield/rocket-comments.svg?branch=master)](https://travis-ci.org/scotchfield/rocket-comments)

## Overview
Replace the standard WordPress comment system with a Backbone-powered single-page approach using the power of WP-API.

- Comments are loaded asynchronously and stored as Backbone models.
- Submitting new comments or replies to existing comments are handled without reloading the page, and added to the active page as necessary.
- New comments load automatically without a page refresh.
- Built to respect the comment form structure used by the twenty* themes.
- Support for single-page comment pagination.