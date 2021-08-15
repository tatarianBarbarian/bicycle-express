import http from 'http';
import { Request } from './Request/Request.js';
import { get, getRouteHandler, matchRouteForUrl } from './Route/Route.js';
import { use, startMiddleware } from './middleware/middleware.js';

export const press = () => {
    const server = http.createServer((request, response) => {
        const req = new Request(request);
 
        const { method, url } = req;

        startMiddleware(req, response); // TODO: Guarantee middlewares execution order, including route handlers

        const routeHandler = getRouteHandler(matchRouteForUrl(method, url));

        if (routeHandler) {
            routeHandler.handle(req, response); // FIXME: Abstracton leak?
        }

        response.end();
    });

    return {
        server,
        listen: (port) => server.listen(port),
        get,
        use
    };
};
