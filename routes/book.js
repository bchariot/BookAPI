const express = require('express')
const path = require('path');
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

/**
 * routing function to handle GET requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function getBooks(req, res) {
  index = -1;
  if (req.query.id) {
    index = req.query.id;
  }

  bookString = await getBookList(bookArray, index, favoriteSeparator);
  res.json({message: bookString});
  return;
}
  
/**
 * routing function to handle POST requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
  
/**
 * routing function to handle DELETE requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
  
/**
 * routing function to handle PATCH requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
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
  
/**
 * routing function to handle PUT requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function putBook(req, res) {
    str = [];
    for (var i = 0; i < bookArray.length; i++) {
      str.push('"' + bookArray[i] + '":' + await saveItemOnDatabase(bookArray[i]));
    }
  
    res.send('{' + str.join() + '}');
}

/**
 * If the index parameter is set to -1 this function will return a string delimited using
 * the given separator of the given list.  Otherwise, the function will return the book name
 * if the book at the given index in the list
 * 
 * @param {array} list Array list of book names
 * @param {number} index The index to find within the array
 * @param {string} separator The favorite separator to use as a delimiter in the return string
 * @returns {string}
 */
async function getBookList(list, index, separator) {
  if (index === -1) {
    str = list.join(separator);
    return Promise.resolve(str);
  }
  else {
    return Promise.resolve(list[index]);
  }
}

/**
 * Takes the length of the given name and multiplies it by a randomly
 * generated number and 10 to get a time interval in milliseconds.
 * The function then delays for this interval and finally returns
 * the value of the interval back to the method that called it. 
 * 
 * @param {string} name The name of the book
 * @returns {number}
 */
async function saveItemOnDatabase(name) {
  let promise = new Promise((resolve, reject) => {
    interval = Math.round(10 * Math.random() * name.length);
    setTimeout(() => resolve(interval), interval);
    return interval;
  });

  return await promise;
}

module.exports = { getBooks, postBook, deleteBook, patchBook, putBook };