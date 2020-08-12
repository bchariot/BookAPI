let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server');
let should = chai.should();

chai.use(chaiHttp);

describe('Books', () => {
    // GET tests
    describe('/GET books', () => {
        it('it should GET all the books from the library', (done) => {
            chai.request(server)
                .get('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not GET a book from the library with index outside of range', (done) => {
            chai.request(server)
                .get('/book?id=23')
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    // POST tests
    describe('/POST book', () => {
        it('it should not POST a book with name of book an integer', (done) => {
            let book = { "book": 1 };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not POST a book with element "book" misspelled', (done) => {
            let book = { "bok": 1 };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should POST a book to the library', (done) => {
            let book = { "book": "Great Expectations" };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not POST a book that is already in the libary', (done) => {
            let book = { "book": "Dune" };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(409);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    // DELETE tests
    describe('/DELETE book', () => {
        it('it should not DELETE a book with name of book an integer', (done) => {
            let book = { "book": 1 };
            chai.request(server)
                .delete('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not DELETE a book with element "book" misspelled', (done) => {
            let book = { "bok": 1 };
            chai.request(server)
                .delete('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should DELETE a book from the library', (done) => {
            let book = { "book": "Gone With The Wind" };
            chai.request(server)
                .delete('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not DELETE a book that is not in the libary', (done) => {
            let book = { "book": "Faust" };
            chai.request(server)
                .delete('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    // PATCH tests
    describe('/PATCH book', () => {
        it('it should not PATCH a book with name of original_book an integer', (done) => {
            let book = { "original_book": 1, "new_book": "The Hobbit" };
            chai.request(server)
                .patch('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not PATCH a book with element "original_book" misspelled', (done) => {
            let book = { "original_bok": "The Lord Of The Rings", "new_book": "The Hobbit" };
            chai.request(server)
                .patch('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not PATCH a book with name of new_book an integer', (done) => {
            let book = { "original_book": "The Lord Of The Rings", "new_book": 1 };
            chai.request(server)
                .patch('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not PATCH a book with element "new_book" misspelled', (done) => {
            let book = { "original_bok": "The Lord Of The Rings", "new_book": "The Hobbit" };
            chai.request(server)
                .patch('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(406);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should PATCH a book in the library', (done) => {
            let book = { "original_book": "The Lord Of The Rings", "new_book": "The Hobbit" };
            chai.request(server)
                .patch('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not PATCH a book that is not in the libary', (done) => {
            let book = { "original_book": "The Lord Of The Flies", "new_book": "The Fly" };
            chai.request(server)
                .patch('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(404);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });

    // PUT tests
    describe('/PUT books', () => {
        it('it should PUT all the books into the database', (done) => {
            chai.request(server)
                .put('/book')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should POST a book into the library that has less than 3 characters', (done) => {
            let book = { "book": "It" };
            chai.request(server)
                .post('/book')
                .send(book)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    done();
                });
        });
        it('it should not PUT a book into the database if name is less than 3 characters', (done) => {
            chai.request(server)
                .put('/book')
                .end((err, res) => {
                    res.should.have.status(418);
                    res.body.should.be.a('object');
                    done();
                });
        });
    });
});