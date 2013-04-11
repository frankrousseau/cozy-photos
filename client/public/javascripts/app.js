(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("application", function(exports, require, module) {
  module.exports = {
    initialize: function() {
      var AlbumCollection, Router;

      AlbumCollection = require('collections/album');
      Router = require('router');
      this.albums = new AlbumCollection();
      this.router = new Router();
      Backbone.history.start();
      if (typeof Object.freeze === 'function') {
        return Object.freeze(this);
      }
    }
  };
  
});
window.require.register("collections/album", function(exports, require, module) {
  var AlbumCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = AlbumCollection = (function(_super) {
    __extends(AlbumCollection, _super);

    function AlbumCollection() {
      _ref = AlbumCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AlbumCollection.prototype.model = require('models/album');

    AlbumCollection.prototype.url = 'albums';

    return AlbumCollection;

  })(Backbone.Collection);
  
});
window.require.register("collections/photo", function(exports, require, module) {
  var PhotoCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = PhotoCollection = (function(_super) {
    __extends(PhotoCollection, _super);

    function PhotoCollection() {
      _ref = PhotoCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PhotoCollection.prototype.model = require('models/photo');

    PhotoCollection.prototype.url = 'photos';

    return PhotoCollection;

  })(Backbone.Collection);
  
});
window.require.register("initialize", function(exports, require, module) {
  var app;

  app = require('application');

  $(function() {
    jQuery.event.props.push('dataTransfer');
    return app.initialize();
  });
  
});
window.require.register("lib/base_view", function(exports, require, module) {
  var BaseView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = BaseView = (function(_super) {
    __extends(BaseView, _super);

    function BaseView() {
      this.render = __bind(this.render, this);    _ref = BaseView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    BaseView.prototype.initialize = function(options) {
      return this.options = options;
    };

    BaseView.prototype.template = function() {};

    BaseView.prototype.getRenderData = function() {};

    BaseView.prototype.render = function() {
      var data;

      data = _.extend({}, this.options, this.getRenderData());
      this.$el.html(this.template(data));
      this.afterRender();
      return this;
    };

    BaseView.prototype.afterRender = function() {};

    return BaseView;

  })(Backbone.View);
  
});
window.require.register("lib/helpers", function(exports, require, module) {
  module.exports = {
    limitLength: function(string, length) {
      if ((string != null) && string.length > length) {
        return string.substring(0, length) + '...';
      } else {
        return string;
      }
    },
    editable: function(el, options) {
      var onChanged, placeholder;

      placeholder = options.placeholder, onChanged = options.onChanged;
      el.prop('contenteditable', true);
      if (!el.text()) {
        el.text(placeholder);
      }
      el.focus(function() {
        if (el.text() === placeholder) {
          return el.empty();
        }
      });
      return el.blur(function() {
        if (!el.text()) {
          return el.text(placeholder);
        } else {
          return onChanged(el.text());
        }
      });
    }
  };
  
});
window.require.register("lib/view_collection", function(exports, require, module) {
  var BaseView, ViewCollection, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = ViewCollection = (function(_super) {
    __extends(ViewCollection, _super);

    function ViewCollection() {
      this.onAdd = __bind(this.onAdd, this);    _ref = ViewCollection.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    ViewCollection.prototype.itemview = null;

    ViewCollection.prototype.views = {};

    ViewCollection.prototype.template = function() {
      return '';
    };

    ViewCollection.prototype.itemViewOptions = function() {};

    ViewCollection.prototype.afterRender = function() {
      this.onReset(this.collection);
      this.listenTo(this.collection, "reset", this.onReset);
      this.listenTo(this.collection, "add", this.onAdd);
      return this.listenTo(this.collection, "remove", this.onRemove);
    };

    ViewCollection.prototype.onAdd = function(model) {
      var options, view;

      options = _.extend({}, {
        model: model
      }, this.itemViewOptions(model));
      view = new this.itemview(options);
      view.render();
      this.views[model.id] = view;
      return this.appendView(view);
    };

    ViewCollection.prototype.appendView = function(view) {
      return this.$el.append(view.el);
    };

    ViewCollection.prototype.onRemove = function(model) {
      var id, view, _ref1, _results;

      _ref1 = this.views;
      _results = [];
      for (id in _ref1) {
        view = _ref1[id];
        if (view.model === model) {
          view.remove();
          _results.push(delete this.views[id]);
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ViewCollection.prototype.onReset = function(newcollection) {
      var id, view, views, _ref1;

      _ref1 = this.views;
      for (id in _ref1) {
        view = _ref1[id];
        view.remove();
      }
      views = {};
      return newcollection.forEach(this.onAdd);
    };

    return ViewCollection;

  })(BaseView);
  
});
window.require.register("models/album", function(exports, require, module) {
  var Album, PhotoCollection,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  PhotoCollection = require('collections/photo');

  module.exports = Album = (function(_super) {
    __extends(Album, _super);

    Album.prototype.urlRoot = 'albums';

    Album.prototype.defaults = {
      title: '',
      description: ''
    };

    function Album() {
      this.photos = new PhotoCollection();
      return Album.__super__.constructor.apply(this, arguments);
    }

    Album.prototype.parse = function(attrs) {
      var _ref;

      if (((_ref = attrs.photos) != null ? _ref.length : void 0) > 0) {
        this.photos.reset(attrs.photos);
      }
      delete attrs.photos;
      return attrs;
    };

    return Album;

  })(Backbone.Model);
  
});
window.require.register("models/photo", function(exports, require, module) {
  var Photo, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = Photo = (function(_super) {
    __extends(Photo, _super);

    function Photo() {
      _ref = Photo.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    return Photo;

  })(Backbone.Model);
  
});
window.require.register("models/photoprocessor", function(exports, require, module) {
  var MAX_HEIGHT, MAX_WIDTH, Photo, clearTemp, concurrency, makeThumbBlob, makeThumbDataURI, operation, queue, readFile, upload;

  Photo = require('models/photo');

  MAX_WIDTH = MAX_HEIGHT = 100;

  readFile = function(photo, next) {
    var reader,
      _this = this;

    reader = new FileReader();
    photo.img = new Image();
    reader.readAsDataURL(photo.file);
    return reader.onloadend = function() {
      photo.file_du = reader.result;
      photo.img.src = reader.result;
      return photo.img.onload = function() {
        return next();
      };
    };
  };

  makeThumbDataURI = function(photo, next) {
    var canvas, ctx, height, newHeight, newWidth, width;

    width = photo.img.width;
    height = photo.img.height;
    if (width > height && height > MAX_HEIGHT) {
      newWidth = width * MAX_HEIGHT / height;
      newHeight = MAX_HEIGHT;
    } else if (width > MAX_WIDTH) {
      newWidth = MAX_WIDTH;
      newHeight = height * MAX_WIDTH / width;
    }
    canvas = document.createElement('canvas');
    canvas.width = MAX_WIDTH;
    canvas.height = MAX_HEIGHT;
    ctx = canvas.getContext('2d');
    ctx.drawImage(photo.img, 0, 0, newWidth, newHeight);
    photo.thumb_du = canvas.toDataURL('image/jpeg');
    photo.trigger('change');
    delete photo.img;
    return next();
  };

  makeThumbBlob = function(photo, next) {
    var array, binary, i, _i, _ref;

    binary = atob(photo.thumb_du.split(',')[1]);
    array = [];
    for (i = _i = 0, _ref = binary.length; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
      array.push(binary.charCodeAt(i));
    }
    photo.thumb = new Blob([new Uint8Array(array)], {
      type: 'image/jpeg'
    });
    return next();
  };

  upload = function(photo, next) {
    var formdata, key, value, _ref;

    formdata = new FormData();
    formdata.append('raw', photo.file);
    formdata.append('thumb', photo.thumb, "thumb_" + photo.file.name);
    _ref = photo.toJSON();
    for (key in _ref) {
      value = _ref[key];
      formdata.append(key, value);
    }
    return Backbone.sync('create', photo, {
      contentType: false,
      success: function() {
        return next();
      },
      data: formdata
    });
  };

  clearTemp = function(photo, next) {
    delete photo.file;
    delete photo.img;
    delete photo.file_du;
    delete photo.thumb;
    delete photo.thumb_du;
    return next();
  };

  operation = function(task, callback) {
    var file, photo;

    photo = task.photo, file = task.file;
    photo.file = file;
    return async.waterfall([
      function(cb) {
        return readFile(photo, cb);
      }, function(cb) {
        return makeThumbDataURI(photo, cb);
      }, function(cb) {
        return makeThumbBlob(photo, cb);
      }, function(cb) {
        return upload(photo, cb);
      }, function(cb) {
        return clearTemp(Photo, cb);
      }
    ], callback);
  };

  concurrency = 3;

  queue = async.queue(operation, concurrency);

  module.exports.process = function(file, photo) {
    return queue.push({
      file: file,
      photo: photo
    }, function() {});
  };
  
});
window.require.register("router", function(exports, require, module) {
  var Album, AlbumView, AlbumsListView, Router, app, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = require('application');

  AlbumsListView = require('views/albumslist');

  AlbumView = require('views/album');

  Album = require('models/album');

  module.exports = Router = (function(_super) {
    __extends(Router, _super);

    function Router() {
      this.displayView = __bind(this.displayView, this);    _ref = Router.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Router.prototype.routes = {
      '': 'albumslist',
      'albums': 'albumslist',
      'albums/edit': 'albumslistedit',
      'albums/new': 'newalbum',
      'albums/:albumid': 'album',
      'albums/:albumid/edit': 'albumedit'
    };

    Router.prototype.albumslist = function(editable) {
      var _this = this;

      if (editable == null) {
        editable = false;
      }
      return app.albums.fetch().then(function() {
        return _this.displayView(new AlbumsListView({
          collection: app.albums,
          editable: editable
        }));
      });
    };

    Router.prototype.newalbum = function() {
      var album,
        _this = this;

      album = new Album();
      album.once('change:id', function(model, id) {
        return _this.navigate("albums/" + id);
      });
      return this.displayView(new AlbumView({
        model: album,
        editable: true
      }));
    };

    Router.prototype.album = function(id, editable) {
      var album,
        _this = this;

      if (editable == null) {
        editable = false;
      }
      album = app.albums.get(id);
      if (album == null) {
        album = new Album({
          id: id
        });
      }
      return album.fetch().done(function() {
        return _this.displayView(new AlbumView({
          model: album,
          editable: editable
        }));
      });
    };

    Router.prototype.albumslistedit = function() {
      return this.albumslist(true);
    };

    Router.prototype.albumedit = function(id) {
      return this.album(id, true);
    };

    Router.prototype.displayView = function(view) {
      if (this.mainView) {
        this.mainView.remove();
      }
      this.mainView = view;
      return $('body').append(view.render().el);
    };

    return Router;

  })(Backbone.Router);
  
});
window.require.register("templates/album", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="row-fluid"><div id="about" class="span4"><h1 id="path"><a href="#albums">&lt;</a>&nbsp;</h1><h1 id="title">' + escape((interp = title) == null ? '' : interp) + '</h1><div id="description">' + escape((interp = description) == null ? '' : interp) + '</div></div><div id="photos" class="span8"></div></div>');
  if ( 'undefined' != typeof id)
  {
  buf.push('<div class="btn-group editor"><a class="btn delete btn-inverse"><i class="icon-remove icon-white"></i></a>');
  if ( editable)
  {
  buf.push('<a');
  buf.push(attrs({ 'href':("#albums/" + (id) + ""), "class": ('btn') + ' ' + ('btn-inverse') }, {"href":true}));
  buf.push('><i class="icon-eye-open icon-white"></i></a>');
  }
  else
  {
  buf.push('<a');
  buf.push(attrs({ 'href':("#albums/" + (id) + "/edit"), "class": ('btn') + ' ' + ('btn-inverse') }, {"href":true}));
  buf.push('><i class="icon-edit icon-white"></i></a>');
  }
  buf.push('</div>');
  }
  }
  return buf.join("");
  };
});
window.require.register("templates/albumlist", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="btn-group editor"><a href="#albums/new" class="btn btn-inverse"><i class="icon-plus icon-white"></i></a>');
  if ( editable)
  {
  buf.push('<a href="#albums" class="btn btn-inverse"><i class="icon-eye-open icon-white"></i></a>');
  }
  else
  {
  buf.push('<a href="#albums/edit" class="btn btn-inverse"><i class="icon-edit icon-white"></i></a>');
  }
  buf.push('</div>');
  }
  return buf.join("");
  };
});
window.require.register("templates/albumlist_item", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a');
  buf.push(attrs({ 'href':("#albums/" + (id) + ""), "class": ('pull-left') }, {"href":true}));
  buf.push('><img');
  buf.push(attrs({ 'src':("" + (thumbsrc) + ""), "class": ('media-object') }, {"src":true}));
  buf.push('/></a><div class="media-body"><h4 class="media-heading">' + escape((interp = title) == null ? '' : interp) + '</h4><p>' + escape((interp = description) == null ? '' : interp) + '</p></div>');
  if ( editable)
  {
  buf.push('<btn class="btn delete btn-danger"><i class="icon-remove icon-white"></i></btn>');
  }
  }
  return buf.join("");
  };
});
window.require.register("templates/photo", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<a');
  buf.push(attrs({ 'href':("" + (src) + ""), 'title':("" + (title) + "") }, {"href":true,"title":true}));
  buf.push('><img');
  buf.push(attrs({ 'src':("" + (thumbsrc) + ""), 'alt':("" + (title) + "") }, {"src":true,"alt":true}));
  buf.push('/></a>');
  if ( editable)
  {
  buf.push('<btn class="btn delete btn-danger"><i class="icon-remove icon-white"></i></btn>');
  }
  }
  return buf.join("");
  };
});
window.require.register("views/album", function(exports, require, module) {
  var AlbumView, BaseView, Gallery, app, editable, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  app = require('application');

  BaseView = require('lib/base_view');

  Gallery = require('views/gallery');

  editable = require('lib/helpers').editable;

  module.exports = AlbumView = (function(_super) {
    __extends(AlbumView, _super);

    function AlbumView() {
      this.makeEditable = __bind(this.makeEditable, this);
      this.beforePhotoUpload = __bind(this.beforePhotoUpload, this);
      this.events = __bind(this.events, this);    _ref = AlbumView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AlbumView.prototype.template = require('templates/album');

    AlbumView.prototype.className = 'container-fluid';

    AlbumView.prototype.events = function() {
      var _this = this;

      return {
        'click   a.delete': function() {
          return _this.model.destroy().then(function() {
            return app.router.navigate('albums', true);
          });
        }
      };
    };

    AlbumView.prototype.getRenderData = function() {
      return this.model.attributes;
    };

    AlbumView.prototype.afterRender = function() {
      this.about = this.$('#about');
      this.title = this.$('#title');
      this.gallerydiv = this.$('#photos');
      this.description = this.$('#description');
      this.gallery = new Gallery({
        el: this.gallerydiv,
        editable: this.options.editable,
        collection: this.model.photos,
        beforeUpload: this.beforePhotoUpload
      });
      this.gallery.render();
      if (this.options.editable) {
        return this.makeEditable();
      }
    };

    AlbumView.prototype.beforePhotoUpload = function(done) {
      var _this = this;

      if (this.model.isNew()) {
        return this.saveModel().then(function() {
          return done({
            albumid: _this.model.id
          });
        });
      } else {
        return done({
          albumid: this.model.id
        });
      }
    };

    AlbumView.prototype.makeEditable = function() {
      var _this = this;

      editable(this.title, {
        placeholder: 'Title ...',
        onChanged: function(text) {
          return _this.saveModel({
            title: text
          });
        }
      });
      return editable(this.description, {
        placeholder: 'Write some more ...',
        onChanged: function(text) {
          return _this.saveModel({
            description: text
          });
        }
      });
    };

    AlbumView.prototype.saveModel = function(hash) {
      return this.model.save(hash).then(function() {
        return app.albums.add(this.model);
      });
    };

    return AlbumView;

  })(BaseView);
  
});
window.require.register("views/albumslist", function(exports, require, module) {
  var AlbumsList, ViewCollection, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('lib/view_collection');

  module.exports = AlbumsList = (function(_super) {
    __extends(AlbumsList, _super);

    function AlbumsList() {
      _ref = AlbumsList.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AlbumsList.prototype.id = 'album-list';

    AlbumsList.prototype.itemview = require('views/albumslist_item');

    AlbumsList.prototype.template = require('templates/albumlist');

    AlbumsList.prototype.itemViewOptions = function() {
      return {
        editable: this.options.editable
      };
    };

    return AlbumsList;

  })(ViewCollection);
  
});
window.require.register("views/albumslist_item", function(exports, require, module) {
  var AlbumItem, BaseView, limitLength, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  limitLength = require('lib/helpers').limitLength;

  module.exports = AlbumItem = (function(_super) {
    __extends(AlbumItem, _super);

    function AlbumItem() {
      this.events = __bind(this.events, this);    _ref = AlbumItem.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    AlbumItem.prototype.className = 'albumitem media';

    AlbumItem.prototype.template = require('templates/albumlist_item');

    AlbumItem.prototype.initialize = function() {
      var _this = this;

      return this.listenTo(this.model, 'change', function() {
        return _this.render();
      });
    };

    AlbumItem.prototype.events = function() {
      var _this = this;

      return {
        'click btn.delete': function() {
          return _this.model.destroy();
        }
      };
    };

    AlbumItem.prototype.getRenderData = function() {
      var out;

      out = this.model.attributes;
      if (out.thumb != null) {
        out.thumbsrc = "photos/thumbs/" + out.thumb + ".jpg";
      } else {
        out.thumbsrc = "img/nophotos.gif";
      }
      out.description = limitLength(out.description, 250);
      return out;
    };

    return AlbumItem;

  })(BaseView);
  
});
window.require.register("views/gallery", function(exports, require, module) {
  var Gallery, Photo, PhotoView, ViewCollection, photoprocessor, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  ViewCollection = require('lib/view_collection');

  PhotoView = require('views/photo');

  Photo = require('models/photo');

  photoprocessor = require('models/photoprocessor');

  module.exports = Gallery = (function(_super) {
    __extends(Gallery, _super);

    function Gallery() {
      _ref = Gallery.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Gallery.prototype.itemview = PhotoView;

    Gallery.prototype.afterRender = function() {
      Gallery.__super__.afterRender.apply(this, arguments);
      return this.$el.photobox('a', {
        thumbs: true
      });
    };

    Gallery.prototype.itemViewOptions = function() {
      return {
        editable: this.options.editable
      };
    };

    Gallery.prototype.events = function() {
      if (this.options.editable) {
        return {
          'drop': 'onFilesDropped',
          'dragover': 'onDragOver'
        };
      }
    };

    Gallery.prototype.onFilesDropped = function(evt) {
      var files;

      this.$el.removeClass('dragover');
      evt.stopPropagation();
      evt.preventDefault();
      files = evt.dataTransfer.files;
      this.handleFiles(files);
      return false;
    };

    Gallery.prototype.onDragOver = function(evt) {
      this.$el.addClass('dragover');
      evt.preventDefault();
      evt.stopPropagation();
      return false;
    };

    Gallery.prototype.handleFiles = function(files) {
      var _this = this;

      return this.options.beforeUpload(function(options) {
        var file, photo, photoattrs, _i, _len, _results;

        _results = [];
        for (_i = 0, _len = files.length; _i < _len; _i++) {
          file = files[_i];
          photoattrs = _.extend({
            title: file.name
          }, options);
          photo = new Photo(photoattrs);
          _this.collection.add(photo);
          _results.push(photoprocessor.process(file, photo));
        }
        return _results;
      });
    };

    return Gallery;

  })(ViewCollection);
  
});
window.require.register("views/photo", function(exports, require, module) {
  var BaseView, PhotoView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseView = require('lib/base_view');

  module.exports = PhotoView = (function(_super) {
    __extends(PhotoView, _super);

    function PhotoView() {
      this.events = __bind(this.events, this);    _ref = PhotoView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    PhotoView.prototype.template = require('templates/photo');

    PhotoView.prototype.className = 'photo';

    PhotoView.prototype.initialize = function(options) {
      PhotoView.__super__.initialize.apply(this, arguments);
      return this.listenTo(this.model, 'change', function() {
        return this.render();
      });
    };

    PhotoView.prototype.events = function() {
      var _this = this;

      return {
        'click   btn.delete': function() {
          return _this.model.destroy();
        }
      };
    };

    PhotoView.prototype.getRenderData = function() {
      var src, thumb;

      thumb = 'img/loading.gif';
      if (!this.model.isNew()) {
        thumb = "photos/thumbs/" + this.model.id + ".jpg";
      } else if (this.model.thumb_du) {
        thumb = this.model.thumb_du;
      }
      src = !this.model.isNew() ? "photos/" + this.model.id + ".jpg" : 'img/loading.gif';
      return _.extend({
        thumbsrc: thumb,
        src: src
      }, this.model.attributes);
    };

    return PhotoView;

  })(BaseView);
  
});
