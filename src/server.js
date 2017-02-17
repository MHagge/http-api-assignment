const http = require('http');

const url = require('url');

const query = require('querystring');

const responseHandler = require('./responses.js');

const PORT = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  '/': responseHandler.getIndex,
  '/style.css': responseHandler.getStyle,
  '/success': responseHandler.whenSuccess,
  '/badRequest': responseHandler.whenBadRequest,
  '/unauthorized': responseHandler.whenUnauthorized,
  '/forbidden': responseHandler.whenForbidden,
  '/internal': responseHandler.whenInternal,
  '/notImplemented': responseHandler.whenNotImplemented,
  notFound: responseHandler.whenNotFound,
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);
  // tells you what the browser want to get - json or xml or etc
  const acceptedTypes = request.headers.accept.split(',');
  console.log(parsedUrl.pathname);
  if (urlStruct[parsedUrl.pathname]) {
    urlStruct[parsedUrl.pathname](request, response, acceptedTypes[0], params);
  } else {
    urlStruct.notFound(request, response, acceptedTypes[0], params);
  }
};

http.createServer(onRequest).listen(PORT);
console.log(`Listening on 127.0.0.1: ${PORT}`);
