const fs = require('fs')
var express = require('express');
var router = express.Router();

/* GET users listing. */
let booksData;

function readBooksData() {
  fs.readFile(`${__dirname}/books.json`, "utf8", function (err, data) {
    if (err) throw err;
    booksData = JSON.parse(data);
  });
}

readBooksData()

function save(data) {
  const json = JSON.stringify(data);
  fs.writeFile("./routes/books.json", json, function (err) {
    if (err) return console.log(err);
  });
}

router.get('/', function(req, res) {
  try {
    res.json(booksData)
    }
    catch (error){
      res.json({statusCode: 404, message: 'Books not founds'})
    }

});

router.get('/:bookId', function(req, res) {
  try {
  const abook = booksData.books.filter(b => b.id === req.params.bookId)
  if (!abook) throw Error 
  res.json(abook);
  }
  catch (error){
    res.json({statusCode: 404, message: 'Book not founds'})
  }
});

// create a book
router.post('/', function(req, res){
  try {
    let abook = req.body;
    if (!abook) throw Error;
    booksData.push(req.body);
    save(booksData);
    res.send(req.body);
  } catch (error) {
    res.status(404).json({ statusCode: 404, message: "Book not found" });
  }

})
//edit a book
router.patch('/:bookId', function(req, res) {
  try {
  let abook = booksData.books.filter(b => b.id === req.params.bookId)
  if (!abook) throw Error 
  abook = {...abook, ... req.body}
  
  const index = booksData.books.findIndex(b => b.id === req.params.bookId)
  booksData.books[index] = abook;
  save(booksData)
  res.json(abook);
  }
  catch (error){
    res.json({statusCode: 404, message: 'Book not founds'})
  }
});
//delete a book 
router.delete('/:bookId', function(req, res){
  try {
    
    let index = booksData.books.findIndex(b => b.id === req.params.bookId)
   if (index === -1) throw Error
   booksData.books.splice(index,1);
    save(booksData)
    res.json({message: "Book Deleted"});
    }
    catch (error){ 
      res.json({statusCode: 404, message: 'Book not founds'})
    }

})


module.exports = router;
