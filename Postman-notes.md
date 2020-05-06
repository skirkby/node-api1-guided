## Notes on using Postman

Postman is an HTTP client that can be used to customize HTTP requests to HTTP
servers (such as API servers, or even just plain old web servers).

Postman is very handy for API developers, because it allows you to issue HTTP
requests to your API to test it. Browsers only send HTTP GET requests, so they
are not a great tool for testing POST, PUT, DELETE, and other methods. You
could, of course, create a web page with buttons and fields and JavaScript that
uses Axios to send customized HTTP requests, and make Axios send requests with
all of the different HTTP methods. But if you did that, you would end up with
something that looks very much like Postman... 

It's easier to just use Postman. :)

When you issue POST and PUT requests with Postman, you need to include a body
with the request. And for Express, the body needs to be in stringified json
format. 

The express.json() parser will take the stringified json body and convert it
into a real json object, and save it to req.body.

In Postman, to get a stringified json body, you need to:

1. select the "body" tab of the request,
2. set the body format to "raw". 
3. set the sub-format to "JSON"
4. be sure to put the parameter names AND values in double quotes... even for
   integers. 

This will put a stringified json object in the body, and the express.json()
parser will be able to convert it into a json object and save it to req.body
when the request is processed. 