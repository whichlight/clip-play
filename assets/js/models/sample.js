ClipPlay.Models.Sample = Backbone.Model.extend({
	defaults: {
		'url': '',
		'start': '3',
		'stop': '4',
		'duration': '',
		'key': '',
		'player': '',
		'iframe': '',
        'timeout' : '',
        'thumbnail' : '',
        'playing' : false
	},
    initialize: function() {
        var a = ClipPlay.Config['key_defaults'].shift();
        if(a){
          this.set('key', a);
        }
    },

	in_minutes_and_seconds: function(seconds) {
		var minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds);
		var seconds = seconds - minutes * 60;

		if (seconds < 10) {
			seconds = '0' + seconds;
		}

		return {
			minutes: minutes,
			seconds: seconds
		};
	},

	start_in_minutes_and_seconds: function() {
		return this.in_minutes_and_seconds(this.get('start'));
	},

	stop_in_minutes_and_seconds: function() {
		return this.in_minutes_and_seconds(this.get('stop'));
	},


	play: function() {
        console.log('playing');
    //play then pause
        this.set('playing',true);
        window.clearTimeout(this.get('timeout'));
        this.get('player').pause();
        this.get('player').seekTo(this.get('start'));
        this.get('player').play();
        var that = this;
        var length = Math.abs(this.get('stop') - this.get('start'));
        console.log(length);
        this.set('timeout',setTimeout(function(){
          that.get('player').pause();
          that.set('playing',false);
        }, length*1000 ));
	}
});
