<script type="text/template" id="comment-template">
	<article id="div-comment-<%= attributes.id %>" class="comment-body">
		<footer class="comment-meta">
			<div class="comment-author vcard">
				<img alt="<?php _e( 'Avatar', 'rocket-comments' ); ?>" src="<%= attributes.author_avatar_urls['56'] %>" class="avatar" height="56" width="56" />
				<?php echo '<b class="fn"><a href="<%= attributes.author_url %>" rel="external nofollow" class="url"><%= attributes.author_name %></a></b>'; ?>
			</div>
			<% if ( attributes.status == 'hold' ) { %>
				<p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'rocket-comments' ); ?></p>
			<% } %>
		</footer>
		<div class="comment-content">
			<%= attributes.content.rendered ? attributes.content.rendered : attributes.content %>
		</div>
		<div class="comment-metadata">
			<ul class="clear">
				<li class="comment-time">
					<div class="genericon genericon-month"></div>
					<a href="<%= attributes.link %>">
						<time datetime="<%= attributes.iso_string %>">
							<?php
							/* translators: The first string is the comment date, and the second string is the comment time. */
							printf( __( '%1$s at %2$s' ), '<%= attributes.comment_date %>', '<%= attributes.comment_time %>' );
							?>
						</time>
					</a>
				</li>
				<li class="reply">
					<div class="genericon genericon-reply"></div>
<?php
if ( get_option( 'comment_registration' ) && ! is_user_logged_in() ) {
?>
					<a rel="nofollow" class="comment-reply-login" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>"><?php esc_html_e( 'Log in to Reply', 'rocket-comments' ); ?></a>
<?php
} else {
?>
					<a rel='nofollow' class='comment-reply-link' href='<?php echo esc_url( get_permalink() ); ?>?replytocom=<%= attributes.id %>#respond' data-id="<%= attributes.id %>" aria-label='<?php esc_html_e( 'Leave a Reply', 'rocket-comments' ); ?>'><?php esc_html_e( 'Reply', 'rocket-comments' ); ?></a>
<?php
}
?>
				</li>
				<li class="edit-link">
					<div class="genericon genericon-edit"></div>
					<a class="comment-edit-link" href="<?php echo esc_url( get_admin_url() ); ?>comment.php?action=editcomment&amp;c=<%= attributes.id %>" data-id="<%= attributes.id %>">
						<?php esc_html_e( 'Edit', 'rocket-comments' ); ?>
					</a>
				</li>
			</ul>
		</div>

	</article>
	<ol id="ol-comment-<%= attributes.id %>" class="children"></ol>
</script>
