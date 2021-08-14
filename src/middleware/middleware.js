import { Handler } from "../Handler/Handler.js";
import { get } from "../Route/Route.js";

const middlewareChain = new Handler((req, res, next) => { next() });

export const startMiddleware = (req, res) => middlewareChain.handle(req, res);
export const attachMiddleware = (cb) => middlewareChain.setNext(new Handler(cb));

export function use(first, second) {
    switch (typeof first) {
        case 'function':
            attachMiddleware(first);
            break;
        case 'string':
            get(first, second);
            break;
    }
};
