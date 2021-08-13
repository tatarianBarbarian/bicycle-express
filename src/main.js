import http from 'http';
import { Handler } from './Handler.js';

const routes = {
    GET: {},
};

const middleware = new Handler((req, res, next) => { next() });

function listen(port) {
    const server = http.createServer((request, response) => {
        response.writeHead(200, { 
            'Content-Type': 'text/plain',
            'Trailer': 'Content-MD5' 
        });        
        const {method, url} = request;
        const routeHandler = routes[method][url];

        middleware.handle(request, response);

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
            routes.GET[url] = new Handler(cur);
            
            return routes.GET[url];
        }
        else {
            acc.setNext(new Handler(cur));
            
            return acc.nextHandler;
        }
    }, routes.GET[url]);
}

function use(first, second) {
    switch (typeof first) {
        case 'function':
            middleware.setNext(new Handler(first));
            break;
        case 'string':
            get(first, second);
            break;
    }
};

export const press = () => ({
    listen,
    get,
    use
});
