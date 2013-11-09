function Sample(url){
  this.url = url;
  this.start;
  this.stop;
  this.duration;
  this.key;
  this.player; //the associated player obj w the iframe
  this.id;
  this.iframe;
  this.init();
}

Sample.prototype.init = function(){
  var that = this;
  $.embedly.oembed(this.url).done(function(results){
    var BASE_IFRAME = "http://cdn.embedly.com/widgets/media.html";
    var data = results[0];
    var f= data.html;
    var src = $(f)[0].src;
    var schema = data.provider_name.toLowerCase();
    var iframe_src= BASE_IFRAME +"?schema="+schema+"&type=text%2Fhtml&html="+src;
    var iframe = $('<iframe/>', {
      src: iframe_src
    });
    $('body').append(iframe[0]);
    var player = new OP.Player(iframe[0]);
    that.player = player;
    that.iframe = iframe;
  });
}

Sample.prototype.play = function(){

}

//getting and setting from UI
Sample.prototype.update = function(){

}
