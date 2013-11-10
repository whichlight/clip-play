ClipPlay.Views.SampleAddView = Marionette.View.extend({
	events: {
		'click .js-create-sample': 'on_sample_add'
	},
	
	initialize: function(options) {
		this.setElement(options.el);
	},
	
	on_sample_add: function() {
		this.collection.add({
			url: this.$('.js-sample-url').val()
		});
		
		return false;
	}
});