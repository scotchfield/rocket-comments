var RocketComments = (function () {
	'use strict';

	var rc = {};

	rc.loadComments = function (id) {
		jQuery.get('/wp-json/wp/v2/comments', function (data) {
			var el = jQuery('div#comments');
			console.log(data);
			el.html('Comments retrieved!');
		});
	};

	jQuery(function () {
		rc.loadComments();
	});

	return rc;
}());
