<?php

function get_tests_dir() {
	$_tests_dir = getenv( 'WP_TESTS_DIR' );

	if ( ! $_tests_dir ) {
		$_tests_dir = '/tmp/wordpress-tests-lib';
	}

	return $_tests_dir;
}

function _manually_load_plugin() {
	require get_tests_dir() . '/vendor/wp-api/plugin.php';

	require dirname( __FILE__ ) . '/../../rocket-comments.php';
}

require_once get_tests_dir() . '/includes/functions.php';

tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );

require get_tests_dir() . '/includes/bootstrap.php';
