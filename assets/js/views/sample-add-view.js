ClipPlay.Views.SampleAddView = Marionette.View.extend({
	events: {
		'click .js-create-sample': 'on_sample_add'
	},
	
	initialize: function(options) {
		this.setElement(options.el);
		this.$input = this.$('.js-sample-url');
	},
	
	add_sample_to_collection: function() {
		this.collection.add({
			url: this.$input.val()
		});
	},
	
	clear_input: function() {
		this.$input.val('');
	},
	
	on_sample_add: function() {
		if (this.$input.val()) {
			this.add_sample_to_collection();
			
			this.clear_input();
		}
		
		return false;
	}
});