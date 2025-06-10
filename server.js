const express = require('express');
const app = express();
const router = require('./routes')
const cors = require('cors');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://edusiap-api-498867854322.asia-southeast2.run.app'
    ]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.send("Welcome to EduSiap API");
})

app.use('/', router);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`)
})