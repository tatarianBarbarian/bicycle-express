import { Handler } from '../Handler/Handler.js';
import micromatch from 'micromatch';

export const createRoutesRegistry = () => { 
  const registry = new Map();
  registry.set('GET', new Map());

  return registry;
};
export const getRoute = (registry, method, path) => registry.get(method).get(path);
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

export const matchRouteForUrl = (registry, method, url) => {
    const allRoutesOnMethod = [...registry.get(method).keys()];
    let result = []; // TODO: Must be an array for cases when we have two or more routes like /123 and /1?3, etc.

    for (let routePath of allRoutesOnMethod) {
      const currentRoute = getRoute(registry, method, routePath);
      const match = routeMatchers[getRouteType(currentRoute)];
  
      if (match(url, routePath)) {
        result.push(currentRoute);
      }
    }

    return result;
}

export const addRoute = (registry, method, path, handlers) => {
    if (!getRoute(registry, method, path)) {
        registry.get(method).set(path, {});
    }

    const route = registry.get(method).get(path);
    route.type = findRouteType(path);
    route.path = path;
    attachHandlers(route, handlers);
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
    
    return {...match.groups};
  }
};

export const getUrlParams = (registry, method, url) => {
  const matchingRoutes = matchRouteForUrl(registry, method, url);
  if (!matchingRoutes) return {};

  const params = matchingRoutes.reduce((acc, cur) => {
    const getParams = urlParamsGetters[getRouteType(cur)];

    return {...acc, ...getParams(url, cur)};
  }, {});

  return params;
};

export const makeGet = (registry) => (url, ...handlers) => addRoute(registry, 'GET', url, handlers);
export const runRouteHandlers = (routes, req, res) => {
  routes.forEach(route => {
    route.handler.handle(req, res);
  });
};
