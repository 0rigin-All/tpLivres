const express = require("express");
const router = require('./app/router')
const app = express();

app.use(express.json());
app.use('/', router)


app.listen(8080, () => {
    console.log("Server Started");
});