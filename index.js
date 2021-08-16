import { press } from './src/main.js';

const app = press();
const subApp = press();

app.use((req, res, next) => {
    res.write('Project-wide MW\n');
    next();
});

subApp.use((req, res, next) => {
    res.write('/hello wide MW\n');
    next();
});

subApp.get('/', (req, res) => {
    res.write('Subapp root\n');
});

subApp.get('/ru', (req, res) => {
    res.write('Привет\n');
});

subApp.get('/en', (req, res) => {
    res.write('Hello\n');
});

subApp.get('/user/:userId', (req, res) => {
    const { params } = req;
    res.write(`${JSON.stringify(params)}\n`);
});

app.use('/hello', subApp);

app.listen(3000);
