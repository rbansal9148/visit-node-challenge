import fs from 'fs';
import csvReader from './csv-reader';
import {bulkInsert} from './db-repo';

export default (directory) => {
    fs.readdir(directory, (err, files) => {
        files.forEach(file => {
            csvReader(file, true).then((result)=> {
                bulkInsert(result).then((result) => {
                    console.log(file, ": ", result);
                }, (err) => {
                    console.error(err);
                });
            }, (err) => {
                console.error(err);
            });
        });
    });
}