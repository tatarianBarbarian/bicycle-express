import { press } from "../main.js";

describe('Press instance', () => {
    test('press() function returns different instances', () => {
        const app1 = press();
        const app2 = press();

        expect(app1).not.toEqual(app2);
    });
});
