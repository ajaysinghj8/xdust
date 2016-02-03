# xdust
A dust template engine for express framework.
it can be use to fetch templates from multiple sources.
Example : fileSystem - defined under views,
          databases - Mongo, MySql and others 
		  or any other location.
##USE

> Requiring using common js pattern.

   `var xDust = require('xdust');`
   `app.engine('dust', xDust(app);`
   `app.set('view engine', 'dust');`
 
> Here app is an Express Application.

##Docs

 `xDust(express_app, reader, sources);`

>Example reading from mongodb

     `var reader = require('readerFile');  `
	 `app.engine('dust', xDust(app, reader, ['db']);`
     `app.set('view engine', 'dust');`
  
>  Define the source as db.

     ` response.render('db:xyz'); `
 
> Defining Reader for db type source

     `class Reader{`
	 `  dbRead(fullPath, fileName, cb){ `
	 `    Mongo.findOne({},function(err,doc){ `
	 `		cb(err,doc.template.toString());   `
	 `	});  `
	 `  }`
	 `}`
 