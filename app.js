import express from 'express';
import multer from 'multer';
import csv from 'fast-csv';
import fs from 'fs';

const app = express();


const upload = multer({ dest: '/upload' });

app.get('/', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'Somethign is coming finally'
    })
});

app.post('/', upload.single('file'), (req, res) => {
    const fileRows = [];
  
    csv.fromPath(req.file.path).on("data", function (data) {
        fileRows.push(data);
    }).on("end", function () {
        fs.unlinkSync(req.file.path);
        const validationError = validateCsvData(fileRows);
        if (validationError) {
            return res.status(403).json({ error: validationError });
        }
        res.status(201).send();
    });
});

let validateCsvData = (rows) => {
    const dataRows = rows.slice(1, rows.length);
    for (let i = 0; i < dataRows.length; i++) {
        const rowError = validateCsvRow(dataRows[i]);
        if (rowError) {
            return `${rowError} on row ${i + 1}`;
        }
    }
    return;
}

let validateCsvRow = (row) => {
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