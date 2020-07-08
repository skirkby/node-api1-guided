// bring express into the project
const express = require('express');
// a simple module to create id's for our array data objects
const shortid = require('shortid');

//
// express() returns an instance of an express server. Using this instance, we
// can add middleware methods for specific HTTP VERB / path combinations (eg GET
// / or POST /api/hubs, etc.) We can also start the server, so it listens for
// requests that come to this host and to a specific port. (See at the bottom of
// the file.)
const server = express();

//
// express.json() is a parser function... if json *text* is in the request body,
// this method will parse it into an actual object, and save it on the req
// object as req.body, so that when we access req.body, it will be an actual
// object.
// 
// The handlers we create below are called "middleware functions". When we
// register them with an HTTP VERB / path combination, Express adds them to a
// middleware function chain. When requests come in, they are matched with the
// first middleware function that was registered that matches the VERB/path
// combination. 
// 
// Each middleware function can modify the request and/or response objects, and
// can choose to either end processing of the request by sending the response
// back to the client, or it can pass the request on to the next middleware
// function in the chain. 
// 
// We register a handler to a specific HTTP verb by calling the corresponding
// function on the Express server object. So, server.get() is used to register
// middleware for certain GET requests. And server.post() is used to register
// middleware for certain POST requests. 
// 
// server.use() is used when we want a middleware function to apply to ALL HTTP
// requests, no matter what verb is used. 
// 
// In addition, when we register middleware to an HTTP verb, we specify what
// path must be requested in order for the middleware to match. If you omit the
// path, then the middleware matches all paths. 
// 
// So, server.use() with no path will match ALL verbs and ALL paths. 
// 
// (Note: you could do server.use('/thispath', middleware), which would match
// ALL verbs, but only requests to the path /thispath.)
//
// You can create custom middleware in-line using an arrow function, or you can
// use an existing middleware function name or reference. Middleware functions
// are just functions that 1) accept the req and res parameters, and 2) either
// end processing by returning a response, or pass the request on to the next
// middleware function in the chain. We will learn more about middleware in a
// future lecture.
// 
// express.json() returns a middleware function that we can pass to any
// registration method (such as .get(), .post(), or .use()). It searches the
// request body for a JSON string, and converts it into an object, and saves
// that object on the req object as req.body. Without calling this middleware
// function, we would have to access the raw text in the request ourselves,
// verify that it is valid JSON, and convert it into an object to use.
// express.json() takes care of that for us, and by registering it as middleware
// for ALL verbs and ALL paths, it converts the JSON body for all requests. 
// 
// Because it's the first one to be registered, this middleware is executed
// first for all requests.
//
server.use(express.json());

// 
// These are our data stores. We aren't using a database (just to keep things
// simple for now), so we create these arrays  to use as data stores.
// 
// In this API, we have a collection of messaging "hubs", and a collection of
// messages for specific "lessons" or classes.
let hubs = [];
let lessons = [];

//----------------------------------------------------------------------------//
// GET / handler
// 
// This handles GET reqeusts for the root path ('/')
//----------------------------------------------------------------------------//
server.get('/', (req, res) => {
    // the .json() method on the res object responds to the request by sending a
    // JSON object. Just FYI, this method not only sends the response back, but
    // it ensures that the resposne body is a stringified JSON object, and it
    // sets the Content-Type header to application/json.
    // 
    // Note that some responses below call .status() to explicitly set the
    // response status code to a specific value. If you don't call .status() to
    // set the code, it will default to 200 (which is a success code).
    res.json({ message: "hello world!" });
});

//----------------------------------------------------------------------------//
// POST /api/hubs
//
// Crud - CREATE
//
// This handler is for POST requests to the /api/hubs collection. 
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
// In order for this "stringified" JSON object to be converted into an actual
// JSON object, it has to be processed by middleware. Above, we added such a
// middleware (aka a "handler") to the "chain" of handlers using the
// "server.use()" method. We will learn about "middleware" in a later class...
// basically, server.use() takes a function and adds it as a "handler" to a
// chain of handlers (aka "middleware") for a specific VERB/path combination.
//
// The middleware function express.json() is added to the chain with the
// server.use() call, and is applied to every request. This is a parser that
// checks to see if the body type is supposed to be "json" (looking for a
// content-type header in the HTTP response), and then converts the text of the
// body into an actual JSON object that can be accessed using req.body.
//----------------------------------------------------------------------------//
server.post('/api/hubs', (req, res) => {
    const hubInfo = req.body;

    // use shortid to create a unique id to save with the hub info
    hubInfo.id = shortid.generate();
    // add the hubInfo object to the array
    hubs.push(hubInfo);

    // return a 201 status code, along with the new object that we created. 
    // it's typical to return the object created, so the caller can verify that
    // the right object was created. But this is totally optional, and up to you
    // - you are the maker of your own API. Just remember that decisions you
    //   make will impact how easy (or now) your API is to use (and
    //   troubleshoot, etc.)
    res.status(201).json(hubInfo);
})

//----------------------------------------------------------------------------//
// GET /api/hubs
// 
// cRud - READ
// 
// This handler is for GET requests to the /api/hubs collection.
// 
//
// A handler for GET '/hubs' that returns a list of all hubs in the database.
//----------------------------------------------------------------------------//
server.get('/api/hubs', (req, res) => {
    // the call to .status(200) is redundant, but it is often a good practice to
    // explicitly set even default values, so it is clear to others who may read
    // your code that you really MEANT for a 200 to be returned.
    // 
    // Here, we just return the entire array. The .json() method will convert it
    // into a JSON object before adding it to the response body.
    res.status(200).json(hubs);
})

