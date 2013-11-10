ClipPlay.Views.SampleAddView = Marionette.View.extend({
	// Copied from
	// http://daringfireball.net/2010/07/improved_regex_for_matching_urls
	// http://stackoverflow.com/questions/6927719/url-regex-does-not-work-in-javascript
	url_matcher: /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i,
	
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
		var input_value = this.$input.val();
		if (input_value
			&& this.url_matcher.test(input_value)) {
			this.add_sample_to_collection();
		}
		
		this.clear_input();
		
		return false;
	}
});