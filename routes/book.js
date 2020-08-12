const express = require('express')
const path = require('path');
const bodyParser = require('body-parser');
let payloadChecker = require('payload-validator');
const { isNullOrUndefined } = require('util');

const app = express();

let bookArray = ["Dune", "Gone With The Wind", "The Lord Of The Rings", "Advanced Calculus"];
let favoriteSeparator = "*#*";

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

  let bookString = await getBookList(bookArray, index, favoriteSeparator);
  if (bookString.startsWith('No such index')) {
    res.status(418).json({ message: bookString });
  }
  else {
    res.status(200).json({ message: bookString });
  }
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
  let str = [];
  for (var i = 0; i < bookArray.length; i++) {
    str.push(`"${bookArray[i]}": ${await saveItemOnDatabase(bookArray[i])}`);
  }

  let stringResult = `{ ${str.join()} }`;
  if (stringResult.indexOf(": 0") > 0) {
    res.status(418).send(stringResult);
  }
  else {
    res.status(200).send(stringResult);
  }
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
  let env = app.get('env');
  let promise = new Promise((resolve, reject) => {
    let idx = parseInt(index);
    let str = "";

    if (idx === -1) {
      str = list.join(separator);
    }
    else {
      str = list[idx];
    }

    if (!isNullOrUndefined(str)) {
      resolve(str);
    }
    else {
      str = `No such index: ${index}, must be an integer and between -1 (for full list) and ${list.length - 1} (list length - 1)`;
      reject(str);
    }

    return str;
  });

  return await promise.then(
    function (str) {
      if (env !== 'test') {
        console.log(`success`);
      }
      return str;
    },
    function (str) {
      if (env !== 'test') {
        console.log(str);
      }
      return str;
    }
  );
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
  let env = app.get('env');
  let promise = new Promise((resolve, reject) => {
    let interval = Math.round(10 * Math.random() * name.length);
    if (name.length > 2) {
      setTimeout(() => resolve(interval), interval);
    }
    else {
      reject(Error(`failure: '${name}' too short, not added to database`));
    }
    return interval;
  });

  return await promise.then(
    function (interval) {
      if (env !== 'test') {
        console.log(`success - added ${name} to database`);
      }
      return interval;
    },
    function (err) {
      if (env !== 'test') {
        console.log(err);
      }
      return 0;
    }
  );
}

module.exports = { getBooks, postBook, deleteBook, patchBook, putBook };