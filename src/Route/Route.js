import { Handler } from '../Handler/Handler.js';
import micromatch from 'micromatch';

const routes = {
    GET: {},
};

export const getRoute = (method, path) => routes[method][path];
export const getRouteType = (route) => route.type;
export const getRouteHandler = (route) => route?.handler || null;
export const getRoutePath = (route) => route.path;
export const findRouteType = (rule) => { // todo: rule validation?
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
    let result = null; // TODO: Must be an array for cases when we have two or more routes like /123 and /1?3, etc.

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
    attachHandlers(route, handlers);
    route.type = findRouteType(path);
    route.path = path;
};

export const attachHandlers = (route, handlers) => {    
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

const urlParamsGetters = {
  plain: (url) => ({}),
  globed: (url) => ({}),
  parametrized: (url, route) => {
    const path = getRoutePath(route);
    const re = /:[a-zA-Z0-9]+/g;
    const replacement = '[a-zA-Z0-9]+';
    let regexString = path.replace(re, (m) => `(?<${m.replace(':', '')}>${replacement})`);
    const regex = new RegExp(regexString, 'gm');
    const match = regex.exec(url);
    
    return match.groups;
  }
};

export const getUrlParams = (method, url) => {
  const matchingRoute = matchRouteForUrl(method, url);
  if (!matchingRoute) return {};

  const getParams = urlParamsGetters[getRouteType(matchingRoute)];

  return getParams(url, matchingRoute);
};

export function get(url, ...handlers) {
    addRoute('GET', url, handlers);
}
