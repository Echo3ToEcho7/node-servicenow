var expect = require('chai').expect;
var creds = require('./test_credentials.json');
var ServiceNow = require('./');

describe('ServiceNow Service', function () {
  var sn;

  before(function () {
    sn = new ServiceNow(creds.url, creds.username, creds.password);
  });

  it('should update table field', function (done) {
    var incident = sn.record('incident', 'c4b52ab2d70121008de76ccf6e6103a1');
    var sd = "Updated " + (new Date());

    incident.set('short_description', sd).update().then(done).catch(function (err) {
      console.log(err);
      done(err);
    });
  });
});
