// import the data model so we can interact with data
const Dog = require('./dog-model.js');
// bring express into the project
const express = require('express');

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
// GET /hello handler
// 
// This handles GET reqeusts for the root path ('/hello')
//----------------------------------------------------------------------------//
server.get('/hello', (req, res) => {
    res.send("hello lambda!");
});

//----------------------------------------------------------------------------//
// POST /api/dogs
//
// Crud - CREATE
//
// This handler is for POST requests to the /api/dogs collection. 
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
server.post('/api/dogs', async (req, res) => {
    const dog = req.body;

    // check to ensure the body is valid...
    if (!dog.name || !dog.weight) {
        // if it's not valid, respond with an error code. Error codes are in the
        // 4xx range. (Technically, 5xx range are also error codes, but they are
        // errors on the server side - things the API user can't do anything
        // about, like a corrupt database or network problem or server out of
        // memory, etc.)
        res.status(400).json({ message: "must include name and weight" });
    } else {
        try {
            const newlyCreatedDog = await Dog.create(dog);
            // return a 201 status code, along with the new object that we created. 
            // it's typical to return the object created, so the caller can verify that
            // the right object was created. But this is totally optional, and up to you
            // - you are the maker of your own API. Just remember that decisions you
            //   make will impact how easy (or now) your API is to use (and
            //   troubleshoot, etc.)
            res.status(200).json(newlyCreatedDog);
        } catch (err) {
            // not sure why we ended up here, but better send back a 500...
            res.status(500).json({ error: err.message });
        }
    }
});

//----------------------------------------------------------------------------//
// GET /api/dogs
// 
// cRud - READ
// 
// This handler is for GET requests to the /api/dogs collection.
// 
//
// A handler for GET '/api/dogs' that returns a list of all hubs in the database.
//----------------------------------------------------------------------------//
server.get('/api/dogs', async (req, res) => {
    // the call to .status(200) is redundant, but it is often a good practice to
    // explicitly set even default values, so it is clear to others who may read
    // your code that you really MEANT for a 200 to be returned.
    // 
    // Here, we just return the entire array. The .json() method will convert it
    // into a JSON object before adding it to the response body.
    try {
        const dogs = await Dog.findAll();
        res.status(200).json(dogs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//----------------------------------------------------------------------------//
// DELETE /api/dogs/:id
//
// cruD - DELETE
//
// This handler works for DELETE '/api/dogs/:id'.
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
// Making a call to DELETE /api/dogs (without an id) won't match this handler, so no
// delete will be tried. We don't have a handler for DELETE /api/dogs, and if you
// try, express() will respond with an error (basically saying "there is no
// handler for that METHOD and /url")
//----------------------------------------------------------------------------//
server.delete('/api/dogs/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Dog.update() returns a Promise that resolves to null if the
        // id does not exist in the array... otherwise, it returns the 
        // array element that was found.
        const dog = await Dog.delete(id);
        if (dog) {
            res.status(200).json(dog);
        } else {
            res.status(404).json({ message: "unknown id" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message }); ß
    }
});

//----------------------------------------------------------------------------//
// PUT /api/dogs/:id
// 
// crUd - UPDATE
//
// Often, PATCH isn't supported in an API, and PUT always means "modify an
// existing object." In our case, we chose to support PATCH *and* PUT. We chose
// to have PUT mean "completely replace the object in the array with the object
// in the PUT request."
//----------------------------------------------------------------------------//
server.put('/api/dogs/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    // validate the body
    if (!changes.name || !changes.weight) {
        res.status(400).json({ message: "must include name and weight" });
    } else {

        try {
            // Dog.update() returns a Promise that resolves to null if the
            // id does not exist in the array... otherwise, it returns the 
            // array element that was found.
            const updatedDog = await Dog.update(id, changes);
            if (updatedDog) {
                res.status(200).json(updatedDog);
            } else {
                res.status(404).json({ message: "unknown id" });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
});

//----------------------------------------------------------------------------//
// PATCH /api/dogs/:id
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
// This will add all properties in "changes" to the "found" object (if it is in
// the array), if they don't already exist in the "found" object. It will also
// overwrite properties in "found" if they exist in "changes".
//----------------------------------------------------------------------------//
server.patch('/api/dogs/:id', async (req, res) => {
    const { id } = req.params;
    const changes = req.body;

    try {
        let changed = await Dog.modify(id, changes);
        if (changed) {
            res.status(200).json(changed);
        } else {
            res.status(404).json({ message: "unknown id" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})

module.exports = server;