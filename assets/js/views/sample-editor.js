ClipPlay.Views.SampleEditor = Marionette.CollectionView.extend({
	itemView: ClipPlay.Views.Sample,
	
	initialize: function() {
		this.initialize_player();
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
	}
});