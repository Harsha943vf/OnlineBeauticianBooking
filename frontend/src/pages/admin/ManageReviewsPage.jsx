import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllReviews, deleteReview } from '../../services/adminService';
import ConfirmModal from '../../components/ConfirmModal';

function ManageReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = () => {
    getAllReviews().then(res => setReviews(res.data)).catch(console.error);
  };

  const handleDelete = async () => {
    await deleteReview(deleteModal.id);
    loadReviews();
    toast.success('Review deleted');
    setDeleteModal({ open: false, id: null });
  };

  return (
    <div>
      <h2>Manage Reviews</h2>

      {reviews.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}><p>No reviews yet.</p></div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr><th>ID</th><th>Client</th><th>Beautician</th><th>Rating</th><th>Comment</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {reviews.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.clientName || '-'}</td>
                  <td>{r.beauticianName || '-'}</td>
                  <td><span style={{ color: '#f5a623' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span></td>
                  <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.comment}</td>
                  <td>
                    <button className="btn btn-danger" onClick={() => setDeleteModal({ open: true, id: r.id })} style={{ fontSize: '12px', padding: '4px 8px' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete Review"
        message="Are you sure you want to delete this review?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}

export default ManageReviewsPage;
