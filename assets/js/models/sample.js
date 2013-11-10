ClipPlay.Models.Sample = Backbone.Model.extend({
	defaults: {
		'url': '',
		'start': '',
		'stop': '',
		'duration': '',
		'key': '',
		'player': '',
		'iframe': ''
	},
	
	
	in_minutes_and_seconds: function(seconds) {
		var minutes = Math.floor(seconds / 60);
		seconds = Math.floor(seconds);
		var seconds = seconds - minutes * 60;
		
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		console.log(minutes + ':' + seconds);
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
		
	}
});