import { createRoutesRegistry, makeGet, getRouteHandler, matchRouteForUrl, runRouteHandlers } from './Route/Route.js';
import { initDefaultMiddleware, initMiddlewareRegistry, makeUse, startMiddlewareChain } from './middleware/middleware.js';
import { createServer, startServer } from './Server/Server.js';
import { Request } from './Request/Request.js';

export const press = () => {
    const middlewareRegistry = initMiddlewareRegistry();
    const routesRegistry = createRoutesRegistry();

    initDefaultMiddleware(middlewareRegistry, routesRegistry);

    const instance = (request, response) => {
        const req = request instanceof Request ? request : new Request(request);
        req.instance = instance;
    
        if (instance.mountpath !== '/') {
            req.url = req.url.replace(instance.mountpath, '');
            req.url = req.url.length ?  req.url : '/';
        }
        
        const { method, url } = req;

        startMiddlewareChain(middlewareRegistry, req, response); // TODO: Guarantee middlewares execution order, including route handlers
    
        const matchingRoutes = matchRouteForUrl(routesRegistry, method, url);
        runRouteHandlers(matchingRoutes, req, response);
    
        response.end();
    }

    instance.mountpath = '/';
    instance.isInstance = true;
    instance.middlewareRegistry = middlewareRegistry;
    instance.routesRegistry = routesRegistry;
    instance.server = createServer(instance);
    instance.listen = (port) => startServer(instance.server, port);
    instance.get = makeGet(routesRegistry);
    instance.use = makeUse(middlewareRegistry, routesRegistry);
    
    return instance;
};
