import express from 'express';

const app = express();
const port = 3000;

app.get('/api/', (req, res) => {
    res.send('Test API');
});

app.get('/api/get', (req, res) => {
    res.send('Test Get');
});

app.post('/api/post', (req, res) => {
    res.send('Test Post');
});

app.put('/api/:id', (req, res) => {
    res.send('Test Post');
});

app.delete('/api/:id', (req, res) => {
    res.send('Test Post');
});

app.listen(port, () => {
    console.log(`Zentask App Listening on port http://localhost:${port}`);
});