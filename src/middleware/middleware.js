import { Handler } from "../Handler/Handler.js";
import { makeGet } from "../Route/Route.js";
import { processUrl } from "./library.js";

export const initMiddlewareRegistry = () => {
    const dummyMiddleware = new Handler((req, res, next) => { next(); });
    const middlewareChain = {
        start: dummyMiddleware,
        end: dummyMiddleware,
    };

    return middlewareChain;
}

export const attachMiddleware = (chain, cb) => {
    const newMiddleware = new Handler(cb);

    chain.end.setNext(newMiddleware);
    chain.end = newMiddleware;
};

export const startMiddlewareChain = (chain, req, res) => chain.start.handle(req, res);

export function makeUse(middlewareChain, routesRegistry) {
    const get = makeGet(routesRegistry);

    return function(first, second) {
        switch (typeof first) {
            case 'function':
                attachMiddleware(middlewareChain, first);
                break;
            case 'string':
                if (second.isInstance) {
                    second.mountpath = first;
                    get(first + '/**', second);
                } else {
                    get(first, second);
                }

                break;
        };
    };
};

export const initDefaultMiddleware = (chain, routesRegistry) => {
    const use = makeUse(chain, routesRegistry);

    use(processUrl());
};
