ClipPlay.Views.Sample = Marionette.ItemView.extend({
	template: '#sample-view-template',
	events: {
		'blur .js-keyboard-key': 'on_keyboard_change'
	},

	onRender: function() {
		this.initialize_player();
		this.initialize_clip_lines();
        this.$('.js-keyboard-key').val(this.model.get('key'));
	},

    initialize: function(){
        this.listenTo(this.model, 'change:key', this.key_bind);
        this.key_bind();
    },

	initialize_player: function() {
		var that = this;
		$.embedly.oembed(this.model.get('url')).done(function(results){
			var BASE_IFRAME = "http://cdn.embedly.com/widgets/media.html";
			var data = results[0];
			var f= data.html;
			var src = encodeURIComponent($(f)[0].src);
			var schema = data.provider_name.toLowerCase();
			var iframe_src= BASE_IFRAME +"?schema="+schema+"&type=text%2Fhtml&html="+src;
			var iframe = $('<iframe/>', {
				src: iframe_src
			});
			$('#video').append(iframe[0]);
			var player = new OP.Player(iframe[0]);
			that.model.set('player', player);
			that.model.set('iframe', iframe);

            window.BOKASHAKA = that.model;
			player.getDuration(function(value) {
				that.model.set('duration', value);
			});
		});
	},

	initialize_clip_lines: function() {
		this.start_clip_line = new ClipPlay.Views.ClipLine({
			type: 'start',
			el: this.$('.js-start-position'),
			model: this.model
		});

		this.end_clip_line = new ClipPlay.Views.ClipLine({
			type: 'stop',
			el: this.$('.js-end-position'),
			model: this.model
		});
	},

    on_keyboard_change: function(){
      var keyval = this.$('.js-keyboard-key').val();
      if (keyval != this.model.get('key')){
	    this.model.set('key',keyval);
        console.log('changed key to ' + keyval);
      }
    },

    key_bind: function(){
      Mousetrap.unbind(this.model.get('key'));
      var that = this;
      Mousetrap.bind(this.model.get('key'), function(){
        that.model.play();
      });
    }
});
