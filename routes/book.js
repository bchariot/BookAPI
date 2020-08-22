const express = require('express')
const path = require('path');
const utils = require('../services/utils');
const bodyParser = require('body-parser');
let payloadChecker = require('payload-validator');

let bookArray = ["Dune", "Gone With The Wind", "The Lord Of The Rings", "Advanced Calculus"];
let favoriteSeparator = "*#*";

var expectedPayload = {
  "book" : ""
};

var expectedPatchPayload = {
  "original_book" : "",
  "new_book" : ""
};

async function getBooks(req, res) {
  index = -1;
  if (req.query.id) {
    index = req.query.id;
  }

  bookString = await utils.getBookList(bookArray, index, favoriteSeparator);
  res.json({message: bookString});
  return;
}
  
function postBook(req, res) {
    if (req.body) {
        var result = payloadChecker.validator(req.body,expectedPayload,["book"],false);
        if (result.success) {
            addedBook = req.body.book;

            if (!bookArray.includes(addedBook)) {
                bookArray.push(addedBook);
                res.json({message: "Book '" + addedBook + "' has been added to the library"});
            }
            else {
                res.status(409).json({errorMessage: "Book '" + addedBook + "' already in the library"});
            }
        } else {
          res.status(406).json({errorMessage: result.response.errorMessage});
        }
    } else {
      res.status(406).json({errorMessage: "POST payload not correct"});
    }
}
  
function deleteBook(req, res) {
    if (req.body) {
        var result = payloadChecker.validator(req.body,expectedPayload,["book"],false);
        if (result.success) {
            deleteBook = req.body.book;

            if (bookArray.includes(deleteBook)) {
                for (var i = 0; i < bookArray.length; i++) {
                    if (bookArray[i] === deleteBook) {
                        bookArray.splice(i, 1);
                    }
                }
                res.json({message: 'Book "' + deleteBook + '" removed from the library'});
            }
            else {
                res.status(404).json({errorMessage: 'Book "' + deleteBook + '" not found in the library'});
            }
        } else {
          res.status(406).json({errorMessage: result.response.errorMessage});
        }
    } else {
      res.status(406).json({errorMessage: "DELETE payload not correct"});
    }
};
  
function patchBook(req, res) {
    if (req.body) {
      var result = payloadChecker.validator(req.body,expectedPatchPayload,["original_book", "new_book"],false);
      if (result.success) {
        originalBook = req.body.original_book;
        newBook = req.body.new_book;
  
        if (bookArray.includes(originalBook)) {
          for (var i = 0; i < bookArray.length; i++) {
            if (bookArray[i] === originalBook) {
              bookArray[i] = newBook;
            }
          }
          res.json({message: 'Book "' + originalBook + '" has been renamed to "' + newBook + '" in the library'});
        }
        else {
          res.status(404).json({errorMessage: 'Book "' + originalBook + '" not found in the library'});
        }
      } else {
        res.status(406).json({errorMessage: result.response.errorMessage});
      }
    } else {
      res.status(406).json({errorMessage: "PATCH payload not correct"});
    }
}
  
async function putBook(req, res) {
    str = [];
    for (var i = 0; i < bookArray.length; i++) {
      str.push('"' + bookArray[i] + '":' + await utils.saveItemOnDatabase(bookArray[i]));
    }
  
    res.json(JSON.parse('{' + str.join() + '}'), undefined, '\t');
}

module.exports = { getBooks, postBook, deleteBook, patchBook, putBook };
