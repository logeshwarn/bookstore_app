import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaEye, FaTrash, FaSearch } from 'react-icons/fa';
import { getAllBooks } from '../api/api';
import LoadingSpinner from './LoadingSpinner';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const result = await getAllBooks();
      setBooks(result.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch books');
      setLoading(false);
      toast.error('Failed to load books');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        toast.success('Book deleted successfully');
        fetchBooks(); // Refresh the list
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="book-list-container">
      <div className="book-list-header">
        <h2>Book Collection</h2>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search books..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>
      
      {books.length === 0 ? (
        <div className="empty-state">
          <h3>No books available</h3>
          <p>Start by adding your first book</p>
          <Link to="/books/new" className="add-first-book-btn">
            Add Your First Book
          </Link>
        </div>
      ) : (
        <>
          {filteredBooks.length === 0 ? (
            <p className="no-results">No books match your search</p>
          ) : (
            <div className="books-grid">
              {filteredBooks.map((book) => (
                <div key={book._id} className="book-card">
                  <div className="book-year">{book.publishYear}</div>
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">By {book.author}</p>
                  <div className="book-actions">
                    <Link to={`/books/${book._id}`} className="action-btn view-btn" title="View Details">
                      <FaEye />
                    </Link>
                    <Link to={`/books/edit/${book._id}`} className="action-btn edit-btn" title="Edit Book">
                      <FaEdit />
                    </Link>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(book._id)}
                      title="Delete Book"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList; 