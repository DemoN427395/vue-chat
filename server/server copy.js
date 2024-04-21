import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import url from 'url';

const app = express();
const port = 3000; 
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

app.use('/node_modules', express.static(path.join(__dirname, '../node_modules')));
app.use(express.static(path.join(__dirname, '../dist')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
    console.log(`Сервер запущен на порте http://localhost:${port}`);
});