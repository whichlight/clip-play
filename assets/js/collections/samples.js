ClipPlay.Collections.Samples = Backbone.Collection.extend({
	model: ClipPlay.Models.Sample,
	
	// -----------------------------------------------------------------------
	// What follows is WRONG. Change so that the following functions don't use 
	// any DOM elements
	// -----------------------------------------------------------------------
	
	// percentage_progress
	//
	// Get a percentage value from a clip-line that represents its 
	// position within the progress bar.
	//
	percentage_progress: function($el) {
		var container = $el.parents('.progress-bar');
		var position_in_pixels = $el.css('left');
		
		var percentage = (position_in_pixels / container.width()) * 100;
		
		return percentage;
	},
	
	
	// seek_point
	//
	// Example:
	// sample_editor.seek_point({
	// 	$el: $('.clip-line'),
	// 	video_length: 586
	// });
	//
	seek_point: function(options) {
		var options = options || {};
		
		var progress = this.percentage_progress(options.$el);
		
		return (progress * options.video_length) / 100;
	}
});