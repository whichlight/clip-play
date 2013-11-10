ClipPlay.Views.ClipLine = Marionette.View.extend({
	type: '', // 'start' or 'stop'
	
	initialize: function(options) {
		this.setElement(options.el);
		
		this.type = options.type;
		
		this.initialize_drag_handles();
	},
	
	
	initialize_drag_handles: function() {
		this.$el.draggable({
			axis: 'x',
			handle: '.js-drag-handle',
			scroll: false,
			containment: this.$el.parents('.progress-bar')
		});
		
		var that = this;
		this.$el.on('dragstop', function(e, ui) {
			that.on_clip_drag_stop(e, ui);
		});
	},
	
	
	// percentage_progress
	//
	// Get a percentage value from a clip-line that represents its 
	// position within the progress bar.
	//
	percentage_progress: function() {
		var container = this.$el.parents('.progress-bar');
		var position_in_pixels = this.$el.position().left;
		
		var percentage = (position_in_pixels / container.width()) * 100;
		
		return percentage;
	},
	
	
	// seek_point
	//
	// Get the number of seconds after the start of the video that is 
	// represented by this clip line.
	//
	seek_point: function() {
		var progress = this.percentage_progress();
		
		return (progress * this.model.get('duration')) / 100;
	},
	
	
	on_clip_drag_stop: function(e, ui) {
		this.model.set(this.type, this.seek_point());
	}
});