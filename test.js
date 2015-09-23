var expect = require('chai').expect;
var creds = require('./test_credentials.json');
var ServiceNow = require('./');

describe('ServiceNow Service', function () {
  var sn;

  before(function () {
    sn = new ServiceNow(creds.url, creds.username, creds.password, { version: 'v1' });
  });

  it('should update table field', function (done) {
    var incident = sn.record('incident', 'c4b52ab2d70121008de76ccf6e6103a1');
    var sd = "Updated " + (new Date());

    var opts = {
      params: {
        sysparm_scope: 'global'
      }
    };

    incident.set('short_description', sd).update(opts)
      .then(() => done())
      .catch((err) => done(err));
  });

  it ('should return an error when a record doesn\'t exist', function (done) {
    var incident = sn.record('incident', '12345');
    var sd = "Updated " + (new Date());

    var opts = {
      params: {
        sysparm_scope: 'global'
      }
    };

    incident.set('short_description', sd).update(opts)
      .then(() => done('Should give an error'))
      .catch((err) => done());
  });
});
