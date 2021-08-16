import request from 'supertest';
import { press } from '../main.js';

const app = press();
const subApp = press();
const subAppMount = '/hello';

const map = {
    root: {
        url: '/',
        respond: 'Subapp root\n'
    },
    ru: {
        url: '/ru',
        respond: 'Привет!\n'
    },
    en: {
        url: '/en',
        respond: 'Hello!\n'
    }
};

subApp.get(map.root.url, (req, res) => {
    res.write(map.root.respond);
});

subApp.get(map.ru.url, (req, res) => {
    res.write(map.ru.respond);
});

subApp.get(map.en.url, (req, res) => {
    res.write(map.en.respond);
});

app.use(subAppMount, subApp);

describe('Subapps', () => {
    test('Subapp correctly responds to root request', (done) => {
        request(app.server) // FIXME: leaky thing
        .get(subAppMount + map.root.url)
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(map.root.respond);
            done();
        });
    });

    test('Subapp correctly responds to routes', (done) => {
        request(app.server) // FIXME: leaky thing
        .get(subAppMount +  map.ru.url)
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(map.ru.respond);
            done();
        });

        request(app.server) // FIXME: leaky thing
        .get(subAppMount + map.en.url)
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(map.en.respond);
            done();
        });
    });
});
