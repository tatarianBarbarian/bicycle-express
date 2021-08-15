import { get } from './Route/Route.js';
import { use } from './middleware/middleware.js';
import { createServer, startServer } from './Server/Server.js';


export const press = () => {
    const app = (req, res, next) => {
        next();
    }
    
    app.server = createServer();
    app.listen = (port) => startServer(app.server, port);
    app.get = get;
    app.use = use;
    
    return app;
};
