const express = require('express')
const bodyParser = require('body-parser');
const morgan = require('morgan');
let book = require('./routes/book');
const swaggerUi = require('swagger-ui-express');
const openApiDocumentation = require('./openApiDocumentation.js');

const app = express();
const port = 3000;

// do not use Morgan when in "test" mode
env = app.get('env');
if (env !== 'test')
{
    app.use(morgan('combined'));
}

// setup route for Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

app.use(bodyParser.json());                                     
app.use(bodyParser.urlencoded({extended: true}));               
app.use(bodyParser.text());                                    
app.use(bodyParser.json({ type: 'application/json'}));

// setup routes for home and book
app.get("/", (req, res) => res.json({message: "Welcome to Virtual library!"}));

app.route("/book")
    .get(book.getBooks)
    .post(book.postBook)
    .delete(book.deleteBook)
    .patch(book.patchBook)
    .put(book.putBook);

// startup port listener
app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;