import http from 'http';
import { Handler } from './Handler/Handler.js';
import { get, getRouteHandler, matchRouteForUrl, getUrlParams } from './Route/Route.js';
import { Request } from './Request/Request.js';

const processUrlMiddleware = new Handler((req, res, next) => {
    req.params = getUrlParams(req.method, req.url);
    next();
});
const middleware = processUrlMiddleware;

function listen(port) {
    const server = http.createServer((request, response) => {
        const req = new Request(request);

        response.writeHead(200, { 
            'Content-Type': 'text/plain',
            'Trailer': 'Content-MD5' 
        });        
        const { method, url } = req;

        middleware.handle(req, response);

        const routeHandler = getRouteHandler(matchRouteForUrl(method, url));

        if (routeHandler) {
            routeHandler.handle(req, response);
        }

        response.end();
    });

    server.listen(port);
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
