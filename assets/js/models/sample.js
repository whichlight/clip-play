ClipPlay.Models.Sample = Backbone.Model.extend({
	defaults: {
		'url': '',
		'start': '',
		'stop': '',
		'duration': '',
		'key': '',
		'player': '',
		'iframe': '',
        'timeout' : ''
	},


	play: function() {
        console.log('playing');
    //play then pause
        window.clearTimeout(this.get('timeout'));
        this.get('player').pause();
        this.get('player').seekTo(this.get('start'));
        this.get('player').play();
        var that = this;
        var length = this.get('stop') - this.get('start');
        console.log(length);
        this.set('timeout',setTimeout(function(){
          that.get('player').pause();
        }, length*1000 ));
	}
});
