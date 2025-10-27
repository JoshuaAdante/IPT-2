import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Calendar, Shield, Activity, Camera } from 'lucide-react';
import '../../sass/profile.scss';

export default function Profile({ user, onLogout }) {
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Admin User',
    username: user?.username || '',
    role: user?.role || 'Admin',
    personal_info: user?.phone || '',
    tin: user?.tin || '',
    address: user?.address || '',
    email: user?.email || '',
    account_created: user?.created_at || 'Recently',
    last_login: 'System Information',
    user_id: user?.username || 'Admin',
    account_status: 'Active',
    two_fa_enabled: user?.two_fa_enabled || false,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profileData });
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showEnable2FA, setShowEnable2FA] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });
  const [activities, setActivities] = useState([
    { action: 'Logged in', timestamp: '2024-10-20 01:30 AM', ip: '127.0.0.1' },
    { action: 'Updated profile', timestamp: '2024-10-19 03:45 PM', ip: '127.0.0.1' },
    { action: 'Changed settings', timestamp: '2024-10-19 10:20 AM', ip: '127.0.0.1' },
  ]);

  // Update profile data when user prop changes
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || 'Admin User',
        username: user.username || '',
        role: user.role || 'Admin',
        personal_info: user.phone || '',
        tin: user.tin || '',
        address: user.address || '',
        email: user.email || '',
        account_created: user.created_at || 'Recently',
        last_login: 'System Information',
        user_id: user.username || 'Admin',
        account_status: 'Active',
        two_fa_enabled: user.two_fa_enabled || false,
        profile_picture: user.profile_picture || null,
      };
      setProfileData(userData);
      setFormData(userData);
      if (user.profile_picture) {
        setProfilePicturePreview(`/storage/${user.profile_picture}`);
      }
    }
  }, [user]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('user_id', user.id);
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.personal_info);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('tin', formData.tin);
      
      if (profilePicture) {
        formDataToSend.append('profile_picture', profilePicture);
      }

      const response = await axios.post('/api/user/profile/update', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data.success) {
        const updatedUser = response.data.user;
        setProfileData({ ...formData, profile_picture: updatedUser.profile_picture });
        setIsEditing(false);
        setProfilePicture(null);
        
        // Update localStorage with new user data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update profile picture preview
        if (updatedUser.profile_picture) {
          setProfilePicturePreview(`/storage/${updatedUser.profile_picture}`);
        }
        
        alert('✅ Profile updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('❌ Failed to update profile.');
    }
  };

  const handleCancel = () => {
    setFormData({ ...profileData });
    setProfilePicture(null);
    if (profileData.profile_picture) {
      setProfilePicturePreview(`/storage/${profileData.profile_picture}`);
    } else {
      setProfilePicturePreview(null);
    }
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      alert('❌ New passwords do not match!');
      return;
    }
    try {
      const response = await axios.post('/api/user/profile/change-password', {
        user_id: user.id,
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password,
        new_password_confirmation: passwordForm.confirm_password,
      });
      
      if (response.data.success) {
        alert('✅ Password changed successfully!');
        setShowChangePassword(false);
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      }
    } catch (err) {
      console.error('Failed to change password:', err);
      if (err.response && err.response.data.message) {
        alert('❌ ' + err.response.data.message);
      } else {
        alert('❌ Failed to change password.');
      }
    }
  };

  const handleEnable2FA = async () => {
    try {
      // await axios.post('/api/profile/enable-2fa');
      setProfileData({ ...profileData, two_fa_enabled: true });
      alert('✅ 2FA enabled successfully!');
      setShowEnable2FA(false);
    } catch (err) {
      console.error('Failed to enable 2FA:', err);
      alert('❌ Failed to enable 2FA.');
    }
  };

  const handleDisable2FA = async () => {
    try {
      // await axios.post('/api/profile/disable-2fa');
      setProfileData({ ...profileData, two_fa_enabled: false });
      alert('✅ 2FA disabled successfully!');
    } catch (err) {
      console.error('Failed to disable 2FA:', err);
      alert('❌ Failed to disable 2FA.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h2>My Profile</h2>
          <p className="subtitle">Manage your account settings</p>
        </div>
        <button className="btn-edit-profile" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profilePicturePreview ? (
                <img src={profilePicturePreview} alt="Profile" />
              ) : (
                <User size={48} strokeWidth={1.5} />
              )}
              {isEditing && (
                <label htmlFor="profile-picture-input" className="avatar-edit-btn">
                  <Camera size={16} />
                </label>
              )}
            </div>
            <input
              id="profile-picture-input"
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              style={{ display: 'none' }}
            />
            <div className="profile-info">
              <h3>{profileData.name}</h3>
              <p className="role-badge">{profileData.role}</p>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="info-section">
          <h3 className="section-title">Personal Information</h3>
          <div className="info-grid">
            <div className="info-field">
              <label>Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              ) : (
                <p>{profileData.name}</p>
              )}
            </div>
            <div className="info-field">
              <label>Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              ) : (
                <p>{profileData.email}</p>
              )}
            </div>
            <div className="info-field">
              <label>Contact Number</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.personal_info}
                  onChange={(e) => setFormData({ ...formData, personal_info: e.target.value })}
                />
              ) : (
                <p>{profileData.personal_info || 'Not set'}</p>
              )}
            </div>
            <div className="info-field">
              <label>TIN</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.tin}
                  onChange={(e) => setFormData({ ...formData, tin: e.target.value })}
                />
              ) : (
                <p>{profileData.tin || 'Not set'}</p>
              )}
            </div>
            <div className="info-field">
              <label>Address</label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              ) : (
                <p>{profileData.address || 'Not set'}</p>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="edit-actions">
              <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
              <button className="btn-save" onClick={handleSave}>Save Changes</button>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="action-buttons-section">
          <button className="action-btn" onClick={() => setShowChangePassword(true)}>
            <Shield size={20} />
            Change Password
          </button>
          <button className="action-btn" onClick={() => profileData.two_fa_enabled ? handleDisable2FA() : setShowEnable2FA(true)}>
            <Shield size={20} />
            {profileData.two_fa_enabled ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
          <button className="action-btn" onClick={() => setShowActivity(true)}>
            <Activity size={20} />
            View Activity
          </button>
        </div>

        {/* Account Information Box */}
        <div className="account-info-box">
          <div className="account-info-grid">
            <div className="account-info-item">
              <label>Account Created</label>
              <p>{profileData.account_created}</p>
            </div>
            <div className="account-info-item">
              <label>Last Login</label>
              <p>{profileData.last_login}</p>
            </div>
            <div className="account-info-item">
              <label>User ID</label>
              <p>{profileData.user_id}</p>
            </div>
            <div className="account-info-item">
              <label>Account Status</label>
              <span className="status-badge active">{profileData.account_status}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Change Password</h3>
            <div className="modal-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passwordForm.current_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordForm.confirm_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowChangePassword(false)}>Cancel</button>
                <button className="btn-submit" onClick={handleChangePassword}>Change Password</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enable 2FA Modal */}
      {showEnable2FA && (
        <div className="modal-overlay" onClick={() => setShowEnable2FA(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Enable Two-Factor Authentication</h3>
            <div className="modal-form">
              <p style={{ marginBottom: '1.5rem', color: '#6b7280' }}>
                Two-factor authentication adds an extra layer of security to your account.
                You'll need to enter a code from your authenticator app in addition to your password.
              </p>
              <div className="qr-code-section" style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '8px', marginBottom: '1.5rem' }}>
                <div style={{ width: '200px', height: '200px', background: 'white', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #e5e7eb' }}>
                  <p style={{ color: '#9ca3af', margin: 0 }}>QR Code Here</p>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#6b7280' }}>
                  Scan this QR code with your authenticator app
                </p>
              </div>
              <div className="form-group">
                <label>Enter verification code from your app</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  maxLength="6"
                />
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowEnable2FA(false)}>Cancel</button>
                <button className="btn-submit" onClick={handleEnable2FA}>Enable 2FA</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Activity Modal */}
      {showActivity && (
        <div className="modal-overlay" onClick={() => setShowActivity(false)}>
          <div className="modal-content modal-wide" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Account Activity</h3>
            <div className="activity-list">
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Action</th>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map((activity, index) => (
                    <tr key={index}>
                      <td>{activity.action}</td>
                      <td>{activity.timestamp}</td>
                      <td>{activity.ip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="modal-actions">
              <button className="btn-submit" onClick={() => setShowActivity(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
