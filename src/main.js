import { createRoutesRegistry, makeGet, getRouteHandler, matchRouteForUrl } from './Route/Route.js';
import { initDefaultMiddleware, initMiddlewareRegistry, makeUse, startMiddlewareChain } from './middleware/middleware.js';
import { createServer, startServer } from './Server/Server.js';
import { Request } from './Request/Request.js';

export const press = () => {
    const middlewareRegistry = initMiddlewareRegistry();
    const routesRegistry = createRoutesRegistry();

    initDefaultMiddleware(middlewareRegistry, routesRegistry);

    const instance = (request, response) => {
        const req = new Request(request);
        req.instance = instance;
    
        const { method, url } = req;
    
        startMiddlewareChain(middlewareRegistry, req, response); // TODO: Guarantee middlewares execution order, including route handlers
    
        const routeHandler = getRouteHandler(matchRouteForUrl(routesRegistry, method, url));
    
        if (routeHandler) {
            routeHandler.handle(req, response); // FIXME: Abstracton leak?
        }
    
        response.end();
    }

    instance.middlewareRegistry = middlewareRegistry;
    instance.routesRegistry = routesRegistry;
    instance.server = createServer(instance);
    instance.listen = (port) => startServer(instance.server, port);
    instance.get = makeGet(routesRegistry);
    instance.use = makeUse(middlewareRegistry, routesRegistry);
    
    return instance;
};
