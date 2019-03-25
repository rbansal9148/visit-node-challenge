import express from 'express';
import multer from 'multer';
import cron from 'node-cron';
import connection from './connections';
import csvReader from './csv-reader'; 
import {bulkInsert, getAllData} from './db-repo';
import cronScript from './cron-script';

const searchingDir = './';

cron.schedule("1 * * * * *", function() {
    console.log(new Date());
    cronScript(searchingDir);
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
});

const app = express();

const upload = multer({ dest: '/upload' });

app.get('/', (req, res) => {
    getAllData().then((results) => {
        res.status(200).send(results);
    }, (err) => {
        res.status(500).json({error: err});
    });
});

app.post('/', upload.single('file'), (req, res) => {
    csvReader(req.file, true).then((result)=> {
        bulkInsert(result).then((result) => {
            res.status(201).send({success: result});
        }, (err) => {
            res.status(500).json({error: err});
        });
    }, (err) => {
        return res.status(400).json({ error: err });
    });
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});