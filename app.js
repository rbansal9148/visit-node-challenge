import express from 'express';
import multer from 'multer';
import cron from 'node-cron';
import connection from './connections';
import csvReader from './csv-reader'; 

cron.schedule("1 1 * * *", function() {
    console.log("running a task every minute");
});

connection.connect(function(err) {
    if (err) throw err;
    console.log('You are now connected...');
});  

const app = express();

const upload = multer({ dest: '/upload' });

app.get('/', (req, res) => {
    connection.query('SELECT * FROM data', (err, results) => {
        if (err) throw err;
        res.status(200).send(results);
    });
});

app.post('/', upload.single('file'), (req, res) => {
    csvReader(req.file, true).then((result)=> {
        connection.query('INSERT INTO data (id, name, date, steps, calories) values ?', [result], (err) => {
            if (err) throw err;
        });
        res.status(201).send({success: 'Successfully added records.'});
    }, (err) => {
        return res.status(400).json({ error: err });
    });
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});