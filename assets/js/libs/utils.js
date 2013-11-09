
var _ = {};

// Random Conts
var breaker = {};

var ArrayProto = Array.prototype,
  ObjProto = Object.prototype,
  FuncProto = Function.prototype;

var
  push             = ArrayProto.push,
  slice            = ArrayProto.slice,
  concat           = ArrayProto.concat,
  toString         = ObjProto.toString,
  hasOwnProperty   = ObjProto.hasOwnProperty;

var
  nativeForEach      = ArrayProto.forEach,
  nativeMap          = ArrayProto.map,
  nativeReduce       = ArrayProto.reduce,
  nativeReduceRight  = ArrayProto.reduceRight,
  nativeFilter       = ArrayProto.filter,
  nativeEvery        = ArrayProto.every,
  nativeSome         = ArrayProto.some,
  nativeIndexOf      = ArrayProto.indexOf,
  nativeLastIndexOf  = ArrayProto.lastIndexOf,
  nativeIsArray      = Array.isArray,
  nativeKeys         = Object.keys,
  nativeBind         = FuncProto.bind;

_.each = function(obj, iterator, context) {
    if (obj == null) { return; }
    if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
            if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) { return; }
        }
    } else {
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                if (iterator.call(context, obj[key], key, obj) === breaker) { return; }
            }
        }
    }
};

_.map = function(obj, iterator, context) {
  var results = [];
  if (obj == null) {
    return results;
  }
  if (Array.prototype.map && obj.map === Array.prototype.map){
    return obj.map(iterator, context);
  }
  _.each(obj, function(value, index, list) {
    results[results.length] = iterator.call(context, value, index, list);
  });
  return results;
};

// From: http://bit.ly/T9SjVv
_.zip = function(arrays) {
  return _.map(arrays[0], function(_,i){
    return _.map(arrays, function(array){return array[i];});
  });
};

_.extend = function(obj) {
    _.each(Array.prototype.slice.call(arguments, 1), function(source) {
        for (var prop in source) {
            if (source[prop] !== void 0){ obj[prop] = source[prop]; }
        }
    });
    return obj;
};


var ctor = function(){};

_.bind = function(func, context) {
  var args, bound;
  if (nativeBind && func.bind === nativeBind) {
    return nativeBind.apply(func, slice.call(arguments, 1));
  }
  if (!_.isFunction(func)) {
    throw new TypeError;
  }
  args = slice.call(arguments, 2);
  return bound = function() {
    if (!(this instanceof bound)) {
      return func.apply(context, args.concat(slice.call(arguments)));
    }
    ctor.prototype = func.prototype;
    var self = new ctor;
    ctor.prototype = null;
    var result = func.apply(self, args.concat(slice.call(arguments)));
    if (Object(result) === result) { return result; }
    return self;
  };
};

_.trim = function(str){
   return str.replace(/^\s+|\s+$/g, '');
};


/* is Functions*/

// from a comment on http://dbj.org/dbj/?p=286
// fails on only one very rare and deliberate custom object:
// var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
_.isFunction = function (f) {
    try {
        return (/^\s*\bfunction\b/).test(f);
    } catch (x) {
        return false;
    }
};

_.isNone = function(obj){
  return (obj === null || obj === undefined);
};
_.isString = function(obj){
  return toString.call(obj) === "[object String]";
};
_.isNumber = function(obj){
  return toString.call(obj) === "[object Number]";
};
_.isDate = function(obj){
  return toString.call(obj) === "[object Date]";
};
_.isObject = function(obj){
  return toString.call(obj) === "[object Object]";
};
_.isArray = function(obj){
  return toString.call(obj) === "[object Array]";
};
_.isElement = function(obj){
  return (!_.isNone(obj) && !_.isNone(obj.nodeType) && obj.nodeType === 1);
};

