ClipPlay.Views.SampleAddView = Marionette.View.extend({
	// Copied from
	// http://stackoverflow.com/a/10430654
	url_matcher: /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/,
	
	events: {
		'click .js-create-sample': 'on_sample_add',
		'submit .js-add-sample-form': 'hijack_form'
	},
	
	initialize: function(options) {
		this.setElement(options.el);
		this.$input = this.$('.js-sample-url');
	},
	
	hijack_form: function() {
		this.on_sample_add();
		
		return false;
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
		var input_value = this.$input.val();
		if (input_value
			&& this.url_matcher.test(input_value)) {
			this.add_sample_to_collection();
		}
		
		this.clear_input();
		
		return false;
	}
});