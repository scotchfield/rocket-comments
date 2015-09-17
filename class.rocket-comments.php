<?php

class RocketComments {

	/**
	 * The domain for localization.
	 */
	const DOMAIN = 'rocket-comments';

	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init() {
		if ( isset( $_GET[ 'rocket-disable-dev' ] ) ) {
			return false;
		}

		if ( function_exists( 'is_plugin_active' ) && ! is_plugin_active( 'rest-api/plugin.php' ) ) {
			add_action( 'admin_init', array( $this, 'plugin_deactivate' ) );
			add_action( 'admin_notices', array( $this, 'plugin_deactivate_notice' ) );

			return false;
		}

		wp_register_script(
			'rocket-comments-script',
			plugins_url( '/js/rocket-comments.js', __FILE__ ),
			array( 'jquery', 'backbone', 'wp-api' ),
			'0.1.0',
			true
		);
		wp_register_style(
			'rocket-comments-style',
			plugins_url( '/css/rocket-comments.css', __FILE__ )
		);

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );

		add_filter( 'comments_template', array( $this, 'comments_template' ) );
		add_filter( 'rest_avatar_sizes', array( $this, 'avatar_sizes' ) );
		add_filter( 'rest_pre_insert_comment', array( $this, 'pre_insert_comment' ), 10, 2 );

		// TODO: Check with the WP-API team for the best way of getting the appropriate URL.
		// This doesn't feel right.
		add_filter( 'rest_url', array( $this, 'filter_rest_url' ), 10, 4 );
	}

	public function plugin_deactivate() {
		deactivate_plugins( plugin_dir_path( __FILE__ ) . '/rocket-comments.php' );
	}

	public function plugin_deactivate_notice() {
		echo '<div class="updated"><p><strong>Rocket Comments</strong> depends on <strong>WP-API</strong>. Please install and activate it first! Thanks!</p></div>';

		if ( isset( $_GET[ 'activate' ] ) ) {
			unset( $_GET[ 'activate' ] );
		}
	}

	public function comments_template( $comment_template ) {
		return dirname( __FILE__ ) . '/templates/comments.php';
	}

	public function enqueue_scripts() {
		wp_enqueue_script( 'rocket-comments-script' );
	}

	public function enqueue_styles() {
		wp_enqueue_style( 'rocket-comments-style' );
	}

	public function filter_rest_url( $url, $path, $blog_id, $scheme ) {
		return $url . 'wp/v2';
	}

	public function avatar_sizes( $sizes ) {
		array_push( $sizes, 56 );
		return $sizes;
	}

	public function pre_insert_comment( $prepared_comment, $request ) {
/*		print_r( $prepared_comment );
		print_r( $request );*/

		if ( is_user_logged_in() ) {
			$user = wp_get_current_user();

			if ( $prepared_comment['user_id'] != $user->ID ) {
				return false;
			}

			$prepared_comment['comment_author'] = $user->display_name;
			$prepared_comment['comment_author_email'] = $user->user_email;
			$prepared_comment['comment_author_url'] = $user->user_url;
			$prepared_comment['comment_author_IP'] = $_SERVER['REMOTE_ADDR'];
			$prepared_comment['comment_user_agent'] = $_SERVER['HTTP_USER_AGENT'];

		} else {
			return false;
		}

/*		print_r( $prepared_comment );
		exit;*/

		return $prepared_comment;
	}

}
