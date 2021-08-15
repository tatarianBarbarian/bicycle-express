import { getUrlParams } from "../Route/Route.js";

export const processUrl = () => (req, res, next) => {
    req.params = getUrlParams(req.instance.routesRegistry, req.method, req.url);
    next();
};