//----------------------------------------------------------------------------//
// DELETE /api/hubs/:id
//
// cruD - DELETE
//
// This handler works for DELETE '/hubs/:id'.
//
// Notice the "parameter" in the url... preceding a URL "part" name with a colon
// designates it as a "parameter". You can access all parameters that are
// identified in the URL using the req.params property (it's an object). 
//
// These are typically "variable" parts of the url that will impact what
// response is we choose to return. In this case, the thing after "/hubs" is
// considered to be an id, and we want to get it and search the array for it,
// returning what we find.
//
// This is similar to parameters in React routes.
//
// Making a call to DELETE /hubs (without an id) won't match this handler, so no
// delete will be tried. We don't have a handler for DELETE /hubs, and if you
// try, express() will respond with an error (basically saying "there is no
// handler for that METHOD and /url")
//----------------------------------------------------------------------------//
server.delete('/api/hubs/:id', (req, res) => {
    const { id } = req.params;

    // use the Array.find() method to try to find the object with an .id
    // property value that matches the id that was passed in the URI.
    const found = hubs.find(hub => hub.id === id);

    // if it's found...
    if (found) {
        // filter it out of the array, and save the resulting array back to
        // itself (without the "deleted" item.)
        // ?? - is there another way to do this? How would you do it?
        hubs = hubs.filter(hub => hub.id !== id);
        // return a 200, and the item that was deleted.
        res.status(200).json(found);
    } else {
        // if the item was not found in the .find() call, return a 404,
        // indicating that the URI was not found.
        res.status(404).json({ message: "hub not found" });
    }

});

//----------------------------------------------------------------------------//
// PATCH /api/hubs/:id
//
// crUd - UPDATE (with PATCH)
//
// It's entirely up to us, as the designers of our own API, what HTTP verbs we
// will support. In addition, it's entirely up to us what making a call with a
// specific HTTP verb *means*. 
//
// Typically, the PATCH verb is ued to "modify" a record. In our case, we chose
// to make it mean that we will do an Object.assign() on the object with
// matching id, using the data passed in the body. 
//
// Read up on Object.assign() here:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
//
// This will add all properties in "changes" to the "found" object (if it is in
// the array), if they don't already exist in the "found" object. It will also
// overwrite properties in "found" if they exist in "changes".
//----------------------------------------------------------------------------//
server.patch('/api/hubs/:id', (req, res) => {
    // get the id from req.params, and get the "patch" body from req.body.
    const { id } = req.params;
    const changes = req.body;

    // look to see if it's in the array.
    let found = hubs.find(hub => hub.id === id);

    if (found) {
        // if it is in the array, do an Object.assign() from the changes in the
        // message body, and return a 200 with the changed object. Note that the
        // find operation above returns a "reference" to the object, not the
        // value of the object. "found" will then point to the actual object
        // that is in the array, and changing that object (using Object.assign()
        // will change it in the array.)
        Object.assign(found, changes);
        res.status(200).json(found);
    } else {
        res.status(404).json({ message: "hub not found" });
    }
})

//----------------------------------------------------------------------------//
// PUT /api/hubs/:id
// 
// crUd - UPDATE
//
// Often, PATCH isn't supported in an API, and PUT always means "modify an
// existing object." In our case, we chose to support PATCH *and* PUT. We chose
// to have PUT mean "completely replace the object in the array with the object
// in the PUT request."
//----------------------------------------------------------------------------//
server.put('/api/hubs/:id', (req, res) => {
    // get the id from req.params, and get the new object from req.body.
    const { id } = req.params;
    const changes = req.body;

    // Instead of getting a refrence to the matching object, we want to get the
    // index in the array of the matching object. This is because we intend to
    // completely replace the object in the array (unlike with PATCH, which
    // would improve the object by adding anything in the body that was not in
    // the body.)
    let index = hubs.findIndex(hub => hub.id === id);

    // If it was found, index is the index into the array, where we will put the
    // new object in "changes". The changes object is written to that spot in
    // the array wholesale, without any vetting etc., and it completely
    // overwrites the schema and content of the object at that index.
    if (index !== -1) {
        changes.id = id;
        hubs[index] = changes;
        res.status(200).json(hubs[index]);
    } else {
        res.status(404).json({ message: "hub not found" });
    }
})


//----------------------------------------------------------------------------//
// Start the server listening. It needs a port number, and it will begin
// listening to the operating system for incoming requests to the app. 
// 
// ? - what port do HTTP servers normally listen on? (Look it up!)
// 
// Here aer some references about TCP ports and how they work:
// Wikipedia : https://en.wikipedia.org/wiki/Internet_protocol_suite
// iana.org : https://www.iana.org/assignments/service-names-port-numbers/service-names-port-numbers.xhtml
// Wikipedia: https://en.wikipedia.org/wiki/List_of_TCP_and_UDP_port_numbers
// Wikipedia : https://en.wikipedia.org/wiki/Ephemeral_port
//----------------------------------------------------------------------------//
const PORT = 5000;

server.listen(PORT, () => {
    console.log(`listening on http://localhost:${PORT}`);
});