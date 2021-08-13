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
    handlers.reduce((acc, cur) => {
        if (!acc) {
            routes.GET[url] = makeHandler(cur);
            
            return routes.GET[url];
        }
        else {
            acc.setNext(makeHandler(cur));
            
            return acc.nextHandler;
        }
    }, routes.GET[url]);
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
    (req, res, next) => {
        res.write('\nHi, im second handler!');
        next();
    },
    (req, res) => {
        res.write('\nHi, im third handler!');
    }
);

app.listen(3000);


