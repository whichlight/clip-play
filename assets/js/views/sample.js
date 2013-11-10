ClipPlay.Views.Sample = Marionette.ItemView.extend({
	template: '#sample-view-template',
	events: {
		'blur .js-keyboard-key': 'on_keyboard_change',
        'click .js-remove-sample' : 'remove_sample'
	},

	onRender: function() {
		this.initialize_player();
		this.initialize_clip_lines();
        this.$('.js-keyboard-key').val(this.model.get('key'));
	},

    initialize: function(options){
        this.collection = options.collection;
        this.listenTo(this.model, 'change:key', this.key_bind);
        this.listenTo(this.model, 'change:playing', this.show_clip);
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
				src: iframe_src,
				id: 'video-sample-' + that.model.cid
			});
            var wrapper= document.createElement('span');
            $(wrapper).append(iframe[0]);
            $(wrapper).addClass("responsive-object");
			$('#video').append(wrapper);
			var player = new OP.Player(iframe[0]);
			that.model.set('player', player);
			that.model.set('iframe', iframe);
            var thumb = data.thumbnail_url;
            var new_height= 48;
            var img_resize = "http://i.embed.ly/1/display/resize?"
            img_resize+="url=";
            img_resize+=encodeURIComponent(thumb);
            img_resize+="&grow=true&key=e2dcb7bae5a443bfbb5f726daf05549f&height="
            img_resize+=new_height;

            that.model.set('thumbnail', img_resize);
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
			model: this.model,
			sample_view: this
		});

		this.stop_clip_line = new ClipPlay.Views.ClipLine({
			type: 'stop',
			el: this.$('.js-end-position'),
			model: this.model,
			sample_view: this
		});

		this.selected_bar = new ClipPlay.Views.SelectedBar({
			el: this.$('.js-selected-bar'),
			model: this.model,
			sample_view: this
		});
	},

    on_keyboard_change: function(){
      var keyval = this.$('.js-keyboard-key').val();
      if (keyval != this.model.get('key')){
        Mousetrap.unbind(this.model.get('key'));
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
    },

    remove_sample: function(){
        this.collection.remove(this.model);

        var $iframe_video = $('#video-sample-' + this.model.cid);
        $iframe_video.fadeOut(400, function() {
        	$iframe_video.remove();
        });
    },

	close: function() {
		var that = this;
		this.$el.animate({
			height: 0,
			opacity: 0
		}, 500, function() {
			Marionette.View.prototype.close.call(that, arguments);
		});
	},

    show_clip: function(){
        var isPlaying = this.model.get('playing');
        console.log('playing :' + isPlaying);
        var $iframe_video = $('#video-sample-' + this.model.cid);
        if(isPlaying){
            $iframe_video.css({'z-index':10});
        }
        if(!isPlaying){
            $iframe_video.css({'z-index':-10});
        }
    }
});
