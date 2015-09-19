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

$current_user = wp_get_current_user();

?> data-post-id="<?php echo the_ID(); ?>" data-user-id="<?php echo $current_user->ID; ?>" data-user-name="<?php echo $current_user->display_name ?>" data-user-avatar="<?php echo get_avatar_url( $current_user->ID ); ?>">

	<div id="wp-loading">
		<img src="<?php echo plugins_url(); ?>/rocket-comments/images/wp-loading.gif">
	</div>

	<h2 id="comment-single" class="comments-title">
		<?php printf( __( 'One thought on &ldquo;%s&rdquo;', 'rocket-comments' ), get_the_title() ); ?>
	</h2>

	<h2 id="comment-multiple" class="comments-title">
		<?php printf( __( '<span id="comment-count"></span> thoughts on &ldquo;%s&rdquo;', 'rocket-comments' ), get_the_title() ); ?>
	</h2>

	<ol id="comment-root" class="comment-list"></ol>

	<?php comment_form(); ?>
</div>

<script type="text/template" id="comment-template">
	<article id="div-comment-<%= attributes.id %>" class="comment-body">
		<footer class="comment-meta">
			<div class="comment-author vcard">
				<img alt src="<%= attributes.author_avatar_urls['56'] %>" class="avatar" height="56" width="56" />
				<?php _e( '<b class="fn"><a href="<%= attributes.author_url %>" rel="external nofollow" class="url"><%= attributes.author_name %></a></b><span class="says">says:</span>', 'rocket-comments' ); ?>
			</div>
			<div class="comment-metadata">
				<a href="<%= attributes.link %>">
					<time datetime="<%= attributes.iso_string %>"><%= attributes.date_string %></time>
				</a>
				<span class="edit-link">
					<a class="comment-edit-link" href="<?php echo get_admin_url() ?>comment.php?action=editcomment&amp;c=<%= attributes.id %>" onclick='return addComment.editForm(<%= attributes.id %>, "respond");'>
						<?php _e( 'Edit', 'rocket-comments' ); ?>
					</a>
				</span>
			</div>
		</footer>
		<div class="comment-content">
			<p>
				<%= attributes.content.rendered ? attributes.content.rendered : attributes.content %>
			</p>
		</div>
		<div class="reply">
			<a rel='nofollow' class='comment-reply-link' href='<?php echo get_permalink(); ?>?replytocom=1#respond' onclick='return addComment.moveForm( "div-comment-<%= attributes.id %>", "<%= attributes.id %>", "respond", "<%= attributes.id %>" )' aria-label='<?php _e( 'Leave a reply', 'rocket-comments' ); ?>'><?php _e( 'Reply', 'rocket-comments' ); ?></a>
		</div>
	</article>
	<ol id="ol-comment-<%= attributes.id %>" class="children"></ol>
</script>
