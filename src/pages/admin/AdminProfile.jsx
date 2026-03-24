import { useState } from 'react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import Loading from '../../components/common/Loading';
import './AdminProfile.css';
import { useAuth } from '../../store/AuthContext';

const AdminProfile = () => {
    const { user } = useAuth();

  const [profile, setProfile] = useState(user);
      const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  useToastNotifications({ error, success, setError, setSuccess });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleProfileUpdate = async () => {
    try {
      setError('');
      const res = await adminAPI.updateProfile(profile);
      if (res.success) setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Profile update failed');
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setError('');
      const res = await adminAPI.changePassword(passwordData);
      if (res.success) {
        setSuccess('Password updated successfully');
        setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <div className="admin-profile-page">
      <h1 className="page-title">Admin Profile</h1>

      {/* Profile Info */}
      <Card>
        <h2>Profile Information</h2>
        <Input label="Name" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} />
        <Input label="Email" value={profile.email} disabled />
        <Input label="Phone" value={profile.phone || ''} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
        <Button onClick={handleProfileUpdate}>Save Changes</Button>
      </Card>

      {/* Change Password */}
      <Card>
        <h2>Change Password</h2>
        <Input type="password" label="Old Password" value={passwordData.oldPassword}
          onChange={e => setPasswordData({ ...passwordData, oldPassword: e.target.value })} />
        <Input type="password" label="New Password" value={passwordData.newPassword}
          onChange={e => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
        <Input type="password" label="Confirm Password" value={passwordData.confirmPassword}
          onChange={e => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
        <Button variant="info" onClick={handlePasswordChange}>Update Password</Button>
      </Card>
    </div>
  );
};

export default AdminProfile;