_.isEmptyObject = function(obj) {
    if (_.isObject(obj)) {
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) {
                return false;
            }
        }
        return true;
    }
    return false;
};

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(_){
  var initializing = false, fnTest = (/xyz/).test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  // The base Class implementation (does nothing)
  _.Class = function(){};

  // Create a new Class that inherits from this class
  _.Class.extend = function(prop) {
    var _super = this.prototype;

    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;

    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] === "function" &&
        typeof _super[name] === "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;

            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];

            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);
            this._super = tmp;

            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }

    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init ){
        this.init.apply(this, arguments);
      }
    }

    // Populate our constructed prototype object
    Class.prototype = prototype;

    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;

    return Class;
  };
})(_);


/* UUID */
_.getUUID = function(){
  return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c === 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
  });
};


/* SELECTORS */
_.getElementsByClassName = function(cls, tag){
  var elements = [];
  if (_.isFunction(document.getElementsByClassName)){
    _.each(document.getElementsByClassName(cls), function(e){
      elements.push(e);
    });
    return elements;
  }

  if (_.isNone(tag)){
    tag = '*';
  }

  var tags = document.getElementsByTagName(tag);

  _.each(tags, function(elem){
    if ((' ' + elem.className + ' ').indexOf(' '+cls+' ') > -1) {
      elements.push(elem);
    }
  });
  return elements;
};

_.getElementByClassName = function(cls, tag){
  var elements = _.getElementsByClassName(cls, tag);
  if (elements.length === 0){
    return null;
  }
  return elements[0];
};

/* DOM */
_.createElement = function(tag, attrs){
  // create the iframe.
  var elem = document.createElement(tag);

  _.each(attrs, function(v, k){
    elem.setAttribute(k, v);
  });

  return elem;
};

_.getChildren = function(elem, nodeName){
  var e = [];

  if (_.isString(nodeName)){
    nodeName = nodeName.toUpperCase();
  }

  _.each(elem.childNodes, function(node){
    if (_.isElement(node)){
      if (!_.isNone(nodeName) && nodeName !== node.nodeName){
        return false;
      }
      e.push(node);
    }
  });
  return e;
};

_.getChild = function(elem, tagName){
  /* gets the first child of the tag name.*/
  var e = _.getChildren(elem, tagName);

  if (e.length !== 0){
    return e[0];
  }
  return null;
};

_.getTextContent = function(node){
  return node.innerText || node.textContent;
};

_.setTextContent = function(node, text){
  var prop = node.textContent === undefined ? 'innerText' : 'textContent';
  node[prop] = text;
};

_.hasClass = function(elem, cls){
  var kls = elem.getAttribute('class');

  if (_.isNone(kls)){
    return false;
  }

  if ((' '+kls+' ').indexOf(' '+cls+' ') > -1){
    return true;
  }
  return false;
};

_.addClass = function(elem, cls){
  var kls = elem.getAttribute('class');

  if (_.isNone(kls)){
    elem.setAttribute('class', cls);
    return true;
  }

  var parts = kls.split(' '),
    results = [];

  _.map(parts, function(part){
    var p = _.trim(part);

    if (p !== ''){
      results.push(p);
    }
  });

  results.push(cls);

  elem.setAttribute('class', results.join(' '));
};

_.removeClass = function(elem, cls){
  var kls = elem.getAttribute('class');

  if (_.isNone(kls)){
    return true;
  }

  var parts = kls.split(' '),
    results = [];

  _.map(parts, function(part){
    var p = _.trim(part);

    if (p !== '' && p !== cls){
      results.push(p);
    }
  });

  elem.setAttribute('class', results.join(' '));
};

_.getData = function(e, attr){
  if (!_.isNone(e.dataset)){
    var parts = attr.split('-');

    if (parts.length > 1){
      attr = parts[0];
      attr += _.map(parts.slice(1), function(p){return p[0].toUpperCase() + p.substr(1);}).join('');
    }


    // Just so it's null instead of undefined
    return _.isNone(e.dataset[attr])? null: e.dataset[attr];
  }
  return e.getAttribute('data-'+attr);
};


