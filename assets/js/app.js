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
    samples_collection.add({url:"http://www.youtube.com/watch?v=onRk0sjSgFU"});
    samples_collection.add({url:"https://vimeo.com/18150336"});
    samples_collection.add({url:"http://www.youtube.com/watch?v=8hP9D6kZseM"});
    samples_collection.add({url:"http://www.youtube.com/watch?v=QH2-TGUlwu4"});

    samples_collection.add({url:"http://www.youtube.com/watch?v=eau1qHxI-8w"});

    samples_collection.add({url:"http://www.youtube.com/watch?v=A2zKARkpDW4"});


});


ClipPlay.App.start();
