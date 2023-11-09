const express = require('express');
const app = express();
const mongoose = require('mongoose');


mongoose.connect('mongodb+srv://shrayas:lucifer@cluster0.gwduk9a.mongodb.net/Book', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  summary: String,
});

const Book = mongoose.model('Book', bookSchema);

app.get('/books', async (req, res) => {
  try {
    const title = req.query.title; 
    const books = await Book.find({}).exec(); 

    res.json(books);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, summary } = req.body;

    
    const newBook = new Book({
      title,
      author,
      summary,
    });

    
    const savedBook = await newBook.save();

    res.status(201).json(savedBook);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});




app.get('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id; 
    const book = await Book.findById(bookId).exec(); 

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json(book);
    console.log(book)
  } catch (error) {
    res.status(500).json(error);
  }
});
app.put('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id; 
    const { title, author, summary } = req.body;

    // Find the book by its ID and update its details
    const updatedBook = await Book.findByIdAndUpdate(bookId, { title, author, summary }, { new: true }).exec();

    if (!updatedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json(error);
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    const bookId = req.params.id; 

    // Find the book by its ID and remove it
    const deletedBook = await Book.findByIdAndRemove(bookId).exec();

    if (!deletedBook) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
