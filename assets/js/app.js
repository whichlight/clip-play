$.embedly.defaults.key = 'e2dcb7bae5a443bfbb5f726daf05549f';

ClipPlay.App = new Marionette.Application();

ClipPlay.App.addInitializer(function(options) {
	var samples_collection = new ClipPlay.Collections.Samples();
    window.SAMPLES = samples_collection;
	var sample_editor_view = new ClipPlay.Views.SampleEditor({
		collection: samples_collection
	});
	sample_editor_view.render();
	$('#samples').append(sample_editor_view.$el);
});


ClipPlay.App.start();
