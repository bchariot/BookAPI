const express = require('express')
let payloadChecker = require('payload-validator');
const { isNullOrUndefined } = require('util');

const app = express();

let bookArray = ["Dune", "Gone With The Wind", "The Lord Of The Rings", "Advanced Calculus"];
const favoriteSeparator = "*#*";

let putArray = [];
let putCount = 0;

// for payload validation purposes
let expectedPayload = {
  "book": ""
};

let expectedPatchPayload = {
  "original_book": "",
  "new_book": ""
};


/**
 * routing function to handle GET requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function getBooks(req, res) {
  let index = -1;
  if (req.query.id) {
    index = req.query.id;
  }

  await getBookList(bookArray, index, favoriteSeparator, (err, result) => {
    if (!isNullOrUndefined(err)) {
      res.status(418).json({ message: err });
    }
    else {
      res.status(200).json({ message: result });
    }
  });
}

/**
 * routing function to handle POST requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
function postBook(req, res) {
  if (req.body) {
    let result = payloadChecker.validator(req.body, expectedPayload, ["book"], false);
    if (result.success) {
      let addedBook = req.body.book;

      if (!bookArray.includes(addedBook)) {
        bookArray.push(addedBook);
        res.json({ message: `Book '${addedBook}' has been added to the library` });
      }
      else {
        res.status(409).json({ errorMessage: `Book '${addedBook}' already in the library` });
      }
    } else {
      res.status(406).json({ errorMessage: result.response.errorMessage });
    }
  } else {
    res.status(406).json({ errorMessage: "POST payload not correct" });
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
    var result = payloadChecker.validator(req.body, expectedPayload, ["book"], false);
    if (result.success) {
      let deletedBook = req.body.book;

      if (bookArray.includes(deletedBook)) {
        for (var i = 0; i < bookArray.length; i++) {
          if (bookArray[i] === deletedBook) {
            bookArray.splice(i, 1);
          }
        }
        res.json({ message: `'Book '${deletedBook}' removed from the library` });
      }
      else {
        res.status(404).json({ errorMessage: `Book '${deletedBook}' not found in the library` });
      }
    } else {
      res.status(406).json({ errorMessage: result.response.errorMessage });
    }
  } else {
    res.status(406).json({ errorMessage: "DELETE payload not correct" });
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
    var result = payloadChecker.validator(req.body, expectedPatchPayload, ["original_book", "new_book"], false);
    if (result.success) {
      let originalBook = req.body.original_book;
      let newBook = req.body.new_book;

      if (bookArray.includes(originalBook)) {
        for (var i = 0; i < bookArray.length; i++) {
          if (bookArray[i] === originalBook) {
            bookArray[i] = newBook;
          }
        }
        res.json({ message: `Book '${originalBook}' has been renamed to '${newBook}' in the library` });
      }
      else {
        res.status(404).json({ errorMessage: `Book '${originalBook}' not found in the library` });
      }
    } else {
      res.status(406).json({ errorMessage: result.response.errorMessage });
    }
  } else {
    res.status(406).json({ errorMessage: "PATCH payload not correct" });
  }
}

/**
 * routing function to handle PUT requests
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function putBook(req, res) {
  putArray = [];
  putCount = 0;

  saveItemOnDatabase(res, outputResults);
}

/**
 * If the index parameter is set to -1 this function will return a string delimited using
 * the given separator for the given list.  Otherwise, the function will return the book name
 * of the book at the given index in the list.  Error message returned if index out of range.
 * 
 * @param {array} list Array list of book names
 * @param {number} index The index to find within the array
 * @param {string} separator The favorite separator to use as a delimiter in the return string
 * @param {*} callback Callback function place holder
 * @returns {string}
 */
async function getBookList(list, index, separator, callback) {
  let idx = parseInt(index);
  let str = "";

  if (idx === -1) {
    str = list.join(separator);
  }
  else {
    str = list[idx];
  }

  if (isNullOrUndefined(str)) {
    callback(`No such index: ${index}, must be an integer and between -1 (for full list) and ${list.length - 1} (list length - 1)`, null);
  }
  else {
    callback(null, str);
  }
}

/**
 * Takes the length of the given name and multiplies it by a randomly
 * generated number and 10 to get a time interval in milliseconds.
 * The function then delays for this interval and finally returns
 * the value of the interval back to the method that called it. 
 * 
 * @param {*} res
 * @param {*} callback Callback function place holder
 */
function saveItemOnDatabase(res, callback) {
  if (putCount < bookArray.length) {
    let interval = Math.round(100 * Math.random() * bookArray[putCount].length);
    if (bookArray[putCount].length <= 3) {
      interval = 0;
    }
    putArray.push(`"${bookArray[putCount]}": ${interval}`);
    putCount++;
    setTimeout(() => {saveItemOnDatabase(res, callback);}, interval);
  }
  else {
    callback(res);
  }
}

/**
 * Callback function for 'saveItemOnDatabase' to output the results
 * 
 * @param {*} res 
 */
function outputResults(res) {
  let stringResult = `{${putArray.join(',')}}`;
  if (stringResult.indexOf(`": 0`) > 0) {
    res.status(418).json(JSON.parse(stringResult));
  }
  else {
    res.status(200).json(JSON.parse(stringResult));
  }
}

module.exports = { getBooks, postBook, deleteBook, patchBook, putBook };