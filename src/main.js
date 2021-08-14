import http from 'http';
import { get, getRouteHandler, matchRouteForUrl } from './Route/Route.js';
import { Request } from './Request/Request.js';
import { use, startMiddleware } from './middleware/middleware.js';
import { processUrl } from './middleware/library.js';

use(processUrl());

function listen(port) {
    const server = http.createServer((request, response) => {
        const req = new Request(request);
 
        const { method, url } = req;

        startMiddleware(req, response);

        const routeHandler = getRouteHandler(matchRouteForUrl(method, url));

        if (routeHandler) {
            routeHandler.handle(req, response);
        }

        response.end();
    });

    server.listen(port);
}

export const press = () => ({
    listen,
    get,
    use
});
