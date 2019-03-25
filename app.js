import express from 'express';
import multer from 'multer';
import csv from 'fast-csv';
import fs from 'fs';
import cron from 'node-cron';
import connection from './connections'; 

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
    const fileRows = [];
    if ('text/csv' !== req.file.mimetype) 
        return res.status(400).json({ error: "File type incompatible." });

    csv.fromPath(req.file.path).on("data", (data) => {
        fileRows.push(data);
    }).on("end", function () {
        fs.unlinkSync(req.file.path);
        const dataRows = fileRows.slice(1, fileRows.length);
        const validationError = validateCsvData(dataRows);
        if (validationError) {
            return res.status(400).json({ error: validationError });
        }
        connection.query('INSERT INTO data (id, name, date, steps, calories) values ?', [dataRows], (err) => {
            if (err) throw err;
        });
        res.status(201).send({success: 'Successfully added records.'});
    });
});

const validateCsvData = (dataRows) => {
    for (let i = 0; i < dataRows.length; i++) {
        const rowError = validateCsvRow(dataRows[i]);
        if (rowError) {
            return `${rowError} on row ${i + 1}`;
        }
    }
    return;
}

const validateCsvRow = (row) => {
    if (!Number.isInteger(Number(row[0]))) {
        return "invalid id";
    } else if (!row[1]) {
        return "invalid name";
    } else if (!Number.isInteger(Number(row[3]))) {
        return "invalid date";
    } else if (!Number.isInteger(Number(row[3]))) {
        return "invalid steps";
    } else if (!Number.isInteger(Number(row[4]))) {
        return "invalid calories";
    }
    return;
}


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});