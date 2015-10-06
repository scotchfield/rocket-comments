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
		if ( isset( $_GET[ 'rocket-nojs' ] ) ) {
			return false;
		}

		/**
		 * Rocket Comments depends on the REST API. If it's not installed and active, we should deactivate.
		 */
		if ( ! defined( 'REST_API_VERSION' ) ) {
			add_action( 'admin_init', array( $this, 'plugin_deactivate' ) );
			add_action( 'admin_notices', array( $this, 'plugin_deactivate_notice' ) );

			return false;
		}

		if ( $this->development_enabled() ) {

			wp_register_script( 'rocket-comments-commentmodel', plugins_url( '/js/models/CommentModel.js', __FILE__ ), array( 'jquery', 'backbone', 'wp-api' ), $in_footer = true );
			wp_register_script( 'rocket-comments-commentview', plugins_url( '/js/views/CommentView.js', __FILE__ ), array( 'rocket-comments-commentmodel' ), $in_footer = true );
			wp_register_script( 'rocket-comments-commentsview', plugins_url( '/js/views/CommentsView.js', __FILE__ ), array( 'rocket-comments-commentview' ), $in_footer = true );
			wp_register_script( 'rocket-comments-commentscollection', plugins_url( '/js/collections/CommentsCollection.js', __FILE__ ), array( 'rocket-comments-commentsview' ), $in_footer = true );

			wp_register_script(
				'rocket-comments-script',
				plugins_url( '/js/rocket-comments.js', __FILE__ ),
				array( 'jquery', 'backbone', 'wp-api', 'rocket-comments-commentsview' ),
				'0.1.0',
				true
			);

		} else {

			wp_register_script(
				'rocket-comments-script',
				plugins_url( '/js/rocket-comments.min.js', __FILE__ ),
				array( 'jquery', 'backbone', 'wp-api' ),
				'0.1.0',
				true
			);

		}

		wp_register_style(
			'rocket-comments-style',
			plugins_url( '/css/rocket-comments.css', __FILE__ )
		);

		$result = load_plugin_textdomain(
			'rocket-comments',
			FALSE,
			dirname( plugin_basename( __FILE__ ) ) . '/languages/'
		);

		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_styles' ) );

		add_filter( 'comments_template', array( $this, 'comments_template' ) );
		add_filter( 'rest_avatar_sizes', array( $this, 'avatar_sizes' ) );
		add_filter( 'rest_pre_insert_comment', array( $this, 'pre_insert_comment' ), 10, 2 );
		add_filter( 'rest_prepare_comment', array( $this, 'rest_prepare_comment' ), 10, 3 );

		add_action( 'admin_init', array( $this, 'my_admin_init' ) );
		add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );

		// TODO: Check with the WP-API team for the best way of getting the appropriate URL.
		// This doesn't feel right.
		add_filter( 'rest_url', array( $this, 'filter_rest_url' ) );
	}

	public function plugin_deactivate() {
		deactivate_plugins( plugin_dir_path( __FILE__ ) . '/rocket-comments.php' );
	}

	public function plugin_deactivate_notice() {
		echo '<div class="updated"><p>' .
			__('<strong>Rocket Comments</strong> depends on <strong>WP-API</strong>. Please install and activate it first! Thanks!', 'rocket-comments' ) .
			'</p></div>';

		if ( isset( $_GET[ 'activate' ] ) ) {
			unset( $_GET[ 'activate' ] );
		}
	}

	/**
	 * Override the default comment template and substitute with our own.
	 * This filter is only triggered when the user views a single post and has JavaScript enabled.
	 */
	public function comments_template( $comment_template ) {
		return dirname( __FILE__ ) . '/templates/comments.php';
	}

	public function enqueue_scripts() {
		if ( $this->development_enabled() ) {
			wp_enqueue_script( 'rocket-comments-commentmodel' );
			wp_enqueue_script( 'rocket-comments-commentview' );
			wp_enqueue_script( 'rocket-comments-commentsview' );
			wp_enqueue_script( 'rocket-comments-commentscollection' );
		}

		wp_enqueue_script( 'rocket-comments-script' );
	}

	public function enqueue_styles() {
		wp_enqueue_style( 'rocket-comments-style' );
	}

	public function filter_rest_url( $url ) {
		return $url . 'wp/v2';
	}

	public function add_admin_menu() {
		$page = add_options_page(
			esc_html__( 'Rocket Comments', 'rocket-comments' ),
			esc_html__( 'Rocket Comments', 'rocket-comments' ),
			'manage_options',
			'rocket-comments',
			array( $this, 'plugin_settings_page' )
		);
	}

	public function get_comment_style_list() {
		$comment_style_list = array(
			'default' => array(
				'description' => __( 'Default (twentyfifteen, twentyfourteen, twentythirteen)', 'rocket-comments' ),
				'template' => plugin_dir_path( __FILE__ ) . 'templates/comment-default.php',
			),
			'alternate-1' => array(
				'description' => __( 'Alternate 1 (writr)', 'rocket-comments' ),
				'template' => plugin_dir_path( __FILE__ ) . 'templates/comment-below.php',
			),
		);

		$comment_style_list = apply_filters( 'rocket-comments-commentstyle', $comment_style_list );

		return $comment_style_list;
	}

	public function my_admin_init() {
		register_setting(
			'rocket-comments-group',
			'rocket-comments-commentstyle',
			array( $this, 'comment_style_validate' )
		);
		add_settings_section(
			'rocket-comments-section-commentstyle',
			__( 'Comment Style', 'rocket-comments' ),
			array( $this, 'comment_style_callback' ),
			'rocket-comments'
		);
		add_settings_field(
			'rocket-comments-field-commentstyle',
			__( 'Comment Template Style', 'rocket-comments' ),
			array( $this, 'comment_style_radio_callback' ),
			'rocket-comments',
			'rocket-comments-section-commentstyle'
		);

		register_setting(
			'rocket-comments-group',
			'rocket-comments-dev-js',
			array( $this, 'development_enabled_validate' )
		);
		add_settings_section(
			'rocket-comments-section-dev-js',
			__( 'Development Mode Enabled', 'rocket-comments' ),
			array( $this, 'development_enabled_callback' ),
			'rocket-comments'
		);
		add_settings_field(
			'rocket-comments-field-dev-js',
			__( 'Development Mode Enabled', 'rocket-comments' ),
			array( $this, 'development_enabled_checkbox_callback' ),
			'rocket-comments',
			'rocket-comments-section-dev-js'
		);
	}

	public function comment_style_callback() {
		_e( 'Change the way your comments are displayed.', 'rocket-comments' );
	}

	public function comment_style_radio_callback() {
		$comment_style_list = $this->get_comment_style_list();
		$comment_style = get_option( 'rocket-comments-commentstyle', 'default' );

		foreach ( $comment_style_list as $style_id => $style_data ) {
			$checked = '';
			if ( $style_id == $comment_style ) {
				$checked = 'checked="checked"';
			}
?>
			<label>
				<input type="radio" <?php echo $checked; ?> value="<?php echo esc_attr( $style_id ); ?>" name="rocket-comments-commentstyle">
				<?php esc_html_e( $style_data['description'] ); ?>
			</label>
			<br>
<?php
		}
	}

	public function comment_style_validate( $input ) {
		$comment_style_list = $this->get_comment_style_list();

		if ( ! isset( $comment_style_list[ $input ] ) ) {
			$input = 'default';
		}

		return $input;
	}

	public function development_enabled() {
		$dev_js = get_option( 'rocket-comments-dev-js', '' );

		return $dev_js == 'on';
	}

	public function development_enabled_callback() {
		_e( 'Turn off minified JavaScript and use the regular version.', 'rocket-comments' );
	}

	public function development_enabled_checkbox_callback() {
		$checked = $this->development_enabled() ? 'checked' : '';

?>
		<input type="checkbox" <?php echo $checked; ?> name="rocket-comments-dev-js">
<?php
	}

	public function development_enabled_validate( $input ) {
		if ( ! in_array( $input, array( 'on', '' ) ) ) {
			$input = '';
		}

		return $input;
	}

	public function plugin_settings_page() {
?>
	<div class="wrap">
		<h1><?php _e( 'Rocket Comments', 'rocket-comments' ); ?></h1>
		<form action="options.php" method="POST">
			<?php settings_fields( 'rocket-comments-group' ); ?>
			<?php do_settings_sections( 'rocket-comments' ); ?>
			<?php submit_button(); ?>
		</form>
	</div>
<?php
	}

	/**
	 * Ensure that we also retrieve avatars that are 56x56.
	 * Why? Great question! Our goal is to copy the look and feel of the twenty* themes, which use avatars of this size.
	 */
	public function avatar_sizes( $sizes ) {
		array_push( $sizes, 56 );
		return $sizes;
	}

	public function pre_insert_comment( $prepared_comment, $request ) {
		if ( is_user_logged_in() ) {
			$user = wp_get_current_user();

			if ( ! isset( $prepared_comment['user_id'] ) || $prepared_comment['user_id'] != $user->ID ) {
				return false;
			}

			$prepared_comment['comment_author'] = $user->display_name;
			$prepared_comment['comment_author_email'] = $user->user_email;
			$prepared_comment['comment_author_url'] = $user->user_url;
			$prepared_comment['comment_author_IP'] = isset( $_SERVER['REMOTE_ADDR'] ) ? $_SERVER['REMOTE_ADDR'] : '';
			$prepared_comment['comment_user_agent'] = isset( $_SERVER['HTTP_USER_AGENT'] ) ? $_SERVER['HTTP_USER_AGENT'] : '';

		} else {
			// TODO: Handle anonymous comments
		}

		return $prepared_comment;
	}

	public function get_comment_time( $comment ) {
		if ( ! isset( $comment->comment_date ) ) {
			return '';
		}

		$format = get_option( 'time_format' );
		$date = mysql2date( $format, $comment->comment_date, true );

		return apply_filters( 'get_comment_time', $date, $format, false, true, $comment );
	}

	public function rest_prepare_comment( $data, $comment, $request ) {
		if ( ! isset( $comment->comment_ID ) ) {
			return $data;
		}

		$updates = array(
			'comment_date' => get_comment_date( '', $comment->comment_ID ),
			'comment_time' => $this->get_comment_time( $comment ),
			'edit' => 0,
		);

		if ( current_user_can( 'edit_comment', $comment->comment_ID ) ) {
			$updates['edit'] = 1;
		}

		foreach ( $updates as $k => $v ) {
			$data->data[ $k ] = $v;
		}

		return $data;
	}

}
