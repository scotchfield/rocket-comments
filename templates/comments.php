<?php

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}

function rocket_comments_comment_nav() {
	$newest_comments = 'newest' == get_option( 'default_comments_page' ) ? true : false;
?>
<nav class="navigation comment-navigation" role="navigation">
	<h2 class="screen-reader-text">
		<?php esc_html_e( 'Comment navigation', 'rocket-comments' ); ?>
	</h2>
	<div class="nav-links">
		<div class="nav-previous" id="comment-navigation-previous">
			<a><?php $newest_comments ? esc_html_e( 'Newer Comments', 'rocket-comments' ) : esc_html_e( 'Older Comments', 'rocket-comments' ); ?></a>
		</div>
		<div class="nav-next" id="comment-navigation-next">
			<a><?php $newest_comments ? esc_html_e( 'Older Comments', 'rocket-comments' ) : esc_html_e( 'Newer Comments', 'rocket-comments' ); ?></a>
		</div>
	</div>
</nav>
<?php
}

function rocket_comments_implode_comment_options( $options ) {
	$option_strings = array();

	foreach ( $options['data'] as $k => $v ) {
		array_push( $option_strings, 'data-' . esc_attr( $k ) . '="' . esc_attr( $v ) . '"' );
	}

	return implode( ' ', $option_strings );
}

global $wp_rocket_comments;
$wp_rocket_comments_options = $wp_rocket_comments->get_comment_options();

?>

<script type="text/javascript">
jQuery(function () {
	rocketComments.start();
});
</script>

<div id="comments" class="comments-area" <?php echo rocket_comments_implode_comment_options( $wp_rocket_comments_options ); ?>>

	<noscript>
		<a href="<?php echo esc_url( $wp_rocket_comments_options['redirect_no_js_url'] ); ?>"><?php esc_html_e( 'Click here to view comments on this post.', 'rocket-comments' ); ?></a>
	</noscript>

	<div id="wp-loading">
		<img src="<?php echo esc_url( plugins_url( '../images/wp-loading.gif', __FILE__ ) ); ?>">
	</div>

	<div id="comment-notify" data-default="<?php esc_html_e( 'Loading...', 'rocket-comments' ); ?>"></div>

	<div id="wp-comment-content">

		<h2 id="comment-single" class="comments-title">
			<?php printf( __( 'One thought on &ldquo;%s&rdquo;', 'rocket-comments' ), esc_html( get_the_title() ) ); ?>
		</h2>

		<h2 id="comment-multiple" class="comments-title">
			<?php printf( __( '<span id="comment-count"></span> thoughts on &ldquo;%s&rdquo;', 'rocket-comments' ), esc_html( get_the_title() ) ); ?>
		</h2>

<?php

rocket_comments_comment_nav();

?>

		<ol id="comment-root" class="comment-list"></ol>

<?php

