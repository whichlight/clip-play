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