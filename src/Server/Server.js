import http from 'http';

export const createServer = (instance) => http.createServer(instance);
export const startServer = (server, port) => server.listen(port);
