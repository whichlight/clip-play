(function($) {
	var App = function() {
		this.initialize = function() {
			var sample_editor = new SampleEditor();

			sample_editor.initialize();
		};


		return this;
	};


	var app = new App();
	app.initialize();
})(jQuery);
$.embedly.defaults.key = 'e2dcb7bae5a443bfbb5f726daf05549f';
