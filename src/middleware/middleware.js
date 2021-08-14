import { Handler } from "../Handler/Handler.js";
import { get } from "../Route/Route.js";
import { processUrl } from "./library.js";

const dummyMiddleware = new Handler((req, res, next) => { next(); });

const middlewareChain = {
    start: dummyMiddleware,
    end: dummyMiddleware,
};

export const attachMiddleware = (cb) => {
    const newMiddleware = new Handler(cb);

    middlewareChain.end.setNext(newMiddleware);
    middlewareChain.end = newMiddleware;
};
export const startMiddleware = (req, res) => middlewareChain.start.handle(req, res);

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

use(processUrl());
