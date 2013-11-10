ClipPlay.Views.SampleEditor = Marionette.CollectionView.extend({
	itemView: ClipPlay.Views.Sample,
	itemViewOptions: function(model, index) {
		return {
			collection: this.collection
		};
	},
	
	onRender: function() {
		// Initialize view for adding new samples
		this.sample_add_view = new ClipPlay.Views.SampleAddView({
			el: $('#add-sample'),
			collection: this.collection
		});
	}
});