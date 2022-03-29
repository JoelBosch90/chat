# Chat
My first ever programming project was a WebSocket based web chat built with a
classic LAMP stack, just before I started studying Computer Science. Since then,
I've built up a habit of continually redoing this project. My earlier attempts
(that include vanilla JavaScript, PHP, VueJS, and NodeJS) were never properly
documented, but I decided to pick that up from here.

Now this has become my playground project to try out new technologies. In this
iteration: React and Phoenix!

## Demo
A demo for this website is hosted at
[chat.joelbosch.nl](https://chat.joelbosch.nl/).


## Microservices
The project is divided up into three different microservices:

Proxy
- Reverse proxy to serve requests to the right services and hide the internal
  network.

Client
- A Create React App style client that renders the UI and manages local state
  and the client-side of the WebSocket connections.

Api
- A super simple, small and lightweight backend that manages the WebSocket
  connections that are used to set up chatrooms and communicate messages within
  those chatrooms.

For more information about the microservices' configurations, check the
`.yml` files for more documentation. Those launch a small network of Docker
Compose services that allows you to easily run a local setup. You can find
instructions to install Docker and Docker Compose here:
- [Docker](https://docs.docker.com/get-docker/)           
- [Docker Compose](https://docs.docker.com/compose/install/)


## Docker Compose
All microservices are spawned with Docker Compose and managed in the
`docker-compose.yml` and `docker-compose.dev.yml` files for production and
development, respectively. To get you started, these are some of the basic
Docker Compose commands:


### Production environment
To run the environment (detached):

`docker-compose up -d --build`


To stop the environment:

`docker-compose down`

WARNING: this will also take down other Docker Compose networks you may 
be running!


Access at:

`http://localhost:8007`


### Development environment
To rebuild all images and run the environment:

`docker-compose -f docker-compose.dev.yml up --build`


This is best to run undetached so that you have access to debug information. You
can stop this environment with Ctrl+C in a standard Linux terminal. After the
`up` command, you'll be able to access the application at
`http://localhost:8007` by default and you can simply reload the page after
you've saved changes to view them. There is no need to rebuild the containers
until you restart them.


## Set up your local environment variables.
The server side of this service will require a few environment variables to be
set with local access credentials. You should set these settings in a `.env`
file in the main project directory (the one that has the docker-compose.yml
files). This file should be in your `.gitignore` because it should not end up in
the repository, because it contains exclusively local settings. The service
expects the following environment variables:

CLIENT_URL
 - Description:           The location where the client can be found.
 - Recommended default:   'localhost:8007/'

API_URL
 - Description:           The location where the API can be found.
 - Recommended default:   'localhost:8007/api/'