if ( ! comments_open() &&
		get_comments_number() &&
		post_type_supports( get_post_type(), 'comments' ) ) {

?>
		<p class="no-comments">
			<?php esc_html_e( 'Comments are closed.', 'rocket-comments' ); ?>
		</p>
<?php

} else {

?>

		<div id="respond" class="comment-respond">
			<h3 id="reply-title" class="comment-reply-title title-reply">
				<?php esc_html_e( 'Leave a Reply', 'rocket-comments' ); ?>
				<small>
					<a rel="nofollow" id="cancel-comment-reply-link" href="<?php echo esc_url( get_permalink( get_the_ID() ) ); ?>#respond">
						<?php esc_html_e( 'Cancel reply', 'rocket-comments' ); ?>
					</a>
				</small>
			</h3>

			<h3 id="reply-title" class="comment-reply-title title-edit">
				<?php esc_html_e( 'Edit Comment', 'rocket-comments' ); ?>
				<small>
					<a rel="nofollow" id="cancel-comment-edit-link" href="<?php echo esc_url( get_permalink( get_the_ID() ) ); ?>#respond">
						<?php esc_html_e( 'Cancel', 'rocket-comments' ); ?>
					</a>
				</small>
			</h3>

<?php

	if ( get_option( 'comment_registration' ) && ! is_user_logged_in() ) {

?>
			<p class="must-log-in">
				<?php printf( esc_html__( 'You must be <a href="%s">logged in</a> to post a comment.' ), wp_login_url( apply_filters( 'the_permalink', get_permalink( get_the_ID() ) ) ) ); ?>
			</p>
<?php

		do_action( 'comment_form_must_log_in_after' );

	} else {

?>

			<form action="<?php echo esc_url( site_url( '/wp-comments-post.php' ) ); ?>" method="post" id="commentform" class="comment-form" novalidate>
<?php

		if ( is_user_logged_in() ) {

?>
				<div class="comment-author-logged-in" id="comment-author-logged-in">
					<p class="logged-in-as">
<?php
			$profile_url = '<a href="' . esc_url( get_admin_url( null, 'profile.php' ) ) . '">' . esc_html( $wp_rocket_comments_options['current_user']->display_name ) . '</a>';
			printf( esc_html__( 'Logged in as %s.', 'rocket-comments' ), $profile_url );
?>
						<a href="<?php echo esc_url( wp_logout_url( get_permalink() ) ); ?>" title="<?php esc_html_e( 'Log out of this account', 'rocket-comments' ); ?>"><?php esc_html_e( 'Log out?', 'rocket-comments' ); ?></a>
					</p>
				</div>
<?php

		}

?>
				<div class="comment-author-not-logged-in <?php if ( is_user_logged_in() ) { echo 'hidden'; } ?>" id="comment-author-not-logged-in">
					<p class="comment-notes">
						<span id="email-notes"><?php esc_html_e( 'Your email address will not be published.', 'rocket-comments' ); ?></span>
						<?php if ( $wp_rocket_comments_options['require_name_email'] ) {
							printf( __( 'Required fields are marked %s', 'rocket-comments' ), '<span class="required">*</span>' );
						} ?>
					</p>
					<p class="comment-form-author">
						<label for="author"><?php esc_html_e( 'Name', 'rocket-comments' ); ?><?php if ( $wp_rocket_comments_options['require_name_email'] ) { echo '<span class="required">*</span>'; } ?></label>
						<input id="author" name="author" type="text" value="" size="30" aria-required='true' required='required' />
					</p>
					<p class="comment-form-email">
						<label for="email"><?php esc_html_e( 'Email', 'rocket-comments' ); ?><?php if ( $wp_rocket_comments_options['require_name_email'] ) { echo '<span class="required">*</span>'; } ?></label>
						<input id="email" name="email" type="email" value="" size="30" aria-describedby="email-notes" aria-required='true' required='required' />
					</p>
					<p class="comment-form-url">
						<label for="url"><?php esc_html_e( 'Website', 'rocket-comments' ); ?></label> <input id="url" name="url" type="url" value="" size="30" />
					</p>
				</div>
				<p class="comment-form-comment">
					<label for="comment"><?php esc_html_e( 'Comment', 'rocket-comments' ); ?></label>
					<textarea id="comment" name="comment" cols="45" rows="8"  aria-required="true" required="required"></textarea>
				</p>
				<p class="form-submit">
					<input name="submit" type="submit" id="submit" class="submit" value="<?php esc_html_e( 'Post Comment', 'rocket-comments' ); ?>" />
					<input type='hidden' name='comment_post_ID' value='<?php echo esc_attr( get_the_ID() ); ?>' id='comment_post_ID' />
					<input type='hidden' name='comment_parent' id='comment_parent' value='0' />
				</p>
				<?php wp_nonce_field( 'unfiltered-html-comment_' . get_the_ID(), '_wp_unfiltered_html_comment_disabled', false ); ?>
				<script>(function(){if(window===window.parent){document.getElementById('_wp_unfiltered_html_comment_disabled').name='_wp_unfiltered_html_comment';}})();</script>
			</form>

<?php

	}

}

?>
		</div>
	</div>

</div>

<?php

global $wp_rocket_comments;

$comment_style = get_option( 'rocket-comments-commentstyle', 'default' );
$comment_style_list = $wp_rocket_comments->get_comment_style_list();

if ( ! isset( $comment_style_list[$comment_style] ) ) {
	$comment_style = 'default';
}

require_once $comment_style_list[$comment_style]['template'];
