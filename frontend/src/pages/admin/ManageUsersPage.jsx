import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllUsers, deactivateUser } from '../../services/adminService';
import ConfirmModal from '../../components/ConfirmModal';

function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    getAllUsers().then(res => setUsers(res.data)).catch(console.error);
  };

  const handleDelete = async () => {
    await deactivateUser(deleteModal.id);
    loadUsers();
    toast.success('User deactivated');
    setDeleteModal({ open: false, id: null });
  };

  const filtered = filter === 'ALL' ? users : users.filter(u => u.role === filter);

  return (
    <div>
      <h2>Manage Users</h2>

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        {['ALL', 'CLIENT', 'BEAUTICIAN', 'ADMIN'].map(r => (
          <button key={r} className={`btn ${filter === r ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(r)} style={{ fontSize: '13px', padding: '5px 12px' }}>{r}</button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td><span className="badge badge-pending">{u.role}</span></td>
                <td>
                  {u.role !== 'ADMIN' && (
                    <button className="btn btn-danger" onClick={() => setDeleteModal({ open: true, id: u.id })} style={{ fontSize: '12px', padding: '4px 8px' }}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        isOpen={deleteModal.open}
        title="Delete User"
        message="Are you sure you want to deactivate this user?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteModal({ open: false, id: null })}
      />
    </div>
  );
}

export default ManageUsersPage;
