import http from 'http';
import { Handler } from './Handler/Handler.js';
import { get, getRouteHandler, matchRouteForUrl } from './Route/Route.js';

// TODO: Препроцессинг req.url, чтобы убрать квери и сложить их в обжект

const middleware = new Handler((req, res, next) => { next() });

function listen(port) {
    const server = http.createServer((request, response) => {
        response.writeHead(200, { 
            'Content-Type': 'text/plain',
            'Trailer': 'Content-MD5' 
        });        
        const { method, url } = request;
        const routeHandler = getRouteHandler(matchRouteForUrl(method, url));

        middleware.handle(request, response);

        if (routeHandler) {
            routeHandler.handle(request, response);
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
