import { get, getRouteHandler, matchRouteForUrl } from './Route/Route.js';
import { initDefaultMiddleware, initMiddlewareRegistry, makeUse, startMiddlewareChain } from './middleware/middleware.js';
import { createServer, startServer } from './Server/Server.js';
import { Request } from './Request/Request.js';


export const press = () => {
    const middlewareRegistry = initMiddlewareRegistry();
    initDefaultMiddleware(middlewareRegistry);

    const app = (request, response) => {
        const req = new Request(request);
    
        const { method, url } = req;
    
        startMiddlewareChain(middlewareRegistry, req, response); // TODO: Guarantee middlewares execution order, including route handlers
    
        const routeHandler = getRouteHandler(matchRouteForUrl(method, url));
    
        if (routeHandler) {
            routeHandler.handle(req, response); // FIXME: Abstracton leak?
        }
    
        response.end();
    }
    
    app.server = createServer(app);
    app.listen = (port) => startServer(app.server, port);
    app.get = get;
    app.use = makeUse(middlewareRegistry);
    
    return app;
};
