ClipPlay.Views.SampleEditor = Marionette.CollectionView.extend({
	itemView: ClipPlay.Views.Sample,
	
	onRender: function() {
		// Initialize view for adding new samples
		this.sample_add_view = new ClipPlay.Views.SampleAddView({
			el: $('#add-sample'),
			collection: this.collection
		});
	}
});