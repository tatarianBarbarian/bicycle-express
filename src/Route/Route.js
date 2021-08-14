import { Handler } from '../Handler/Handler.js';
import micromatch from 'micromatch';

const routes = {
    GET: {},
};

export const getRoute = (method, path) => routes[method][path];
export const getRouteType = (route) => route.type;
export const getRouteHandler = (route) => route.handler;
export const getRoutePath = (route) => route.path;
export const findRouteType = (rule) => {
    const isParametrized = rule.match(/\/:[a-zA-z0-9]+/gm);
    const isGlobed = rule.match(/[\.\*!?\(\)|\[\]]/gm);
    
    if (isParametrized) {
      return 'parametrized';
    }
    else if (isGlobed) {
      return 'globed';
    }
  
    return 'plain';
};

const replaceAll = (str, regex, replacement) => str
  .match(regex)
  .reduce((acc) => acc.replace(regex, replacement), str);

export const routeMatchers = {
    plain: (url, route) => url === route,
    parametrized: (url, route) => {
      const regexString = replaceAll(route, /:[a-zA-Z0-9]+/gm, '[a-zA-Z0-9]+');
      const regex = new RegExp('^' + regexString + '$', 'gm');
  
      return Boolean(url.match(regex));
    },
    globed: (url, route) => micromatch.isMatch(url, route)
};

export const matchRouteForUrl = (method, url) => {
    const allRoutesOnMethod = routes[method];
    let result = null; // TODO: Must be an array for cases when we have two routes like /123 and /1?3, etc.

    for (let routePath of Object.keys(allRoutesOnMethod)) {
      const currentRoute = getRoute(method, routePath);
      const match = routeMatchers[getRouteType(currentRoute)];
  
      if (match(url, routePath)) {
        result = currentRoute;
      }
    }

    return result;
}

export const addRoute = (method, path, handlers) => {
    if (!getRoute(method, path)) {
        routes[method][path] = {};
    }

    const route = routes[method][path];
    addHandlers(route, handlers);
    route.type = findRouteType(path);
    route.path = path;
};

export const addHandlers = (route, handlers) => {    
    handlers.reduce((acc, cur) => {
        if (!acc) {
            route.handler = new Handler(cur);
            
            return route.handler;
        }
        else {
            acc.setNext(new Handler(cur));
            
            return acc.nextHandler;
        }
    }, route.handler);
};

export function get(url, ...handlers) {
    addRoute('GET', url, handlers);
}
