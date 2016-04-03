# xdust
A dust template engine for express framework.
it can be use to fetch templates from multiple sources like - 
fileSystem (templates defined under views folder),
databases (Mongo, MySql) and any other place. 


## USE

> Requiring using common js pattern.

    var xDust = require('xdust');
    app.engine('dust', xDust(app).__express);
    app.set('view engine', 'dust');
 
> Here app is an Express Application.

## Extend

    xDust(express_app, reader, redisClient);

> Example reading from mongodb
     
     var mongoReader = {
        source: 'db',
        read: function(fullPath, templateName, cb){
            //reading from defined Template Model
            Template.findOne({name,templateName},function(err, doc){
                if(err, !doc) return cb(err, doc.body);
                return cb(new Error('Template not found!'));
            });
        }
      };   
	 app.engine('dust', xDust(app, [mongoReader,...]).__express);
     app.set('view engine', 'dust'); 
  
>  Define the source as db.

      response.render('db:xyz'); 
      
## Cache

   > Pass the redisClient in xDust and application will use a centralized caching mechanism. Which may help you in clearing cache in scalable Architecture.
     Todo so, you can use followings
     
     xDust().cache.flushAll(optionalCallBack); 
     
     or 
     
     xDust().cache.flush('key',optionalCallBack);
         
 
## TODOs

* ~~Cache~~ 
  * ~~Caching of compiled template inside dust.~~
  * ~~Caching of template strings read from sources.~~
* Performance
* Tests