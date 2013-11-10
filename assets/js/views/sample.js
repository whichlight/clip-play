ClipPlay.Views.Sample = Marionette.ItemView.extend({
	template: '#sample-view-template',
	
	onRender: function() {
		this.initialize_clip_drag_handles();
	},
	
	
	initialize_clip_drag_handles: function() {
		var $clip_line = this.$('.js-clip-line');
		
		$clip_line.draggable({
			axis: 'x',
			handle: '.js-drag-handle',
			scroll: false,
			containment: $clip_line.parents('.progress-bar')
		});
		
		$clip_line.on('dragstop', this.on_clip_drag_stop);
	},
	
	
	on_clip_drag_stop: function(e, ui) {
		console.log('booyakacha');
	}
});