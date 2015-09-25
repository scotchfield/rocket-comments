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

?> data-post-id="<?php echo get_the_ID(); ?>" data-user-id="<?php echo $current_user->ID; ?>" data-user-name="<?php echo $current_user->display_name ?>" data-user-avatar="<?php echo get_avatar_url( $current_user->ID ); ?>" data-comment-title-edit="<?php echo __( 'Edit Comment', 'rocket-comments' ); ?>" data-comment-title-reply="<?php echo __( 'Leave a Reply', 'rocket-comments' ); ?>">

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

	<div id="respond" class="comment-respond">
		<h3 id="reply-title" class="comment-reply-title">
			<?php _e( 'Leave a Reply', 'rocket-comments' ); ?>
			<small>
				<a rel="nofollow" id="cancel-comment-reply-link" href="/2015/07/27/hello-world/#respond" style="display: none;">
					<?php _e( 'Cancel reply', 'rocket-comments' ); ?>
				</a>
			</small>
		</h3>
		<form action="http://localhost:8888/wp-comments-post.php" method="post" id="commentform" class="comment-form" novalidate>
<?php
if ( is_user_logged_in() ) {
?>
			<div class="comment-author-logged-in">
				<p class="logged-in-as">
					<?php printf( __( 'Logged in as <a href="%sprofile.php">%s</a>.', 'rocket-comments' ), get_admin_url(), $current_user->display_name ); ?>
					<a href="<?php echo wp_logout_url( get_permalink() ); ?>" title="<?php _e( 'Log out of this account', 'rocket-comments' ); ?>"><?php _e( 'Log out?', 'rocket-comments' ); ?></a>
				</p>
			</div>
<?php
}
?>
			<div class="comment-author-not-logged-in <?php if ( is_user_logged_in() ) { echo 'hidden'; } ?>">
				<p class="comment-notes">
					<span id="email-notes">Your email address will not be published.</span> Required fields are marked <span class="required">*</span>
				</p>
				<p class="comment-form-author">
					<label for="author">Name <span class="required">*</span></label>
					<input id="author" name="author" type="text" value="" size="30" aria-required='true' required='required' />
				</p>
				<p class="comment-form-email">
					<label for="email">Email <span class="required">*</span></label>
					<input id="email" name="email" type="email" value="" size="30" aria-describedby="email-notes" aria-required='true' required='required' />
				</p>
				<p class="comment-form-url">
					<label for="url">Website</label> <input id="url" name="url" type="url" value="" size="30" />
				</p>
			</div>
			<p class="comment-form-comment">
				<label for="comment"><?php _e( 'Comment', 'rocket-comments' ); ?></label>
				<textarea id="comment" name="comment" cols="45" rows="8"  aria-required="true" required="required"></textarea>
			</p>
			<p class="form-submit">
				<input name="submit" type="submit" id="submit" class="submit" value="<?php _e( 'Post Comment', 'rocket-comments' ); ?>" />
				<input type='hidden' name='comment_post_ID' value='<?php echo get_the_ID(); ?>' id='comment_post_ID' />
				<input type='hidden' name='comment_parent' id='comment_parent' value='0' />
			</p>
			<?php wp_nonce_field( 'unfiltered-html-comment_' . get_the_ID(), '_wp_unfiltered_html_comment_disabled', false ); ?>
			<script>(function(){if(window===window.parent){document.getElementById('_wp_unfiltered_html_comment_disabled').name='_wp_unfiltered_html_comment';}})();</script>
		</form>
	</div>

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
					<time datetime="<%= attributes.iso_string %>">
						<?php printf( __( '%1$s at %2$s' ), '<%= attributes.comment_date %>', '<%= attributes.comment_time %>' ); ?>
					</time>
				</a>
				<span class="edit-link <%= attributes.edit_class %>">
					<a class="comment-edit-link" href="<?php echo get_admin_url() ?>comment.php?action=editcomment&amp;c=<%= attributes.id %>" onclick='return addComment.editForm(<%= attributes.id %>, "respond");'>
						<?php _e( 'Edit', 'rocket-comments' ); ?>
					</a>
				</span>
			</div>
			<% if (attributes.status == 'hold') { %>
				<p class="comment-awaiting-moderation">Your comment is awaiting moderation.</p>
			<% } %>
		</footer>
		<div class="comment-content">
			<%= attributes.content.rendered ? attributes.content.rendered : attributes.content %>
		</div>
		<div class="reply">
			<a rel='nofollow' class='comment-reply-link' href='<?php echo get_permalink(); ?>?replytocom=<%= attributes.id %>#respond' onclick='return addComment.moveForm( "div-comment-<%= attributes.id %>", "<%= attributes.id %>", "respond", "<%= attributes.id %>" )' aria-label='<?php _e( 'Leave a Reply', 'rocket-comments' ); ?>'><?php _e( 'Reply', 'rocket-comments' ); ?></a>
		</div>
	</article>
	<ol id="ol-comment-<%= attributes.id %>" class="children"></ol>
</script>
