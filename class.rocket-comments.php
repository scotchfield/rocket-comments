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

		/**
		 * Don't load minified JS if we're in development mode. Otherwise, minify-load!
		 */
		if ( $this->development_enabled() ) {

			wp_register_script( 'rocket-comments-commentmodel', plugins_url( '/js/models/Comment.js', __FILE__ ), array( 'jquery', 'backbone', 'wp-api' ), $in_footer = true );
			wp_register_script( 'rocket-comments-commentview', plugins_url( '/js/views/Comment.js', __FILE__ ), array( 'rocket-comments-commentmodel' ), $in_footer = true );
			wp_register_script( 'rocket-comments-commentsview', plugins_url( '/js/views/Comments.js', __FILE__ ), array( 'rocket-comments-commentview' ), $in_footer = true );
			wp_register_script( 'rocket-comments-commentscollection', plugins_url( '/js/collections/Comments.js', __FILE__ ), array( 'rocket-comments-commentsview' ), $in_footer = true );

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

		if ( $this->use_wp_die_handler() ) {
			$this->rest_start_wp_die_handler();
		}

		return true;
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
			'Rocket Comments',
			'Rocket Comments',
			'manage_options',
			'rocket-comments',
			array( $this, 'plugin_settings_page' )
		);
	}

	/**
	 * Ship with a default set of supported styles.
	 * Also enable a filter so custom theme support can be added when necessary.
	 */
	public function get_comment_style_list() {
		$comment_style_list = array(
			'default' => array(
				'description' => __( 'Default', 'rocket-comments' ),
				'template' => plugin_dir_path( __FILE__ ) . 'templates/comment-default.php',
			),
			'alternate-1' => array(
				'description' => __( 'Alternate 1', 'rocket-comments' ),
				'template' => plugin_dir_path( __FILE__ ) . 'templates/comment-below.php',
			),
			'alternate-2' => array(
				'description' => __( 'Alternate 2', 'rocket-comments' ),
				'template' => plugin_dir_path( __FILE__ ) . 'templates/comment-cite.php',
			),
		);

		$comment_style_list = apply_filters( 'rocket-comments-commentstyle', $comment_style_list );

		return $comment_style_list;
	}

	/**
	 * Use the Settings API to show our admin panel.
	 */
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
			'rocket-comments-fetch-time',
			array( $this, 'fetch_time_validate' )
		);
		add_settings_section(
			'rocket-comments-section-fetch-time',
			__( 'Seconds between comment fetch', 'rocket-comments' ),
			array( $this, 'fetch_time_callback' ),
			'rocket-comments'
		);
		add_settings_field(
			'rocket-comments-field-fetch-time',
			__( 'Number of seconds', 'rocket-comments' ),
			array( $this, 'fetch_time_checkbox_callback' ),
			'rocket-comments',
			'rocket-comments-section-fetch-time'
		);

		register_setting(
			'rocket-comments-group',
			'rocket-comments-wp-die-handler',
			array( $this, 'wp_die_handler_validate' )
		);
		add_settings_section(
			'rocket-comments-section-wp-die-handler',
			__( 'Convert wp_die errors to JSON responses', 'rocket-comments' ),
			array( $this, 'wp_die_handler_callback' ),
			'rocket-comments'
		);
		add_settings_field(
			'rocket-comments-field-wp-die-handler',
			__( 'Convert wp_die to JSON', 'rocket-comments' ),
			array( $this, 'wp_die_handler_checkbox_callback' ),
			'rocket-comments',
			'rocket-comments-section-wp-die-handler'
		);
	}

	public function development_enabled() {
		return defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG;
	}

	public function comment_style_callback() {
		esc_html_e( 'Change the way your comments are displayed.', 'rocket-comments' );
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
				<input type="radio" <?php echo esc_attr( $checked ); ?> value="<?php echo esc_attr( $style_id ); ?>" name="rocket-comments-commentstyle">
				<?php esc_html_e( $style_data['description'] ); ?>
			</label>
			<br>
<?php
		}
	}

	/**
	 * We expect that a valid input is one of the keys in our comment style list object.
	 */
	public function comment_style_validate( $input ) {
		$comment_style_list = $this->get_comment_style_list();

		if ( ! isset( $comment_style_list[ $input ] ) ) {
			$input = 'default';
		}

		return $input;
	}

	public function fetch_time() {
		return intval( get_option( 'rocket-comments-fetch-time', 30 ) );
	}

	public function fetch_time_callback() {
		esc_html_e( 'Rocket Comments will periodically refresh the post comments. You can change the number of seconds between each asynchronous request. (Default: 30, No Refresh: 0)', 'rocket-comments' );
	}

	public function fetch_time_checkbox_callback() {
		$seconds = $this->fetch_time();

?>
		<input type="text" name="rocket-comments-fetch-time" value="<?php echo esc_attr( $seconds ); ?>">
<?php
	}

	public function fetch_time_validate( $input ) {
		$input = intval( $input );

		if ( $input < 0 ) {
			$input = 0;
		}

		return $input;
	}

	public function use_wp_die_handler() {
		return get_option( 'rocket-comments-wp-die-handler' ) == 'on';
	}

	public function wp_die_handler_callback() {
		esc_html_e( 'When submitting or retrieving comments, some errors may use the WordPress wp_die function. Rocket Comments can catch those and return them as JSON warnings.', 'rocket-comments' );
	}

	public function wp_die_handler_checkbox_callback() {
		$checked = $this->use_wp_die_handler() ? 'checked' : '';

?>
		<input type="checkbox" name="rocket-comments-wp-die-handler" <?php echo esc_attr( $checked ); ?>>
<?php
	}

	/**
	 * A validated input is a checkbox that is either on or off.
	 */
	public function wp_die_handler_validate( $input ) {
		if ( ! in_array( $input, array( 'on', '' ) ) ) {
			$input = '';
		}

		return $input;
	}

	public function plugin_settings_page() {
?>
	<div class="wrap">
		<h1>Rocket Comments</h1>
<?php
		$suggest_obj = array(
			'twentythirteen' => __( 'Default', 'rocket-comments' ),
			'twentyfourteen' => __( 'Default', 'rocket-comments' ),
			'twentyfifteen' => __( 'Default', 'rocket-comments' ),
			'writr' => __( 'Alternate 1', 'rocket-comments' ),
			'swift' => __( 'Alternate 2', 'rocket-comments' ),
		);

		$theme = wp_get_theme();
		$suggest = ( isset( $suggest_obj[$theme->get( 'TextDomain' )] ) ) ? $suggest_obj[$theme->get( 'TextDomain' )] : __( 'Default', 'rocket-comments' );
?>
		<p><?php
		printf(
			__( 'Your current theme is <strong>%1$s</strong>. We suggest using the <strong>%2$s</strong> style.', 'rocket-comments' ),
			esc_attr( $theme ), esc_attr( $suggest )
		);
		?></p>

		<form action="options.php" method="POST">
			<?php settings_fields( 'rocket-comments-group' ); ?>
			<?php do_settings_sections( 'rocket-comments' ); ?>
			<?php submit_button(); ?>
		</form>

		<p><?php
		if ( $this->development_enabled() ) {
			esc_html_e( 'Using non-minified scripts.', 'rocket-comments' );
		} else {
			esc_html_e( 'Using minified scripts.', 'rocket-comments' );
		}
		?></p>
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

	/**
	 * Ensure that the comment has some default attributes in place.
	 */
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

	/**
	 * Use existing functionality to get the correct comment time.
	 */
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

		if ( is_object( $data ) && property_exists( $data, 'data' ) ) {
			foreach ( $updates as $k => $v ) {
				$data->data[ $k ] = $v;
			}
		}

		return $data;
	}

	/**
	 * Aggregate data for the comment template.
	 */
	public function get_comment_options() {
		$options = array( 'data' => array() );

		$current_user = wp_get_current_user();
		$options['current_user'] = wp_get_current_user();

		$options['data']['user-id'] = intval( $current_user->ID );
		$options['data']['user-name'] = esc_html( $current_user->display_name );
		$options['data']['user-avatar'] = esc_url( get_avatar_url( $current_user->ID ) );
		$options['data']['post-id'] = intval( get_the_ID() );

		$options['data']['threaded'] = get_option( 'thread_comments', true ) ? intval( get_option( 'thread_comments_depth' ) ) : 1;

		$options['data']['page-comments'] = intval( get_option( 'page_comments' ) );
		$options['data']['comment-page'] = 1;
		$options['data']['comments-per-page'] = $options['data']['page-comments'] ? intval( get_option( 'comments_per_page' ) ) : 0;
		$options['data']['comment-order'] = ( $options['data']['page-comments'] > 0 && 'newest' == get_option( 'default_comments_page' ) ) ? 'DESC' : 'ASC';

		$options['data']['fetch-time'] = intval( $this->fetch_time() );

		$options['require_name_email'] = esc_attr( get_option( 'require_name_email' ) );
		$options['redirect_no_js_url'] = esc_url( add_query_arg( 'rocket-nojs', '1' ) );

		return $options;
	}

	public function rest_start_wp_die_handler() {
		add_filter( 'wp_die_handler', array( $this, 'rest_wp_die_handler_callback' ) );
	}

	public function rest_stop_wp_die_handler() {
		remove_filter( 'wp_die_handler', array( $this, 'rest_wp_die_handler_callback' ) );
	}

	public function rest_wp_die_handler_callback( $function ) {
		return array( $this, 'rest_wp_die_handler' );
	}

	public function rest_wp_die_handler( $message, $title = '', $args = array() ) {
		if ( $title ) {
			$message = "$title: $message";
		}

		$status = isset( $args['response'] ) ? $args['response'] : 500;

		$response = array(
			'message' => wp_kses( $message ),
			'data' => array( 'status' => esc_attr( $status ) )
		);

		status_header( $status );
		echo json_encode( array( $response ) );

		exit;
	}

}
