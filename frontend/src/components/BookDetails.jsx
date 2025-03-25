import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaEdit, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { getBookById, deleteBook } from '../api/api';
import LoadingSpinner from './LoadingSpinner';

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const data = await getBookById(id);
        setBook(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch book details');
        setLoading(false);
        toast.error('Could not load book details');
      }
    };

    fetchBook();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        toast.success('Book deleted successfully');
        navigate('/');
      } catch (err) {
        toast.error('Failed to delete book');
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="error-message">Error: {error}</div>;
  if (!book) return <div className="error-message">Book not found</div>;

  return (
    <div className="book-details-container">
      <div className="book-details-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Books
        </Link>
        <h2>{book.title}</h2>
      </div>
      
      <div className="book-details-card">
        <div className="book-metadata">
          <div className="metadata-item">
            <span className="metadata-label">Author</span>
            <span className="metadata-value">{book.author}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Published Year</span>
            <span className="metadata-value">{book.publishYear}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Added to Library</span>
            <span className="metadata-value">{new Date(book.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="metadata-item">
            <span className="metadata-label">Last Updated</span>
            <span className="metadata-value">{new Date(book.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
        
        <div className="book-details-actions">
          <Link to={`/books/edit/${book._id}`} className="detail-action-btn edit-btn">
            <FaEdit /> Edit Book
          </Link>
          <button onClick={handleDelete} className="detail-action-btn delete-btn">
            <FaTrash /> Delete Book
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 