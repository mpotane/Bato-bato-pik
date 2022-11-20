const fs = require('fs');
// TODO: Require the http module
const http = require('http');

// TODO: Create a server
const server = http.createServer((request, response) => {

  const url = new URL(request.url, `http:${request.headers.host}`);

  switch(url.pathname) {
    case '/':
      if (request.method === 'GET') {
        const name = url.searchParams.get('name');
        console.log(name);

        response.writeHead(202, {'Content-Type': 'text/html'});
        fs.createReadStream('./index.html').pipe(response);
        break;
      } else if(request.method === 'POST') {
        handlePostResponse(request, response);
        break;
      }
      break;

    default:
      response.writeHead(404, {'Content-Type': 'text/html'});
      fs.createReadStream('./404.html').pipe(response);
      break;
  }
})

/* Listening for requests on port 4001. */
server.listen(4001, () => {
  console.log("Server is listening at " + server.address().port);
})

// Function for handling POST responses
function handlePostResponse(request, response){
  request.setEncoding('utf8');
  
  // Receive chunks on 'data' event and concatenate to body variable
  let body = '';
  request.on('data', function (chunk) {
    body += chunk;
  });
  
  // When done receiving data, select a random choice for server
  // Compare server choice with player's choice and send an appropriate message back
  request.on('end', function () {
    const choices = ['🪨', '📜', '✂️'];
    const randomChoice = choices[Math.floor(Math.random() * 3)];

    const choice = body;

    let message;

    const tied = `Tabla men! ${randomChoice} ako.`;
    const victory = `Panalo ka men! ${randomChoice} ako.`;
    const defeat = `Talo ka men!. ${randomChoice} ako.`;

    if (choice === randomChoice) {
      message = tied;
    } else if (
        (choice === '🪨' && randomChoice === '📜') ||
        (choice === '📜' && randomChoice === '✂️') ||
        (choice === '✂️' && randomChoice === '🪨')
    ) {
      message = defeat;
    } else {
      message = victory;
    }
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(`Gamit mo ${choice}. ${message}`);
  });
}