_.parseStyle = function(style){
  var data = {};

  if (_.isNone(style)) { return data;}

  _.each(style.split(';'), function(s){
    var p = s.split(':');
    data[_.trim(p[0])] = _.trim(p[1]);
  });

  return data;
};

_.createStyle = function(data){
  var parts = [];
  _.each(data, function(v,k){
    parts.push(k+':'+v);
  });
  return parts.join(';');
};


/* EVENTS */

_.addEvent = function(elem, type, eventHandle) {
  if (_.isNone(elem)) { return; }
  if ( elem.addEventListener ) {
    elem.addEventListener( type, eventHandle, false );
  } else if ( elem.attachEvent ) {
    elem.attachEvent( "on" + type, eventHandle );
  } else {
    elem["on"+type]=eventHandle;
  }
};

_.detachEvent = function(elem, type, eventHandle) {
  if (_.isNone(elem)) { return; }
  if ( elem.removeEventListener ) {
    elem.removeEventListener( type, eventHandle, false );
  } else if ( elem.detachEvent ) {
    elem.detachEvent( "on" + type, eventHandle );
  } else {
    elem["on"+type]=null;
  }
};

/* URL */
_.parseQuery = function(query){
  var data = {};

  if (query.substr(0,1) === '#' || query.substr(0,1) === '?'){
    query = query.substr(1);
  }

  var parts = query.split('&');

  _.each(parts, function(part){
    var p = part.split('=');
    data[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
  });
  return data;
};

_.createQuery = function(data){
  var parts = [],
    query = '';

  _.each(data, function(v, k){
    parts.push(k+'='+encodeURIComponent(v));
  });

  return parts.join('&');
};

_.appendQuery = function(src, query){
  var parts = src.split('?');

  if (parts.length === 2){
    var data = _.parseQuery(parts[1]);
    data = _.extend(data, query);

    return parts[0] +'?'+ _.createQuery(data);

  } else {
    return src +'?'+ _.createQuery(query);
  }
};

_.getOrigin = function(url){
  return url.split('/').slice(0,3).join('/');
};

_.parseHost = function(url){
  if (_.isNone(url)){
    return null;
  }
  try {
    return url.split('//')[1].split('/')[0];
  } catch (err){
    return null;
  }
};


/* IMGAGES */
//IMAGES

/**
 * I want a consistent way to pick an i#{n).embed.ly server to use, so the
 * browser can effeciently cache images. So we use abs(hash(url)) % 10
 *
 * this hashing function discussion at:
 * http://werxltd.com/wp/2010/05/13/
 *   javascript-implementation-of-javas-string-hashcode-method/
 */
_.hashCode = function(str){
  var hash = 0, i, ch;
  if (str.length === 0) {
    return hash;
  }
  for (i = 0; i < str.length; i++) {
    ch = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+ch;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

_.isGif = function(url){
  if (_.isNone(url)){
    return false;
  }
  return (/.gif/i).test(url);
};


_.generateImage = function(url, width, height, options){
  var method,
    data = {
      key: 'fd92ebbc52fc43fb98f69e50e7893c13',
      url: url,
      errorurl: 'http://4.bp.blogspot.com/-_Gx8wi1NZf0/TW_S5s4MibI/' +
                'AAAAAAAAAT4/HQj19wUqfLA/s320/missin.gif'
      //t: Math.ceil(Math.random() * 10000)
    };

  // Add our options.
  data = _.extend(data, _.isNone(options)? {}: options);

  if (width || height) {
    method = 'crop';
  } else {
    method = 'resize';
  }

  if (width){
    data.width = width;
  }
  if (height){
    data.height = height;
  }

  var iServerNum = Math.abs(_.hashCode(url)) % 10;
  return 'http://i-cdn.embed.ly/1/image/'+method+'?'+_.createQuery(data);
};


if (window.EMB_DEBUG === true){
  window._ = _;
}
