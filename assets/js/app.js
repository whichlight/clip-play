$.embedly.defaults.key = 'e2dcb7bae5a443bfbb5f726daf05549f';

ClipPlay.App = new Marionette.Application();

ClipPlay.App.addInitializer(function(options) {
	var samples_collection = new ClipPlay.Collections.Samples();
	var sample_editor_view = new ClipPlay.Views.SampleEditor({
		collection: samples_collection
	});
	sample_editor_view.render();
	$('#samples').append(sample_editor_view.$el);


    //just to have something loaded for debugging
    ClipPlay.Config = {};
    ClipPlay.Config['key_defaults'] = ['a','s','d','f','g','h','j','k','l'];
    samples_collection.add({url:"https://vimeo.com/18150336", start : 20, stop: 22});
});


ClipPlay.App.start();
