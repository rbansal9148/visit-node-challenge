import connection from './connections';

export const bulkInsert = (values) => {

    const query = 'INSERT INTO data (id, name, date, steps, calories) values ?';
    return new Promise((resolve, reject) => {
        connection.query(query, [values], (err) => {
            if (err) reject(err);
            else resolve('Data is successfully added');
        });
    });
};

export const getAllData = () => {
    const query = 'SELECT * FROM data';
    return new Promise((resolve, reject) => {
        connection.query(query, (err, results) => {
            if (err) reject(err);
            else resolve(results);
        });
    });
}