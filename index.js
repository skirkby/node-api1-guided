// bring express into the project
const express = require("express");
// shortid is a package that generates unique, random, url-friendly id's
const shortid = require("shortid");

// create a "server" object
const server = express();

// this is our "data store" (replaces the DB from the original project)
// In practice, you wouldn't do this ... this is just to make the project
// simpler, so you can focus on express and router handlers, and not database
// stuff that you haven't learned yet.
let hubs = [];

server.listen(4000, () => {
    console.log('*** Server listening on port 4000 ***');
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
server.get("/", (req, res) => {
    res.send('hello world!');
});

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
server.get("/hubs", (req, res) => {
    res.status(200).json(hubs);
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
server.post("/hubs", (req, res) => {
    const hubInfo = req.body;

    hubInfo.id = shortid.generate();

    hubs.push(hubInfo);

    res.status(201).json(hubInfo);
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
server.delete("/hubs/:id", (req, res) => {
    const { id } = req.params;

    const deleted = hubs.find(hub => hub.id === id);

    // Here, we check to see if the object returned by hubs.find() exists. If
    // the client passes an invalid ID, then dhubs.find() will fail, and will
    // return "undefined". If the ID is valid, it will succeed, and will return
    // the object that was deleted.
    //
    // With REST API's, the HTTP response code is a way to convey to the client
    // whether the request succeeded or not, and together with headers and a
    // response body, can provide detailed context about what happened.
    //
    // HTTP response codes are in different "categories" or "classes". See "list
    // of http response codes" in Wikipedia. 
    //
    // 2xx-class responses are "successful". 
    //
    // 4xx-class responses are "failed because of a problem with the request -
    // it's the client's fault." 
    //
    // 5xx-class responses mean "failed because of a problem on the server -
    // it's the server's fault."
    //
    // If the client passes in a bad/invalid ID, it's the client's fault, and we
    // should respond with a 4xx error (in this case, 404, which means "document
    // not found", or in the case of a REST API, "resource not found").
    //
    // See https://restfulapi.net/http-status-codes/ for information on how a
    // well-designed REST API can use established HTTP response codes to convey
    // status of the request to the client.

    if (deleted) {
        hubs = hubs.filter(hub => hub.id !== id);

        res.status(200).json(deleted);
    } else {
        res
            .status(404)
            .json({ success: false, message: "hub id not found" });
    }
});


//
// A handler for PUT '/hubs/:id'. This is for replacing a record.
//
// This is like a combination of DELETE with an "id" parameter (to indicate
// which record to delet), and POST with data in the body. 
//
// In this handler, PUT is used to replace an existing record. The "id"
// parameter identifies the record, and the body of the PUT request contains the
// new data we want to store in the array.
//
// Using PUT to mean "update" is arbitrary - we can make our Express server
// update a record in response to ANY HTTP method/route. PUT is the standard way
// of doing it, however, and is what developers using your API will expect.
// 
// Note that the difference between PUT and PATCH is that PUT completely
// replaces the element in the array, while PATCH only modifies the properties
// that are provided. 
// 
// There is nothing magic about this ... it's a decision made for our API. Other
// API's may choose to allow PUT to both replace AND update a record or element.
// In fact, many API's do. In this example, we are supporting two separate
// METHODS, each with different meanings. This is entirely up to the API
// designer. (You could make a PUT request return a photo of a frog if you
// wanted. There are no rules, only guidelines and practices. :) )
//
server.put("/hubs/:id", (req, res) => {
    // like with DELETE, we have to get the ID from the URL parameter.
    const { id } = req.params;
    // like with POST, we have to get the body from the req object. This is
    // where the new data is passed by the client.    
    const changes = req.body;

    // hubs.findIndex iterates over the array, and looks for one with an id that
    // matches the id passed in by the API caller. If found, index will equal
    // the index of the matching element. If not found, index will be -1.
    let index = hubs.findIndex(hub => hub.id === id);

    if (index !== -1) {
        // if index has a real value, replace the element in the array with the
        // changes parsed from the request body, and return it with a success
        // code. 
        hubs[index] = changes;
        res.status(200).json(hubs[index]);
    } else {
        // if index is -1, return a "not found" code (the id wasn't found in the
        // array).
        res
            .status(404)
            .json({ success: false, message: "hub id not found" });
    }
});

// 
// The PATCH version iterates over the array to find the object using
// hubs.find() (rathr than hubs.findIndex(), as PUT does.) This is only because
// of the logic we are using here to modify the object. Once we find the actual
// object, we can use Object.assign() to update it with the data from the body.
// Only properties in the array element that have the same key as properties in
// the request body are updated. Properties in the request body that do not
// exist in the array element are ignored. And properties in the array element
// that do not exist in the request body are left alone. 
// 
// See
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
// 
// 
server.patch("/hubs/:id", (req, res) => {
    // like with DELETE, we have to get the ID from the URL parameter.
    const { id } = req.params;
    // like with POST, we have to get the body from the req object. This is
    // where the new data is passed by the client.        
    const changes = req.body;

    // hubs.find() iterates over the array, and looks for one with an id that
    // matches the id passed in by the API caller. If found, "found" will point
    // to the element. If not found, "found" will be unassigned.
    let found = hubs.find(hub => hub.id === id);

    // if "found" has a value, it was found in the array, and we use
    // Object.assign() to update it from the req.body object (as noted above).
    // And a 200 success error is returned (with the new object.)
    if (found) {
        Object.assign(found, changes);
        res.status(200).json(found);
        // if "found" doesn't have a value, it was not found in the array, and we
        // need to return a 404 not found result.
    } else {
        res
            .status(404)
            .json({ success: false, message: "hub id not found" });
    }
});

//
// a GET method that gets a specific object by its ID (rather than returning all
// objects.) 
//
server.get("/hubs/:id", (req, res) => {
    const found = hubs.find(hub => hub.id === id);

    if (found) {
        res.status(200).json(found);
    } else {
        res
            .status(404)
            .json({ success: false, message: "hub id not found" });
    }
});







