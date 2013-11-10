ClipPlay.Views.ClipLine = Marionette.View.extend({
	type: '', // 'start' or 'stop'
	
	initialize: function(options) {
		this.setElement(options.el);
		
		this.type = options.type;
		
		this.listenTo(this.model, 'change:duration', this.initialize_time_values);
		var start_or_stop = this.type;
		this.listenTo(this.model, 'change:' + start_or_stop, this.render_time);
		
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
		
		this.$el.on('drag', function(e, ui) {
			that.on_clip_drag(e, ui);
		});
	},
	
	
	initialize_time_values: function() {
		this.set_seek_point();
		this.render_time();
	},
	
	
	render_time: function() {
		var time;
		if (this.type === 'start') {
			time = this.model.start_in_minutes_and_seconds();
		}
		else if (this.type === 'stop') {
			time = this.model.stop_in_minutes_and_seconds();
		}
		
		var time_string = time.minutes + ':' + time.seconds;
		this.$('.js-time').text(time_string);
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
	
	
	set_seek_point: function() {
		this.model.set(this.type, this.seek_point());
	},
	
	
	on_clip_drag: function(e, ui) {
		this.set_seek_point();
	}
});