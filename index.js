var rest = require('restify');

var ServiceNow = function ServiceNow(url, username, password, version) {
  this.url = url;
  this.username = username;
  this.password = password;
  this.version = version || 'v1';
};

ServiceNow.prototype.record = function ServiceNow_record(table, sys_id) {
  var sn = this;

  var tbl = rest.service(function () {
    this.defaults.username = sn.username;
    this.defaults.password = sn.password;
    this._sn_dirty = {};
    this._sn_fields = {};
    this._sn_url = '/api/' + sn.version + '/' + table + '/' + sys_id;
  }, {
    baseURL: sn.url
  }, {
    set: function set(field, value) {
      this._sn_dirty[field] = value;
      return this;
    },

    update: function () {
      var that = this;
      var p = new Promise(function (resolve, reject) {
        that
          .postJson(that._sn_url, that._sn_dirty)
          .on('complete', function (result, response) {
            if (result instanceof Error) {
              reject(result);
            } else {
              Object.keys(that._sn_dirty).forEach(v => that._sn_fields[v] = that._sn_dirty;);
              that._sn_dirty = {};
              resolve(result);
            }
          });
      });

      return p;
    },

    retrieve: function (fields) {
      return this;
    },

    get: function () {
      var that = this;
      var p = new Promise(function (resolve, reject) {
        that
          .json(that._sn_url)
          .on('complete', function (result, response) {
            if (result instanceof Error) {
              reject(result);
            } else {
              that._sn_fields = result.result;
              resolve(result.result);
            }
          });
      });
    }
  });

  return new tbl();
};

module.exports = ServiceNow;