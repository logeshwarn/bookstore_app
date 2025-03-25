import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft } from 'react-icons/fa';
import { createBook, getBookById, updateBook } from '../api/api';
import LoadingSpinner from './LoadingSpinner';

const BookForm = ({ isEditing = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    publishYear: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing && id) {
      const fetchBook = async () => {
        try {
          setFetchLoading(true);
          const book = await getBookById(id);
          setFormData({
            title: book.title,
            author: book.author,
            publishYear: book.publishYear
          });
          setFetchLoading(false);
        } catch (err) {
          setError('Failed to fetch book data');
          setFetchLoading(false);
          toast.error('Could not load book data');
        }
      };

      fetchBook();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEditing) {
        await updateBook(id, formData);
        toast.success('Book updated successfully!');
      } else {
        await createBook(formData);
        toast.success('Book added successfully!');
      }
      setLoading(false);
      navigate('/');
    } catch (err) {
      const action = isEditing ? 'update' : 'create';
      toast.error(`Failed to ${action} book`);
      setError(`Failed to ${action} book`);
      setLoading(false);
    }
  };

  if (fetchLoading) return <LoadingSpinner />;

  return (
    <div className="book-form-container">
      <div className="book-form-header">
        <Link to="/" className="back-link">
          <FaArrowLeft /> Back to Books
        </Link>
        <h2>{isEditing ? 'Edit Book' : 'Add New Book'}</h2>
      </div>
      
      {error && <div className="form-error-message">{error}</div>}
      
      <div className="book-form-card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Book Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter book title"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="author">Author</label>
            <input
              type="text"
              id="author"
              name="author"
              value={formData.author}
              onChange={handleChange}
              placeholder="Enter author name"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="publishYear">Publication Year</label>
            <input
              type="number"
              id="publishYear"
              name="publishYear"
              value={formData.publishYear}
              onChange={handleChange}
              placeholder="Enter publication year"
              required
              className="form-input"
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="submit" 
              disabled={loading} 
              className="submit-btn"
            >
              {loading ? (
                'Saving...'
              ) : (
                <>
                  <FaSave /> {isEditing ? 'Update Book' : 'Save Book'}
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => navigate('/')} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookForm; 