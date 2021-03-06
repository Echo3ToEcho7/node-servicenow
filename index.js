var rest = require('restler');

var ServiceNow = function ServiceNow(url, username, password, opts) {
  this.url = url;
  this.username = username;
  this.password = password;
  this.opts = {};
  if (typeof opts === 'string') {
    this.version = opts;
    this.opts.version = this.version;
  } else {
    this.opts = Object.assign(this.opts, opts);
  }
};

ServiceNow.prototype.record = function ServiceNow_record(table, sys_id) {
  var sn = this;

  var tbl = rest.service(function () {
    this.defaults.username = sn.username;
    this.defaults.password = sn.password;

    this._sn_dirty = {};
    this._sn_fields = {};

    this._sn_url = '/api/now';
    if (sn.opts.version) {
      this._sn_url += '/' + sn.opts.version
    }
    this._sn_url += '/table/' + table + '/' + sys_id;
  }, {
    baseURL: sn.url,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }, {
    set: function set(field, value) {
      this._sn_dirty[field] = value;
      return this;
    },

    update: function (opts) {
      var that = this;
      var o = Object.assign({}, opts);

      var p = new Promise(function (resolve, reject) {
        var params = Object.assign({}, sn.opts.params, o.params);
        var queries = Object.keys(params).map((k) => `${k}=${params[k]}`);
        var query = queries.join('&');
        var url = that._sn_url + (queries.length > 0 ? `?${query}` : '');

        //console.log('url', url);
        that.put(url, {
          data: JSON.stringify(that._sn_dirty),
        }).on('complete', function (result, response) {
          if (result instanceof Error) {
            //console.log('Error', result);
            reject(result);
            return;
          } else if (result.error) {
            //console.log('Result error', result.error);
            reject(result.error);
            return;
          } else {
            //console.log('Success', result.result);
            that._sn_dirty = {};
            that._sn_fields = result.result;
            resolve(result.result);
            return;
          }
        });
      });

      return p;
    },

    retrieve: function (fields) {
      var that = this;
      var p = new Promise(function (resolve, reject) {
        that.json(that._sn_url).on('complete', function (result, response) {
          if (result instanceof Error) {
            reject(result);
            return;
          } else if (result.error) {
            reject(result.error);
            return;
          } else {
            that._sn_fields = result.result;
            resolve(result.result);
            return;
          }
        });
      });
    },

    get: function (field) {
      return this._sn_fields[field];
    }
  });

  return new tbl();
};

module.exports = ServiceNow;
