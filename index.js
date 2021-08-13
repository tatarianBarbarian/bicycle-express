import http from 'http';

const routes = {
    GET: {},
};

class Request {
    constructor(req) {
        this.req = req;
    }
}

class Handler {
    constructor(handler) {
        this.handler = handler;
        this.nextHandler = null;
    }

    setNext(handler) {
        this.nextHandler = handler;
    }

    handle(req, res) {
        function next(name) {
            if (this.nextHandler) {
                this.nextHandler.handle(req, res);
            }
            else {
                return null;
            }
        }
        
        this.handler(req, res, next.bind(this));
    }
}

const makeHandler = (handler) => new Handler(handler);

function listen(port) {
    const server = http.createServer((request, response) => {
        response.writeHead(200, { 'Content-Type': 'text/plain',
                              'Trailer': 'Content-MD5' });        
        const {method, url} = request;
        const routeHandler = routes[method][url];

        if (routeHandler) {
            routeHandler.handle(request, response);
        }

        response.end();
    });

    server.listen(port);
}

function get(url, ...handlers) {
    let firstHandler = routes.GET[url];
    
    handlers.forEach((handler) => {        
        if (!firstHandler) {
            firstHandler = makeHandler(handler);
            routes.GET[url] = firstHandler;
        }
        else {
            routes.GET[url].setNext(makeHandler(handler));
            routes.GET[url] = routes.GET[url].nextHandler;
        }
    });

    routes.GET[url] = firstHandler;
}

const press = () => ({
    listen,
    get
});

const app = press();

app.get(
    '/123', 
    (req, res, next) => {
        res.write('Hello from /123 get route!');
        next('first');
    },
    (req, res) => {
        res.write('\nHi, im second handler!');
    }
);

app.listen(3000);


