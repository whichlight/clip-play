var SampleEditor = SampleEditor || {};

(function($) {
	SampleEditor = function() {
		this.initialize = function() {
			var $clip_line = $('.js-clip-line');
			
			$clip_line.draggable({
				axis: 'x',
				handle: '.js-drag-handle',
				scroll: false,
				containment: $clip_line.parents('.progress-bar')
			});
		};
		
		
		return this;
	};
})(jQuery);