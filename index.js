// import the server and start it
const server = require('./api/server.js');

const PORT = 3000;

server.listen(PORT, () => {
    console.log(`\n *** listening on port ${PORT} *** \n`)
});
