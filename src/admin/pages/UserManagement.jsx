import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

const ROLE_CHOICES = [
  { value: 'member', label: 'Member' },
  { value: 'support_staff', label: 'Support Staff' },
  { value: 'finance_manager', label: 'Finance Manager' },
  { value: 'admin', label: 'Admin' },
  { value: 'super_admin', label: 'Super Admin' },
];

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingUser, setSavingUser] = useState(false);
  const [userResponses, setUserResponses] = useState([]);
  const [loadingResponses, setLoadingResponses] = useState(false);
  const token = localStorage.getItem('access_token');

  const fetchUsers = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (statusFilter) params.set('status', statusFilter);
      if (roleFilter) params.set('role', roleFilter);
      const res = await axios.get(`${API_BASE_URL}/users/create_user/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.results || res.data);
      setTotal(res.data.count || res.data.length);
    } catch (err) {
      console.error(err);
    }
  }, [search, statusFilter, roleFilter, token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleAction = async (userId, action) => {
    try {
      await axios.post(
        `${API_BASE_URL}/users/create_user/${userId}/${action}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      alert(`Action ${action} completed successfully`);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || 'Action failed';
      alert(`Action failed: ${msg}`);
      console.error(err);
    }
  };

  const handleAssignRole = async (userId, newRole) => {
    try {
      await axios.post(
        `${API_BASE_URL}/users/create_user/${userId}/assign_role/`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUserResponses = async (userId) => {
    setLoadingResponses(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/users/admin/event-responses/?user_id=${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserResponses(res.data.results || res.data);
    } catch {
      setUserResponses([]);
    } finally {
      setLoadingResponses(false);
    }
  };

  const openUserResponses = (user) => {
    setSelectedUser(user);
    fetchUserResponses(user.id);
  };

  const closeUserResponses = () => {
    setSelectedUser(null);
    setUserResponses([]);
  };

  const openEditUser = (user) => {
    setEditingUser(user);
    setEditForm({
      username: user.username || '',
      full_name: user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
      email: user.email || '',
      phone_number: user.phone_number || '',
      address: user.address || '',
      country: user.country || '',
      state_of_origin: user.state_of_origin || '',
      state_of_residence: user.state_of_residence || '',
      lga: user.lga || '',
      community: user.community || '',
      role: user.role || 'member',
      kyc_status: user.kyc_status || 'pending',
    });
  };

  const closeEditUser = () => {
    setEditingUser(null);
    setEditForm({});
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setSavingUser(true);
    try {
      await axios.patch(
        `${API_BASE_URL}/users/create_user/${editingUser.id}/`,
        editForm,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchUsers();
      closeEditUser();
    } catch (err) {
      console.error(err);
    } finally {
      setSavingUser(false);
    }
  };

  const getStatusBadge = (user) => {
    if (user.is_banned) return <span className="bg-red-500/20 text-red-300 px-2 py-1 rounded text-xs">Banned</span>;
    if (user.is_suspended) return <span className="bg-orange-500/20 text-orange-300 px-2 py-1 rounded text-xs">Suspended</span>;
    return <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">Active</span>;
  };

  const getRoleBadge = (role) => {
    const colors = {
      member: 'bg-gray-500/20 text-gray-300',
      support_staff: 'bg-blue-500/20 text-blue-300',
      finance_manager: 'bg-green-500/20 text-green-300',
      admin: 'bg-purple-500/20 text-purple-300',
      super_admin: 'bg-yellow-500/20 text-yellow-300',
    };
    return <span className={`px-2 py-1 rounded text-xs ${colors[role] || 'bg-gray-500/20 text-gray-300'}`}>{role}</span>;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-yellow-400">User Management</h1>
        <div className="text-gray-400">{total} users</div>
      </div>
      <form onSubmit={handleSearch} className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, username, phone... "
          className="flex-1 bg-black p-3 rounded-xl border border-gray-700 text-white min-w-[200px]"
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-black p-3 rounded-xl border border-gray-700 text-white">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="bg-black p-3 rounded-xl border border-gray-700 text-white">
          <option value="">All Roles</option>
          {ROLE_CHOICES.map((r) => (
            <option key={r.value} value={r.value}>{r.label}</option>
          ))}
        </select>
        <button type="submit" className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-500 transition-colors">Search</button>
      </form>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-3 text-gray-400">ID</th>
              <th className="text-left p-3 text-gray-400">Name</th>
              <th className="text-left p-3 text-gray-400">Email</th>
              <th className="text-left p-3 text-gray-400">Role</th>
              <th className="text-left p-3 text-gray-400">Status</th>
              <th className="text-left p-3 text-gray-400">KYC</th>
              <th className="text-left p-3 text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="p-3 text-gray-400">{user.id}</td>
                <td className="p-3">{user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.username}</td>
                <td className="p-3 text-gray-400">{user.email}</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    {getRoleBadge(user.role)}
                    <select
                      value={user.role}
                      onChange={(e) => handleAssignRole(user.id, e.target.value)}
                      className="bg-black border border-gray-700 text-white text-xs rounded px-2 py-1"
                    >
                      {ROLE_CHOICES.map((r) => (
                        <option key={r.value} value={r.value}>{r.label}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="p-3">{getStatusBadge(user)}</td>
                <td className="p-3"><span className={`px-2 py-1 rounded text-xs ${user.kyc_status === 'approved' ? 'bg-green-500/20 text-green-300' : user.kyc_status === 'rejected' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'}`}>{user.kyc_status}</span></td>
                <td className="p-3">
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => handleAction(user.id, 'activate')} 
                      className="text-green-400 hover:text-green-300 text-xs"
                    >
                      Activate
                    </button>
                    <button 
                      onClick={() => handleAction(user.id, user.is_suspended ? 'activate' : 'suspend')} 
                      className={`${
                        user.is_suspended 
                          ? 'text-green-400 hover:text-green-300' 
                          : 'text-orange-400 hover:text-orange-300'
                      } text-xs font-medium`}
                    >
                      {user.is_suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    
                    {!user.is_banned && (
                      <button 
                        onClick={() => handleAction(user.id, 'ban')} 
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Ban
                      </button>
                    )}
                    {user.is_banned && (
                      <button 
                        onClick={() => handleAction(user.id, 'unban')} 
                        className="text-green-400 hover:text-green-300 text-xs"
                      >
                        Unban
                      </button>
                    )}
                    {user.is_suspended && !user.is_banned && (
                      <button 
                        onClick={() => handleAction(user.id, 'unsuspend')} 
                        className="text-yellow-400 hover:text-yellow-300 text-xs"
                      >
                        Unsuspend
                      </button>
                    )}
                    
                    <button 
                      onClick={() => handleAction(user.id, 'reset_password')} 
                      className="text-purple-400 hover:text-purple-300 text-xs"
                    >
                      Reset PW
                    </button>
                    <button 
                      onClick={() => openEditUser(user)} 
                      className="text-blue-400 hover:text-blue-300 text-xs"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => openUserResponses(user)} 
                      className="text-yellow-400 hover:text-yellow-300 text-xs"
                    >
                      Event RSVPs
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingUser && (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6' onClick={closeEditUser}>
          <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-2xl font-bold text-yellow-400'>Edit Member Profile</h3>
                <p className='text-gray-400 text-sm'>{editingUser.full_name || editingUser.email}</p>
              </div>
              <button onClick={closeEditUser} className='text-gray-400 hover:text-white text-xl'>✕</button>
            </div>
            <form onSubmit={handleEditUser} className='grid md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Full Name</label>
                <input value={editForm.full_name || ''} onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Username</label>
                <input value={editForm.username || ''} onChange={(e) => setEditForm({ ...editForm, username: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Email</label>
                <input type='email' value={editForm.email || ''} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Phone</label>
                <input value={editForm.phone_number || ''} onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Country</label>
                <input value={editForm.country || ''} onChange={(e) => setEditForm({ ...editForm, country: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>State Chapter</label>
                <input value={editForm.state_of_origin || ''} onChange={(e) => setEditForm({ ...editForm, state_of_origin: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>State of Residence</label>
                <input value={editForm.state_of_residence || ''} onChange={(e) => setEditForm({ ...editForm, state_of_residence: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>LGA</label>
                <input value={editForm.lga || ''} onChange={(e) => setEditForm({ ...editForm, lga: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Community</label>
                <input value={editForm.community || ''} onChange={(e) => setEditForm({ ...editForm, community: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Address</label>
                <input value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white' />
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>Role</label>
                <select value={editForm.role || 'member'} onChange={(e) => setEditForm({ ...editForm, role: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white'>
                  {ROLE_CHOICES.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className='block text-sm text-gray-400 mb-1'>KYC Status</label>
                <select value={editForm.kyc_status || 'pending'} onChange={(e) => setEditForm({ ...editForm, kyc_status: e.target.value })} className='w-full bg-black p-3 rounded-xl border border-gray-700 text-white'>
                  <option value='pending'>Pending</option>
                  <option value='approved'>Approved</option>
                  <option value='rejected'>Rejected</option>
                  <option value='resubmission'>Resubmission Requested</option>
                </select>
              </div>
              <div className='md:col-span-2 flex justify-end gap-3 mt-2'>
                <button type='button' onClick={closeEditUser} className='px-4 py-2 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800'>Cancel</button>
                <button type='submit' disabled={savingUser} className='px-4 py-2 rounded-xl bg-yellow-400 text-gray-900 font-bold hover:bg-yellow-500 disabled:opacity-50'>
                  {savingUser ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedUser && (
        <div className='fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6' onClick={closeUserResponses}>
          <div className='bg-gray-900 p-8 rounded-2xl border border-gray-800 w-full max-w-xl max-h-[90vh] overflow-y-auto' onClick={(e) => e.stopPropagation()}>
            <div className='flex justify-between items-start mb-4'>
              <div>
                <h3 className='text-2xl font-bold text-yellow-400'>Event RSVPs</h3>
                <p className='text-gray-400 text-sm'>{selectedUser.first_name} {selectedUser.last_name} ({selectedUser.email})</p>
              </div>
              <button onClick={closeUserResponses} className='text-gray-400 hover:text-white text-xl'>✕</button>
            </div>
            {loadingResponses ? (
              <p className='text-gray-400 text-sm'>Loading responses...</p>
            ) : userResponses.length > 0 ? (
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-gray-800'>
                      <th className='text-left p-3 text-gray-400'>Event</th>
                      <th className='text-left p-3 text-gray-400'>Response</th>
                      <th className='text-left p-3 text-gray-400'>Message</th>
                      <th className='text-left p-3 text-gray-400'>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userResponses.map((r) => (
                      <tr key={r.id} className='border-b border-gray-800/50 hover:bg-gray-800/30'>
                        <td className='p-3'>{r.event_name || r.event || '-'}</td>
                        <td className='p-3'><span className={`px-2 py-1 rounded text-xs ${r.response_type === 'going' ? 'bg-green-500/20 text-green-300' : r.response_type === 'interested' ? 'bg-blue-500/20 text-blue-300' : 'bg-gray-500/20 text-gray-300'}`}>{r.response_type}</span></td>
                        <td className='p-3 text-gray-400'>{r.message || '-'}</td>
                        <td className='p-3 text-gray-400'>{new Date(r.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className='text-gray-500 text-sm'>No event responses found for this user.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
