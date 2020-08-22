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
  
module.exports = { getBookList, saveItemOnDatabase };