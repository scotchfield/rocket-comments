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

<div id="comments" class="comments-area">
	<ol id="comment-root" class="comment-list" data-post-id="<?php echo the_ID(); ?>"></ol>

	<?php comment_form(); ?>
</div>

<script type="text/template" id="comment-template">
	<article id="div-comment-<%= id %>" class="comment-body">
		<footer class="comment-meta">
			<div class="comment-author vcard">
				<!-- img -->
				<b class="fn">
					<a href='<%= author_url %>' rel='external nofollow' class='url'>
						<%= author_name %>
					</a>
				</b>
				<span class="says">says:</span>
			</div>
			<div class="comment-metadata">
				<a href="<%= link %>">
					<time datetime="<%= ISOString %>">
						<!-- TODO: Appropriate date formatting -->
						<%= dateString %>
					</time>
				</a>
				<span class="edit-link">
					<a class="comment-edit-link" href="http://localhost:8888/wp-admin/comment.php?action=editcomment&amp;c=1">
						Edit
					</a>
				</span>
			</div>
		</footer>
		<div class="comment-content">
			<%= content.rendered %>
		</div>
		<div class="reply">
			<a rel='nofollow' class='comment-reply-link' href='http://localhost:8888/2015/07/27/hello-world/?replytocom=1#respond' onclick='return addComment.moveForm( "div-comment-1", "1", "respond", "1" )' aria-label='Reply to Mr WordPress'>Reply</a>
		</div>
	</article>
	<ol id="ol-comment-<%= id %>" class="children"></ol>
</script>
