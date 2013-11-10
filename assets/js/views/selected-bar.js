ClipPlay.Views.SelectedBar = Marionette.View.extend({
	events: {
		'click': 'play'
	},
	
	
	initialize: function(options) {
		this.setElement(options.el);
		this.sample_view = options.sample_view;
		
		this.listenTo(this.sample_view, 'change:seek:clip-line-start', this.on_clip_line_start_seek_change);
		this.listenTo(this.sample_view, 'change:seek:clip-line-stop', this.on_clip_line_stop_seek_change);
		
		this.initialize_dragging();
	},
	
	
	initialize_dragging: function() {
		this.$el.draggable({
			axis: 'x',
			scroll: false,
			containment: 'parent'
		});
		
		this.reset_position();
		
		var that = this;
		this.$el.on('drag', function(e, ui) {
			that.on_selected_bar_drag(e, ui);
		});
	},
	
	
	// Reset position to position:absolute
	// jQueryUI Scrollable will make your element position:relative and in 
	// this case we want to make sure it's absolutely positioned so the layout 
	// doesn't break.
	reset_position: function() {
		this.$el.css('position', 'absolute');
	},
	
	
	play: function() {
		this.model.play();
	},
	
	
	on_selected_bar_drag: function() {
		this.sample_view.trigger('change:position:selected-bar', {
			position: this.$el.position().left,
			width: this.$el.width()
		});
	},
	
	
	on_clip_line_start_seek_change: function(params) {
		var end_position = this.$el.position().left + this.$el.width();
		var width = end_position - params.position;
		
		this.$el.css('left', params.position + 'px');
		this.$el.css('width', width + 'px');
	},
	
	
	on_clip_line_stop_seek_change: function(params) {
		var width = params.position - this.$el.position().left;
		this.$el.css('width', width + 'px');
	}
});