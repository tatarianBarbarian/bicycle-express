import { Handler } from "../Handler/Handler.js";
import { get } from "../Route/Route.js";
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

export function makeUse(chain) {
    return function(first, second) {
        switch (typeof first) {
            case 'function':
                attachMiddleware(chain, first);
                break;
            case 'string':
                get(first, second);
                break;
        }
    };
};

let isDefaultMiddlewareInited = false;

export const initDefaultMiddleware = (chain) => {
    if (isDefaultMiddlewareInited) return;
    
    const use = makeUse(chain);

    use(processUrl());

    isDefaultMiddlewareInited = true;
};
