ServiceNow Node
===============

The node-servicenow library is a simple wrapper around the v1 Table REST
Api. Currently, the library only supports getting a record and updating
a record. I will add create, delete, and query operations in the future.

Example
-------

```javascript

var ServiceNow = requrie('node-servicenow');
var instance = new ServiceNow('https://myinstance.service-now.com', 'username', 'password', {
  version: 'v1'
});
var record = instance.record('incident', '1234567890abcdef');

var opts = {
  params: {
    sysparm_scope: 'global'
  }
};

record.retrieve().then(() =>
  console.log('Short Description', irecord.get('short_description'));
  record.set('short_decription', 'Some Udpate')
         .set('state', 3)
         .update(opts)
         .then((res) => console.log(res.short_decription));
);
```
