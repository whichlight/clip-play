
/*
* Right now I can only assume that we are going with Open Player, or OmniPlayer
* for this bad boy. OP seems like a good idea. OP.Player(iframe);
*/

var OP = {};

OP.DEBUG = false;
OP.POST_MESSAGE = !!window.postMessage;

/*
* Utils.
*/
OP.origin = function(url){
  // Grab the origin of a URL
  if (url.substr(0, 2) === '//'){
    url = window.location.protocol + url;
  }

  return url.split('/').slice(0,3).join('/');
};

OP.addEvent = function(elem, type, eventHandle) {
  if (!elem) { return; }
  if ( elem.addEventListener ) {
    elem.addEventListener( type, eventHandle, false );
  } else if ( elem.attachEvent ) {
    elem.attachEvent( "on" + type, eventHandle );
  } else {
    elem["on"+type]=eventHandle;
  }
};

// usage: log('inside coolFunc',this,arguments);
// http://paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
OP.log = function(){
  OP.log.history = OP.log.history || [];   // store logs to an array for reference
  OP.log.history.push(arguments);
  if(window.console && OP.DEBUG){
    window.console.log( Array.prototype.slice.call(arguments) );
  }
};

OP.Listeners = function(){
  this.init();
};

OP.Listeners.prototype.init = function(){
  this.data = {};
};

