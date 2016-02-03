# xdust
A dust template engine for express framework.
it can be use to fetch templates from multiple sources like - 
fileSystem (templates defined under views folder),
databases (Mongo, MySql) and any other place. 


## USE

> Requiring using common js pattern.

    var xDust = require('xdust');
    app.engine('dust', xDust(app);
    app.set('view engine', 'dust');
 
> Here app is an Express Application.

## Extend

    xDust(express_app, reader, sources);

> Example reading from mongodb

     var reader = require('./readerFilelocation'); 
	 app.engine('dust', xDust(app, reader, ['db']);
     app.set('view engine', 'dust'); 
  
>  Define the source as db.

      response.render('db:xyz'); 
 
> Defining Reader for db type source

     
     var Reader = {};
     Reader.dbRead = (fullpath, filename, cb) => {
         //get template from 
         cb(null, 'my name is {name}');
     }
     module.exports = Reader;

 
