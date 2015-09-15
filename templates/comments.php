<?php

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
	return;
}
?>

<div id="comments" class="comments-area"<?php
$thread_comments = get_option( 'thread_comments', true );
if ( ! $thread_comments ) {
	echo ' data-threaded="1"';
} else {
	$thread_depth = get_option( 'thread_comments_depth' );
	echo ' data-threaded="' . $thread_depth . '"';
}
?>>
	<div id="wp-loading">
		<img src="<?php echo plugins_url(); ?>/rocket-comments/images/wp-loading.gif">
	</div>

	<h2 id="comment-single" class="comments-title">
		<?php printf( __( 'One thought on &ldquo;%s&rdquo;', 'rocket-comments' ), get_the_title() ); ?>
	</h2>

	<h2 id="comment-multiple" class="comments-title">
		<?php printf( __( '<span id="comment-count"></span> thoughts on &ldquo;%s&rdquo;', 'rocket-comments' ), get_the_title() ); ?>
	</h2>

	<ol id="comment-root" class="comment-list" data-post-id="<?php echo the_ID(); ?>" data-user-id="<?php echo get_current_user_id(); ?>"></ol>

	<?php comment_form(); ?>
</div>

<script type="text/template" id="comment-template">
	<article id="div-comment-<%= id %>" class="comment-body">
		<footer class="comment-meta">
			<div class="comment-author vcard">
				<img alt src="<%= author_avatar_urls['48'] %>" class="avatar" height="48" width="48" />
				<?php _e( '<b class="fn"><a href="<%= author_url %>" rel="external nofollow" class="url"><%= author_name %></a></b><span class="says">says:</span>', 'rocket-comments' ); ?>
			</div>
			<div class="comment-metadata">
				<a href="<%= link %>">
					<time datetime="<%= iso_string %>"><%= date_string %></time>
				</a>
				<span class="edit-link">
					<a class="comment-edit-link" href="<?php echo get_admin_url() ?>comment.php?action=editcomment&amp;c=<%= id %>">
						<?php _e( 'Edit', 'rocket-comments' ); ?>
					</a>
				</span>
			</div>
		</footer>
		<div class="comment-content">
			<%= content.rendered %>
		</div>
		<div class="reply">
			<a rel='nofollow' class='comment-reply-link' href='<?php echo get_permalink(); ?>?replytocom=1#respond' onclick='return addComment.moveForm( "div-comment-<%= id %>", "<%= id %>", "respond", "<%= id %>" )' aria-label='<?php _e( 'Leave a reply', 'rocket-comments' ); ?>'><?php _e( 'Reply', 'rocket-comments' ); ?></a>
		</div>
	</article>
	<ol id="ol-comment-<%= id %>" class="children"></ol>
</script>
