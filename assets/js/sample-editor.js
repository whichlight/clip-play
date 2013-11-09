var SampleEditor = SampleEditor || {};

(function($) {
	SampleEditor = function() {
		this.player = null;
		
		
		this.initialize = function() {
			var $clip_line = $('.js-clip-line');
			
			$clip_line.draggable({
				axis: 'x',
				handle: '.js-drag-handle',
				scroll: false,
				containment: $clip_line.parents('.progress-bar')
			});
			
			$clip_line.on('drag', this.on_clip_drag_stop);
			
			
			this.player = new OP.Player($('#single-video-lets-see-if-we-can-get-this-to-work').get(0));
		};
		
		
		// percentage_progress
		//
		// Get a percentage value from a clip-line that represents its 
		// position within the progress bar.
		//
		this.percentage_progress = function($el) {
			var container = $el.parents('.progress-bar');
			var position_in_pixels = $el.css('left');
			
			var percentage = (position_in_pixels / container.width()) * 100;
			
			return percentage;
		};
		
		
		// seek_point
		//
		// Example:
		// sample_editor.seek_point({
		// 	$el: $('.clip-line'),
		// 	video_length: 586
		// });
		//
		this.seek_point = function(options) {
			var options = options || {};
			
			var progress = this.percentage_progress(options.$el);
			
			return (progress * options.video_length) / 100;
		};
		
		
		this.on_clip_drag_stop = function(e, ui) {
			
		};
		
		
		return this;
	};
})(jQuery);