import { Handler } from "../Handler";

describe('Handler', () => {
    test('Correctly transfers handlers', () => {
        const result = [];
        const cb1 = (a, b, next) => {
            result.push(1);
            next();
        };
        const cb2 = (a, b) => {
            result.push(2);
        };

        const instance1 = new Handler(cb1);
        const instance2 = new Handler(cb2);

        instance1.setNext(instance2);
        instance1.handle();

        expect(result).toEqual([1,2]);
    });
});
