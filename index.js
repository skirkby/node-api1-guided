const express = require('express'); 
// require the express npm module, needs to be added to the project using "npm install express"
// import the express package

const db = require('./data/hubs-model.js')

// creates an express application using the express module
const server = express(); // creates the server

// watch for connections on port 4000
server.listen(4000, () => {
    // once the server is fully configured we can have it "listen" for connections on a particular "port"
// the callback function passed as the second argument will run once when the server starts
    console.log('listening on port 4000...');
});
//To start the server type 'yarn server' in the terminal
//To stop the server type ctrl + c at the terminal window.

// express.json() is a parser function... if json *text* is in the body, this
// method will parse it into an actual object, so that when we access req.body,
// it will be an actual object.
//
server.use(express.json())

//HTTP method
// URI :scheme://host_name:port/path?parameter_list 


// configures our server to execute a function for every GET request to "/"
// the second argument passed to the .get() method is the "Route Handler Function"
// the route handler function will run on every GET request to "/"
server.get('/', (request, response) => {// request = req, response = res ----'THE HOMIES'---
// express will pass the request and response objects to this function
  // the .send() on the response object can be used to send a response to the client
response.send('Hello world!')
console.log('Here I am!')
})
server.get('/hey', (req, res) => {
     // route handler code here
    res.send('hello, there');
});
server.get('/favicon.ico', (req, res) => {
    res.status(204);
});

//R-Read CRUD
server.get('/hubs', (req, res) => {
    db.find()
        .then(hubs =>{
            res.status(200).json({hubs})   
        })
        .catch(err => {
            res.status(500).json({success:false, err});
        });
});

//C-Create CRUD
server.post('/hubs', (req, res) => {
const hubInfo = req.body;
    db.add(hubInfo)
        .then(hub => {
            res.status(201).json({success: true, hub})
        })
        .catch(err => {
            res.status(500).json({success: false, err})
        })
});


//D -Delete CRUD
server.delete('/hubs/:id', (req, res) => {
//const id = req.params.id;
const {id} = req.params
    db.remove(id)
        .then( deleted => {
            if(deleted)
                res.status(204).end()
        })
        .catch(err => {
            res.status(404).json({success: false, message:'id not found'})
        });
});

// U- Update
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

 server.put('/hubs/:id', (req, res) => {
    // like with DELETE, we have to get the ID from the URL parameter.
    const id = req.params.id;
    // like with POST, we have to get the body from the req object. This is
    // where the new data is passed by the client.
    const changes =req.body;

    // db.update() takes the ID and the new data, and updates the record in the
    // DB. If the ID is invalid, it returns "undefined". Otherwise, it returns
    // the updated record.
    db.update(id, changes)
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

// GET by ID
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

//  server.patch('/hubs/:id', (req, res) => {

//  });