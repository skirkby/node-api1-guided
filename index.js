const db = require('./data/hubs-model.js');
// bring express into the project
const express = require('express');

// create a "server" object
const server = express();


server.listen(4000, () => {
    console.log('=== server listening on port 4000 ===');
});

//
// express.json() is a parser function... if json *text* is in the body, this
// method will parse it into an actual object, so that when we access req.body,
// it will be an actual object.
//
server.use(express.json());

//
// Among other things, one of the basic things that API's do is provide access
// to data. In databases, you usually perform CRUD operations.
//
//      CRUD - Create, Read, Update, Delete
//
// REST API's are API's that use HTTP to send requests and get responses. An
// HTTP request includes a "method" (also known as a "verb") that describe what
// the client is requesting the server to *do*. Typically, these methods/verbs
// relate to actions to take related to data. CRUD operations can be represented
// by HTTP methods.
//
// There are quite a few HTTP methods, but 4 of them typically map onto CRUD
// operations: 
//
//      CRUD Operation      HTTP Method
//      --------------      -----------
//      Create..............POST
//      Read................GET
//      Update..............PUT
//      Delete..............DELETE
//
// You create handlers for a particular METHOD in Express by calling a method on
// the "server" that corresponds to the HTTP method, specifying a route path,
// and providing a callback function that can receive a "request" object and a
// "response" object.
//
// The request object includes information about the request, including the
// request body if there is one, query parameters if there are any, and
// parameters in the URL if there are any)
//
// The response object can be used to control/set properties on the response the
// server will send back to the client (and can also be used to actually send
// the response, once we are done configuring it.)
//
// The request and response parameter names in our callback function are
// arbitrary: we can call them whatever we want. They are typically called "req"
// and "res", because it's traditional (almost everyone does it), and because
// they are shorter.
//
// Every method+route handler will get a callback that takes at least 2
// parameters: req and res. (We will learn later about other possibl parameters
// to the callback function in addition to req/res.)
//

//
// With Express, the "handlers" you create match specific "method"+"route"
// combinations. Express will check the HTTP method (GET, PUT, POST, DELETE, and
// others), and will also check the "route" (the path in the URL after the host
// name). If the method+route matches a handler, then that handler is executed.
//

//
// A handler for GET '/'.
//
server.get('/', (request, response) => {
    response.send('hello world...');
})


//
// A handler for GET '/hubs' that returns a list of all hubs in the database.
//
// We "require()"'ed the ./data/hubs-model.js file, which exports database
// access/manipulation methods (add, remove, update, find, etc.). The exports
// are assigned to a variable named "db" in our "require()" statement above.
//
// One of the methods is "find()". By default, db.find() returns all hubs in the
// DB.
//
// Each of the DB methods returns a Promise. We specify what to do when a
// Promise "resolves" by passing a callback in the .then() method on the Promise
// object. We specify what to do when a Promise "rejects" (if an exception is
// thrown, or a Reject happens for any other reason) by passing a callback in
// the .catch() method on the Promise object.
//
// We will cover another Promise syntax called "async/await" in a future class.
//
server.get('/hubs', (req, res) => {
    db.find()
        .then(hubs => {
            res.status(200).json(hubs);
        })
        .catch(err => {
            res.status(500).json({ sucess: false, err });
        });
});

//
// The POST HTTP method (verb) is typically used to create a new object in
// whatever "collection" you specify in the URL. In REST API's, the URL often
// represents a single object in a data store (like a database), or the URL can
// represent a "collection" of objects in a data store.
//
// When we want to create an object, we need to specify the "collection" the
// object is to be created in, and that is the URL we pass. The HTTP method we
// use is "POST". It's like we are saying "POST this new object to the
// collection." 
//
// The data that is used to create the new object is passed in the POST request
// body as a "stringified" JSON object.
//
// In order for this "stringified" JSON object to be converted into an action
// JSON object, it has to be processed by a handler. Above, we added such a
// handler to the "chain" of handlers using the "server.use()" method. We will
// learn about "middleware" in a later class... basically, server.use() takes a
// function and adds it as a "handler" to a chain of handler for a specific
// method+route combination. In this case, we are telling Express that we want
// the handler to apply to ALL method+route combinations (that's why we don't
// specify a method or a route... leaving those out means "apply to all").
//
// The middleware function express.json() is added to the chain with the
// server.use() call, and is applied to every request. This is a parser that
// checks to see if the body type is supposed to be "json" (looking for a
// content-type header in the HTTP response), and then converts the text of the
// body into an actual JSON object that can be accessed using req.body.
//
// If the body is in the right format (i.e. contains the right field/parameter
// names, such as {"name":"value"}), the object that is created by
// express.json() parsing the request body can be passed straight to the DB
// method to add a record to the DB: db.add().
//
// (We really should do some validation of the format of the object, rather than
// just relying on the DB to reject it. but this is just a demo, so...)
//
server.post('/hubs', (req, res) => {
    const hubInfo = req.body;
    // console.log('body:', hubInfo);

    db.add(hubInfo)
        .then((hub) => {
            res.status(201).json({ success: true, hub });
        })
        .catch((err) => {
            res.status(500).json({ success: false, err });
        });
});

