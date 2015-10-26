<script type="text/template" id="comment-template">
	<article id="div-comment-<%= attributes.id %>" class="comment-body">
		<footer class="comment-meta">
			<div class="comment-author vcard">
				<img alt src="<%= attributes.author_avatar_urls['56'] %>" class="avatar" height="56" width="56" />
				<?php printf( __( '%s <span class="says">says:</span>', 'rocket-comments' ), '<cite class="fn"><a href="<%= attributes.author_url %>" rel="external nofollow" class="url"><%= attributes.author_name %></a></cite>' ); ?>
				<div class="comment-meta commentmetadata">
					<a href="<%= attributes.link %>">
						<time datetime="<%= attributes.iso_string %>">
							<?php
							/* translators: The first string is the comment date, and the second string is the comment time. */
							printf( __( '%1$s at %2$s' ), '<%= attributes.comment_date %>', '<%= attributes.comment_time %>' );
							?>
						</time>
					</a>
					&nbsp;&nbsp;
					<span class="edit-link <%= attributes.edit === 0 ? 'hidden' : '' %>">
						<a class="comment-edit-link" href="<?php echo esc_url( get_admin_url() ); ?>comment.php?action=editcomment&amp;c=<%= attributes.id %>" onclick='return addComment.editForm(<%= attributes.id %>, "respond");' data-id="<%= attributes.id %>">
							(<?php esc_html_e( 'Edit', 'rocket-comments' ); ?>)
						</a>
					</span>
				</div>
			</div>
			<% if ( attributes.status == 'hold' ) { %>
				<p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'rocket-comments' ); ?></p>
			<% } %>
		</footer>
		<div class="comment-content">
			<%= attributes.content.rendered ? attributes.content.rendered : attributes.content %>
		</div>
		<div class="reply">
<?php
if ( get_option( 'comment_registration' ) && ! is_user_logged_in() ) {
?>
			<a rel="nofollow" class="comment-reply-login" href="<?php echo esc_url( wp_login_url( get_permalink() ) ); ?>"><?php esc_html_e( 'Log in to Reply', 'rocket-comments' ); ?></a>
<?php
} else {
?>
			<a rel='nofollow' class='comment-reply-link' href='<?php echo esc_url( get_permalink() ); ?>?replytocom=<%= attributes.id %>#respond' onclick='return addComment.moveForm( "div-comment-<%= attributes.id %>", "<%= attributes.id %>", "respond", "<%= attributes.id %>" )' aria-label='<?php esc_html_e( 'Leave a Reply', 'rocket-comments' ); ?>'><?php esc_html_e( 'Reply', 'rocket-comments' ); ?></a>
<?php
}
?>
		</div>
	</article>
	<ul id="ol-comment-<%= attributes.id %>" class="children"></ul>
</script>
