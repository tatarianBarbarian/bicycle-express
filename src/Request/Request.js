export class Request {
    raw = null;
    params = {};
    query = {};
    method = 'GET';

    constructor(raw) {
        const url = new URL(raw.url, `http://${raw.headers.host}`);
        // this.raw = raw;
        this.url = url.pathname;
        this.query = Object.fromEntries(url.searchParams.entries());
        this.method = raw.method;
        console.log(this);
    }
}