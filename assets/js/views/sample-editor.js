ClipPlay.Views.SampleEditor = Marionette.CollectionView.extend({
	itemView: ClipPlay.Views.Sample,
	
	initialize: function() {
		this.initialize_clip_drag_handles();
		this.initialize_player();
	},
	
	
	initialize_clip_drag_handles: function() {
		var $clip_line = $('.js-clip-line');
		
		$clip_line.draggable({
			axis: 'x',
			handle: '.js-drag-handle',
			scroll: false,
			containment: $clip_line.parents('.progress-bar')
		});
		
		$clip_line.on('drag', this.on_clip_drag_stop);
	},
	
	
	// this will soon be obsolete
	initialize_player: function() {
		this.player = new OP.Player($('#single-video-lets-see-if-we-can-get-this-to-work').get(0));
	},
	
	
	onRender: function() {
		// Initialize view for adding new samples
		this.sample_add_view = new ClipPlay.Views.SampleAddView({
			el: $('#add-sample'),
			collection: this.collection
		});
	},
	
	
	on_clip_drag_stop: function(e, ui) {
		
	}
});