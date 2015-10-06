<?php
/*
Plugin Name: Rocket Comments
Plugin URI: http://sgrant.ca/
Description: Responsive comments with WP-API
Author: Scott Grant
Version: 0.1
Author URI: http://sgrant.ca/

Text Domain: rocket-comments
Domain Path: /languages/
*/

require_once 'class.rocket-comments.php';

$wp_rocket_comments = new RocketComments();
