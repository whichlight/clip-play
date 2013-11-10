ClipPlay.Views.ClipLine = Marionette.View.extend({
	initialize: function(options) {
		this.setElement(options.el);
		
		this.initialize_drag_handles();
	},
	
	
	initialize_drag_handles: function() {
		this.$el.draggable({
			axis: 'x',
			handle: '.js-drag-handle',
			scroll: false,
			containment: this.$el.parents('.progress-bar')
		});
		
		this.$el.on('dragstop', this.on_clip_drag_stop);
	},
	
	
	// percentage_progress
	//
	// Get a percentage value from a clip-line that represents its 
	// position within the progress bar.
	//
	percentage_progress: function() {
		var container = this.$el.parents('.progress-bar');
		var position_in_pixels = this.$el.css('left');
		
		var percentage = (position_in_pixels / container.width()) * 100;
		
		return percentage;
	},
	
	
	// seek_point
	//
	// Get the number of seconds after the start of the video that is 
	// represented by this clip line.
	//
	seek_point: function(options) {
		var progress = this.percentage_progress();
		
		return (progress * this.model.get('duration')) / 100;
	},
	
	
	on_clip_drag_stop: function(e, ui) {
		console.log('booyakacha');
	}
});