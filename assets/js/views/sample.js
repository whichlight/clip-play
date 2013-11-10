ClipPlay.Views.Sample = Marionette.ItemView.extend({
	template: '#sample-view-template',
	
	onRender: function() {
		this.initialize_player();
		this.initialize_clip_drag_handles();
	},
	
	
	initialize_player: function() {
		var that = this;
		$.embedly.oembed(this.model.get('url')).done(function(results){
			var BASE_IFRAME = "http://cdn.embedly.com/widgets/media.html";
			var data = results[0];
			var f= data.html;
			var src = $(f)[0].src;
			var schema = data.provider_name.toLowerCase();
			var iframe_src= BASE_IFRAME +"?schema="+schema+"&type=text%2Fhtml&html="+src;
			var iframe = $('<iframe/>', {
				src: iframe_src
			});
			$('#video').append(iframe[0]);
			var player = new OP.Player(iframe[0]);
			that.model.set('player', player);
			that.model.set('iframe', iframe);
		});
	},
	
	
	initialize_clip_drag_handles: function() {
		var $clip_line = this.$('.js-clip-line');
		
		$clip_line.draggable({
			axis: 'x',
			handle: '.js-drag-handle',
			scroll: false,
			containment: $clip_line.parents('.progress-bar')
		});
		
		$clip_line.on('dragstop', this.on_clip_drag_stop);
	},
	
	
	on_clip_drag_stop: function(e, ui) {
		console.log('booyakacha');
	}
});