OP.Listeners.prototype.getUUID = function(){
  // Create a random id. #http://stackoverflow.com/a/2117523/564191
  return 'listener-xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};

OP.Listeners.prototype.has = function(id){
  return this.data.hasOwnProperty(id);
};

OP.Listeners.prototype.add = function(id, event, cb, ctx, one){
  var d = {
    event: event,
    cb: cb,
    ctx: ctx,
    one: one
  };

  if (this.has(id)){
    this.data[id].push(d);
  } else {
    this.data[id] = [d];
  }
};

OP.Listeners.prototype.execute = function(id, data){
  if (!this.has(id)){
    return false;
  }

  var keep = [];
  for (var i=0; i< this.data[id].length; i++){
    var d = this.data[id][i];

    d.cb.call(d.ctx? d.ctx: window, data);

    if (d.one === false){
      keep.push(d);
    }
  }

  if (keep.length === 0){
    delete this.data[id];
  } else {
    this.data[id] = keep;
  }
};

OP.Listeners.prototype.on = function(id, event, cb, ctx){
  this.add(id, event, cb, ctx, false);
};

OP.Listeners.prototype.one = function(id, event, cb, ctx){
  this.add(id, event, cb, ctx, true);
};

OP.Listeners.prototype.off = function(event, cb){
  // We should probably restructure so this is a bit less of a pain.
  var keys = [];
  for(var k in this.data){
    keys.push(k);
  }

  var listeners = [];

  for (var i in keys){

    var values = this.data[keys[i]];
    var keep = [];

    for (var j in values){
      var data = values[j];
      if (data.event === event && data.cb === cb){
        listeners.push(keys[i]);
      } else {
        keep.push(data);
      }
    }

    if (keep.length === 0){
      delete this.data[keys[i]];
    } else {
      this.data[keys[i]] = keep;
    }
  }
  return listeners;
};

OP.Player = function(elem){
  this.init(elem);
};


OP.Player.EVENTS = {
  // Stop Events.
  PLAY: 'play',
  PAUSE: 'pause',
  FINISH: 'finish',
  SEEK: 'seek',

  // Progress Events
  PLAY_PROGRESS: 'playProgress',
  LOAD_PROGRESS: 'load-progress'
};

OP.Player.prototype.init = function(elem){
  this.elem = elem;

  // Figure out the origin of where we are sending messages.
  this.origin = OP.origin(elem.src);

  // Event handling.
  this.listeners = new OP.Listeners();

  // Queuing before ready.
  this.isReady = false;
  this.queue = [];

  if (OP.POST_MESSAGE){
    // Set up the reciever.
    var self = this;
    OP.addEvent(window, 'message', function(e){
      self.receive(e);
    });
  } else {
    OP.log('Post Message is not Available.');
  }
};

OP.Player.prototype.send = function(data, callback, ctx){
  // We are expecting a response.
  if (callback) {
    // Create a UUID
    var id = this.listeners.getUUID();

    // Set the listener.
    data.listener = id;

    // Only hang on to this listener once.
    this.listeners.one(id, null, callback, ctx);
  }

  if (!this.isReady){
    this.queue.push(data);
    return false;
  }

  OP.log('Player.send', data, this.origin);
  this.elem.contentWindow.postMessage(JSON.stringify(data), this.origin);
  return true;
};

OP.Player.prototype.receive = function(e){
  OP.log('Player.receive', e);
  if (e.origin !== this.origin){
    return false;
  }

  var data;
  try {
    data = JSON.parse(e.data);
  } catch (err){
    // Not a valid response.
    return false;
  }

  // We need to determine if we are ready.
  if (data.method === 'ready'){
    this.ready();
  }

  if (this.listeners.has(data.listener)){
    this.listeners.execute(data.listener, data.value);
  }
};


OP.Player.prototype.ready = function(){

  if (this.isReady === true){
    return false;
  }

  // set ready.
  this.isReady = true;

  // Clear the queue
  for (var i=0; i<this.queue.length; i++){
    OP.log('Player.dequeue', this.queue[i]);
    this.send(this.queue[i]);
  }
  this.queue = [];
};

OP.Player.prototype.connect = function(callback, ctx){
  var id = this.listeners.getUUID();
  this.listeners.one(id, 'ready', callback, ctx);

  if (this.isReady){
    this.listeners.execute(id);
  } else {
    // We need to give the option to connect after we play.
    this.elem.contentWindow.postMessage(JSON.stringify({
      method:'ready',
      listener: id
    }), this.origin);
  }
};

OP.Player.prototype.on = function(event, callback, ctx){
  var id = this.listeners.getUUID();

  this.listeners.on(id, event, callback, ctx);

  this.send({
    method: 'addEventListener',
    event: event,
    listener: id
  });

  return true;
};

OP.Player.prototype.off = function(event, callback){

  var listeners = this.listeners.off(event, callback);

  if (listeners.length > 0) {
    for (var i in listeners){
      this.send({
        method: 'removeEventListener',
        event: event,
        listener: listeners[i]
      });
      return true;
    }
  }

  return false;
};

OP.Player.prototype.play = function(){
  this.send({
    method: 'play'
  });
};

OP.Player.prototype.pause = function(){
  this.send({
    method: 'pause'
  });
};

OP.Player.prototype.paused = function(callback, ctx){
  this.send({
    method: 'paused'
  }, callback, ctx);
};

OP.Player.prototype.mute = function(){
  this.send({
    method: 'mute'
  });
};

OP.Player.prototype.unmute = function(){
  this.send({
    method: 'unmute'
  });
};

OP.Player.prototype.isMuted = function(callback, ctx){
  this.send({
    method: 'isMuted'
  }, callback, ctx);
};

OP.Player.prototype.getVolume = function(callback, ctx){
  this.send({
    method: 'getVolume'
  }, callback, ctx);
};

OP.Player.prototype.setVolume = function(value){
  this.send({
    method: 'setVolume',
    value: value
  });
};

OP.Player.prototype.getDuration = function(callback, ctx){
  this.send({
    method: 'getDuration'
  }, callback, ctx);
};

OP.Player.prototype.seekTo = function(value){
  this.send({
    method: 'seekTo',
    value: value
  });
};

OP.Player.prototype.currentTime = function(callback, ctx){
  this.send({
    method: 'currentTime'
  }, callback, ctx);
};

// Set the global.
window.OP = OP;
