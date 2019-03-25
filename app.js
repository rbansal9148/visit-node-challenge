import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.status(200).send({
        success: 'true',
        message: 'Somethign is coming finally'
    })
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});