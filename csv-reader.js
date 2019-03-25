import fs from 'fs';
import csv from 'fast-csv';

export default (file, deleteFile) => {

    let fileRows = [];

    return new Promise((resolve, reject) => {
        if ('text/csv' !== file.mimetype) {
            reject('File type incompatible');
            return;
        }

        csv.fromPath(file.path).on("data", (data) => {
            fileRows.push(data);
        }).on("end", function () {
            if (deleteFile)
                fs.unlinkSync(file.path);
            const dataRows = fileRows.slice(1, fileRows.length);
            const validationError = validateCsvData(dataRows);
            if (validationError) {
                reject(validationError);
            } else {
                resolve(dataRows);
            }
        });
    });
}

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