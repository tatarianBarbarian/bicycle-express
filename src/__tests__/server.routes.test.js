import request from 'supertest';
import { press } from '../main.js';

const app = press();

app.get('/123', (req, res) => {
    res.write('Response from plain route');
});

app.get('/users/:userId', (req, res) => {
    res.write(JSON.stringify(req.params));
});

app.get('/us?rs', (req, res) => {
    res.write('Response from glob-like route');
});

describe("Route types responses", () => {
    const makeTest = (url, expectedResponse, processResponse = (resp) => resp.text) => (done) => {
        request(app.server) // FIXME: leaky thing
        .get(url)
        .then(response => {
            expect(response.statusCode).toBe(200);
            expect(processResponse(response)).toEqual(expectedResponse);
            done();
        });
    };

    test("Correctly responses to plain url", makeTest('/123', 'Response from plain route'));
    test("Correctly responses to glob-like url 1", makeTest('/users', 'Response from glob-like route'));
    test("Correctly responses to glob-like url 2", makeTest('/usars', 'Response from glob-like route'));
    test("Correctly responses to parametrized url", makeTest('/users/123', { userId: '123' }, (resp) => JSON.parse(resp.text)));
});
