import { press } from './src/main.js';

const app = press();

app.use((req, res, next) => {
    res.write('Message from general middleware\n');
    next();
});

app.use('/123', (req, res, next) => {
    res.write('Message from route-specific /123 middleware\n');
    next();
});

app.get(
    '/123', 
    (req, res, next) => {
        res.write('Hello from /123 get route!\n');
        next('first');
    },
    (req, res, next) => {
        res.write('Hi, im second /123 handler!\n');
        next();
    },
    (req, res) => {
        res.write('Hi, im third /123 handler!\n');
    }
);

app.listen(3000);


