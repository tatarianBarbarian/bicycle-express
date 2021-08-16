import request from 'supertest';
import { press } from '../main.js';

const app = press();
const subApp = press();
const subSubApp = press();
const subAppMount = '/hello';
const subSubAppMount = '/alternative'

const subappMap = {
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

const subSubappMap = {
    root: {
        url: '/',
        respond: 'Sub-sub-app root\n'
    },
    fr: {
        url: '/fr',
        respond: 'Bonjoir!\n'
    },
    jp: {
        url: '/jp',
        respond: 'Konichiwa!\n'
    }
};

subApp.get(subappMap.root.url, (req, res) => {
    res.write(subappMap.root.respond);
});

subApp.get(subappMap.ru.url, (req, res) => {
    res.write(subappMap.ru.respond);
});

subApp.get(subappMap.en.url, (req, res) => {
    res.write(subappMap.en.respond);
});

subSubApp.get(subSubappMap.root.url, (req, res) => {
    res.write(subSubappMap.root.respond);
});

subSubApp.get(subSubappMap.fr.url, (req, res) => {
    res.write(subSubappMap.fr.respond);
});

subSubApp.get(subSubappMap.jp.url, (req, res) => {
    res.write(subSubappMap.jp.respond);
});

subApp.use(subSubAppMount, subSubApp);
app.use(subAppMount, subApp);

describe('Subapps', () => {
    const getUrl = (path) => subAppMount + subappMap[path].url;
    const getRespond = (path) => subappMap[path].respond;

    test('Subapp correctly responds to root request', (done) => {
        request(app.server) // FIXME: leaky thing
        .get(getUrl('root'))
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(getRespond('root'));
            done();
        });
    });

    test('Subapp correctly responds to routes', (done) => {
        request(app.server) // FIXME: leaky thing
        .get(getUrl('ru'))
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(getRespond('ru'));
            done();
        });

        request(app.server) // FIXME: leaky thing
        .get(getUrl('en'))
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(getRespond('en'));
            done();
        });
    });
});

describe('Sub-sub-apps', () => {
    const getUrl = (path) => subAppMount + subSubAppMount + subSubappMap[path].url;
    const getRespond = (path) => subSubappMap[path].respond;

    test('Sub-sub correctly responds to root request', (done) => {
        request(app.server) // FIXME: leaky thing
        .get(getUrl('root'))
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(getRespond('root'));
            done();
        });
    });

    test('Sub-sub correctly responds to routes', (done) => {
        request(app.server) // FIXME: leaky thing
        .get(getUrl('fr'))
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(getRespond('fr'));
            done();
        });

        request(app.server) // FIXME: leaky thing
        .get(getUrl('jp'))
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(response.text).toEqual(getRespond('jp'));
            done();
        });
    });
});
