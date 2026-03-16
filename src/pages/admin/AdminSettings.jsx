import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Switch from '../../components/common/Switch';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { adminAPI } from '../../api/admin.api';
import './AdminSettings.css';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await adminAPI.getSettings();
      if (res.success) setSettings(res.data);
    } catch {
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      const res = await adminAPI.updateSettings(settings);
      if (res.success) setSuccess('Settings updated successfully');
    } catch {
      setError('Failed to update settings');
    }
  };

  if (loading) return <Loading size="lg" />;

  return (
    <div className="admin-settings-page">
      <h1 className="page-title">Admin Settings</h1>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {/* General Settings */}
      <Card>
        <h2>General Settings</h2>
        <Input
          label="Application Name"
          value={settings.appName}
          onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
        />
        <Input
          label="Support Email"
          value={settings.supportEmail}
          onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
        />
        <Input
          label="Support Phone"
          value={settings.supportPhone}
          onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
        />
      </Card>

      {/* Order Settings */}
      <Card>
        <h2>Order Settings</h2>
        <Input
          type="number"
          label="Minimum Order Amount"
          value={settings.minOrderAmount}
          onChange={(e) => setSettings({ ...settings, minOrderAmount: e.target.value })}
        />
        <Input
          type="number"
          label="Delivery Charge"
          value={settings.deliveryCharge}
          onChange={(e) => setSettings({ ...settings, deliveryCharge: e.target.value })}
        />
        <Input
          type="number"
          label="Tax Percentage (%)"
          value={settings.taxPercent}
          onChange={(e) => setSettings({ ...settings, taxPercent: e.target.value })}
        />
      </Card>

      {/* Feature Toggles */}
      <Card>
        <h2>Feature Controls</h2>

        <Switch
          label="Accept Orders"
          checked={settings.isOrderEnabled}
          onChange={(val) => setSettings({ ...settings, isOrderEnabled: val })}
        />

        <Switch
          label="Cash on Delivery"
          checked={settings.isCodEnabled}
          onChange={(val) => setSettings({ ...settings, isCodEnabled: val })}
        />

        <Switch
          label="Restaurant Signup"
          checked={settings.isRestaurantSignupEnabled}
          onChange={(val) =>
            setSettings({ ...settings, isRestaurantSignupEnabled: val })
          }
        />
      </Card>

      <div className="settings-actions">
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
};

export default AdminSettings;
