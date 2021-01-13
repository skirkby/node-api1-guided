// import the server and start it
const server = require('./api/server.js');

const PORT = 5000;

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
server.listen(PORT, () => {
    console.log(`\n*** server listening on port ${PORT} ***\n`);
})