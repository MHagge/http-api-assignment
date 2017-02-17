const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);

const style = fs.readFileSync(`${__dirname}/../client/style.css`);

const writeResponse = (request, response, status, object, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(object);
  response.end();
};

// function to send a json object
const respond = (request, response, status, object, acceptedTypes) => {
  if (acceptedTypes === 'text/xml') {
    // create a valid XML string with name and age tags.
    let responseXML = '<response>';
    responseXML = `${responseXML} <id>${object.id}</id>`;
    responseXML = `${responseXML} <message>${object.message}</message>`;
    responseXML = `${responseXML} </response>`;

    writeResponse(request, response, status, responseXML, 'text/xml');
  } else { // json
    writeResponse(request, response, status, JSON.stringify(object), 'application/json');
  }
};


const getIndex = (request, response) => {
  writeResponse(request, response, 200, index, 'text/html');
};

const getStyle = (request, response) => {
  writeResponse(request, response, 200, style, 'text/css');
};

const whenSuccess = (request, response, acceptedTypes) => {
  // message to send
  const responseJSON = {
    id: 'Success',
    message: 'This is a successful response',
  };

  // send our json with a success status code
  respond(request, response, 200, responseJSON, acceptedTypes);
};

const whenBadRequest = (request, response, acceptedTypes, params) => {
  // message to send
  const responseJSON = {
    id: 'Bad Request -- valid',
    message: 'This request has the required parameters',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseJSON.message = 'Missing valid query parameter set to true';
    // give the error a consistent id
    responseJSON.id = 'badRequest';
    // return our json with a 400 bad request code
    return respond(request, response, 400, responseJSON, acceptedTypes);
  }

  // if the parameter is here, send json with a success status code
  return respond(request, response, 200, responseJSON, acceptedTypes);
};

const whenUnauthorized = (request, response, acceptedTypes, params) => {
  // message to send
  let responseJSON = {
    id: 'Unauthorized -- valid',
    message: 'This request has the required parameters',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    // message to send
    responseJSON = {
      id: 'Unauthorized',
      message: 'You are not authorized to be here',
    };
    return respond(request, response, 401, responseJSON, acceptedTypes);
  }
  // if the parameter is here, send json with a success status code
  return respond(request, response, 200, responseJSON, acceptedTypes);
};

const whenForbidden = (request, response, acceptedTypes) => {
  // message to send
  const responseJSON = {
    id: 'Forbidden',
    message: '403: Forbidden',
  };
  respond(request, response, 403, responseJSON, acceptedTypes);
};

const whenInternal = (request, response, acceptedTypes) => {
  // message to send
  const responseJSON = {
    id: 'Internal:',
    message: '500: Internal Server Error',
  };
  respond(request, response, 500, responseJSON, acceptedTypes);
};

const whenNotImplemented = (request, response, acceptedTypes) => {
  // message to send
  const responseJSON = {
    id: 'Not Implemented',
    message: '501: Not Implemented',
  };
  respond(request, response, 501, responseJSON, acceptedTypes);
};

const whenNotFound = (request, response, acceptedTypes) => {
  // error message with a description and consistent error id
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'Not Found',
  };
  respond(request, response, 200, responseJSON, acceptedTypes);
};

module.exports = {
  writeResponse,
  getIndex,
  getStyle,
  whenSuccess,
  whenBadRequest,
  whenUnauthorized,
  whenForbidden,
  whenInternal,
  whenNotImplemented,
  whenNotFound,
};
