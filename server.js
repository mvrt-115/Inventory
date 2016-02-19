var express = require('express');
var app = express();

this.index = 'mvrt-engdoc';
this.type = 'part';

app.use(express.static('node_modules'));
app.use('/', express.static('dist'));
app.use('/lib/bootstrap', express.static('node_modules/bootstrap/dist'));
app.use('/lib/fdtable', express.static('node_modules/fixed-data-table/dist'));

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;
    if(host === "")console.log('Example app listening at http://%s:%s', host, port);
    else console.log('  App listening locally at port ' + 8080);
});
