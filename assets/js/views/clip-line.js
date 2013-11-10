ClipPlay.Views.ClipLine = Marionette.View.extend({
	type: '', // 'start' or 'stop'

	initialize: function(options) {
		this.setElement(options.el);

		this.type = options.type;

		this.sample_view = options.sample_view;

		this.listenTo(this.model, 'change:duration', this.on_duration_change);
		var start_or_stop = this.type;
		this.listenTo(this.model, 'change:' + start_or_stop, this.on_start_or_stop_change);
		this.listenTo(this.sample_view, 'change:position:selected-bar', this.on_selected_bar_position_change);

		this.initialize_drag_handles();
        this.on_start_or_stop_change();
        this.initialize_bounds();
	},


	initialize_drag_handles: function() {
		this.$el.draggable({
			axis: 'x',
			handle: '.js-drag-handle',
			scroll: false,
			containment: 'parent'
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

    initialize_bounds: function(){
		if (this.type === 'start') {
          this.$el.css('left', this.model.get('start') + 'px');
        }
		if (this.type === 'stop') {
		  this.$el.css('left', this.model.get('stop') + 'px');
        }
    },
    
    
    render_seek_point: function() {
    	var seconds = this.model.get(this.type);
    	var percentage_progress = (seconds * 100) / this.model.get('duration');
    	console.log((percentage_progress * this.$el.parents('.progress-bar').width()) / 100);
    	this.$el.css('left', percentage_progress + '%');
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
	},


	on_duration_change: function() {
		this.initialize_time_values();
// 		this.render_seek_point();
		this.trigger_seek_point_change();
	},


	on_start_or_stop_change: function() {
		this.render_time();
		this.trigger_seek_point_change();
	},


	on_selected_bar_position_change: function(params) {
		if (this.type === 'start') {
			this.$el.css('left', params.position + 'px');
		}
		else if (this.type === 'stop') {
			var left_position = params.position + params.width;
			this.$el.css('left', left_position + 'px');
		}
	},


	trigger_seek_point_change: function() {
		var start_or_stop = this.type;
		this.sample_view.trigger('change:seek:clip-line-' + start_or_stop, {
			position: this.$el.position().left
		});
	}
});