//
// This handler works for DELETE '/hubs/:id'.
//
// Notice the "parameter" in the url... preceding a URL "part" name with a colon
// designates it as a "parameter". You can access all parameters that are
// identified in the URL using the req.params property (it's an object). 
//
// These are typically "variable" parts of the url that will impact what
// response is returned. In this case, the thing after "/hubs" is considered to
// be an id, and we want to get it and search the database for it, returning
// what we find.
//
// This is similar to parameters in React routes.
//
// Making a call to DELETE /hubs (without an id) won't match this handler, so no
// delete will be tried. We don't have a handler for DELETE /hubs, and if you
// try, express() will respond with an error (basically saying "there is no
// handler for that METHOD and /url")
//
server.delete('/hubs/:id', (req, res) => {
    const { id } = req.params;
    console.log('yeah');

    db.remove(id)
        .then(deletedHub => {
            // Here, we check to see if the object returned by db.remove()
            // exists. If the client passes an invalid ID, then db.remove() will
            // fail, and will return "undefined". If the ID is valid, it will
            // succeed, and will return the object that was deleted.
            //
            // With REST API's, the HTTP response code is a way to convey to the
            // client whether the request succeeded or not, and together with
            // headers and a response body, can provide detailed context about
            // what happened.
            //
            // HTTP response codes are in different "categories" or "classes".
            // See "list of http response codes" in Wikipedia. 
            //
            // 2xx-class responses are "successful". 
            //
            // 4xx-class responses are "failed because of a problem with the
            // request - it's the client's fault." 
            //
            // 5xx-class responses mean "failed because of a problem on the
            // server - it's the server's fault."
            //
            // If the client passes in a bad/invalid ID, it's the client's
            // fault, and we should respond with a 4xx error (in this case, 404,
            // which means "document not found", or in the case of a REST API,
            // "resource not found").
            //
            // See https://restfulapi.net/http-status-codes/ for information on
            // how a well-designed REST API can use established HTTP response
            // codes to convey status of the request to the client.
            if (deletedHub) {
                res.status(204).end();
            } else {
                res.status(404).json({ message: 'id not found' });
            }
        })
        .catch(err => {
            // a 500 response means "permanent failure, don't bother trying to
            // change your request to make it succeed, the problem is on our
            // side and there is nothing you can do to change it..."
            //
            // This could happen if the database is inaccessible or if there is
            // an out of memory problem etc. "Permanent" doesn't mean "will
            // never be fixed"... rather, it means "the client can't make a
            // change and have the request succeed." It's not a problem with the
            // client.
            res.status(500).json({ success: false, err });
        });
});

//
// A handler for PUT '/hubs/:id'. This is for updating a record.
//
// This is like a combination of DELETE with an "id" parameter (to indicate
// which record to delet), and POST with data in the body. 
//
// In this handler, PUT is used to update an existing record. the "id" parameter
// identifies the record, and the body of the PUT request contains the new data
// we want to store in the database.
//
// Using PUT to mean "update" is arbitrary - we can make our Express server
// update a record in response to ANY HTTP method/route. PUT is the standard way
// of doing it, however, and is what developers using your API will expect.
//
// We are relying on the DB to reject the "update" request if the object in
// req.body doesn't have the right fields/data. It "rejects" the update request
// by returning "undefined". Otherwise, it returns the object that was
// modified/updated. 
//
server.put('/hubs/:id', (req, res) => {
    // like with DELETE, we have to get the ID from the URL parameter.
    const id = req.params.id;
    // like with POST, we have to get the body from the req object. This is
    // where the new data is passed by the client.
    const hubInfo = req.body;

    // db.update() takes the ID and the new data, and updates the record in the
    // DB. If the ID is invalid, it returns "undefined". Otherwise, it returns
    // the updated record.
    db.update(id, hubInfo)
        .then(hub => {
            if (hub) {
                res.status(200).json({ success: true, hub });
            } else {
                res.status(404).json({ success: false, message: 'id not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, err });
        });
});

//
// CHALLENGE: Create a GET method that accepts a specific ID for a record, and
// returns the record (if it exists), or returns an appropriate error response
// (if it doesn't exist).
//
// Check the hubs-model.js for an appropriate method to call to find a record
// using a specific ID. 
//
server.get('/hubs/:id', (req, res) => {
    db.findById(req.params.id)
        .then(hub => {
            if (hub) {
                res.status(200).json({ success: true, hub });
            } else {
                res.status(404).json({ success: false, message: 'id not found' });
            }
        })
        .catch(err => {
            // we ran into an error getting the hubs
            // use the catch-all 500 status code
            res.status(500).json({ success: false, err });
        });
});





