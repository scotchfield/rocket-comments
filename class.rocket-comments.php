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
		add_filter( 'rest_prepare_comment', array( $this, 'rest_prepare_comment' ), 10, 3 );

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
			__(' <strong>Rocket Comments</strong> depends on <strong>WP-API</strong>. Please install and activate it first! Thanks!', 'rocket-comments' ) .
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
			'metadata-below' => array(
				'description' => __( 'Metadata below (writr)', 'rocket-comments' ),
				'template' => plugin_dir_path( __FILE__ ) . 'templates/comment-below.php',
			),
		);

		$comment_style_list = apply_filters( 'rocket-comments-commentstyle', $comment_style_list );

		return $comment_style_list;
	}

	public function plugin_settings_page() {
		echo '<h1>' . __( 'Rocket Comments', 'rocket-comments' ) . '</h1>';

		$comment_style_list = $this->get_comment_style_list();

		if ( isset( $_POST[ 'comment-style' ] ) &&
				isset( $_POST[ 'rocket-comments-nonce' ] ) &&
				wp_verify_nonce( $_POST[ 'rocket-comments-nonce' ], 'rocket-comments-update' ) ) {

			if ( isset( $comment_style_list[ $_POST[ 'comment-style' ] ] ) ) {
				update_option( 'rocket-comments-commentstyle', $_POST[ 'comment-style' ] );
?>
<div class="updated">
	<p>
		<strong><?php _e( 'Settings saved.', 'rocket-comments' ); ?></strong>
	</p>
</div>
<?php
			}
		}

		$comment_style = get_option( 'rocket-comments-commentstyle', 'default' );

?>
<form method="post" action="admin.php?page=rocket-comments">
<?php
		wp_nonce_field( 'rocket-comments-update', 'rocket-comments-nonce' );
?>
<table class="form-table">
	<tbody>
		<tr>
			<th scope="row">Comment Style</th>
			<td>
				<fieldset>
					<legend class="screen-reader-text"><span>Comment Style</span></legend>
<?php
		foreach ( $comment_style_list as $style_id => $style_data ) {
			$checked = '';
			if ( $style_id == $comment_style ) {
				$checked = 'checked="checked"';
			}
?>
					<label>
						<input type="radio" <?php echo $checked; ?> value="<?php esc_attr_e( $style_id ); ?>" name="comment-style">
						<?php esc_html_e( $style_data['description'] ); ?>
					</label>
					<br>
<?php
		}
?>
				</fieldset>
			</td>
		</tr>
	</tbody>
</table>
<p class="submit">
	<input type="submit" name="submit" id="submit" class="button button-primary" value="Save Changes" />
</p>
</form>
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
