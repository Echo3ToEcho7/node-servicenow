ServiceNow Node
===============

The servicenow-node library is a simple wrapper around the v1 Table REST
Api. Currently, the library only supports getting a record and updating
a record. I will add create, delete, and query operations in the future.

Example
-------

```javascript

var ServiceNow = requrie('servicenow-node');
var instance = new ServiceNow('https://myinstance.service-now.com', 'username', 'password');
var irecord = instance.record('incident', '1234567890abcdef');

irecord.retrieve().then(() =>
  console.log('Short Description', irecord.get('short_description'));
  irecord.set('short_decription', 'Some Udpate')
         .set('state', 3)
         .update()
         .then((res) => console.log(res.short_decription));
);
```
