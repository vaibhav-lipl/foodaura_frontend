import { useState, useEffect } from 'react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { Search, User, Phone, Mail, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './AdminDeliveryPartners.css';

const AdminDeliveryPartners = () => {
    const navigate = useNavigate();
    const [deliveryPartners, setDeliveryPartners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({
        isActive: '',
        search: '',
        page: 1,
        limit: 20,
    });

    useToastNotifications({ error, success, setError, setSuccess });

  useEffect(() => {
        fetchDeliveryPartners();
    }, [filters]);

    const fetchDeliveryPartners = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await adminAPI.getDeliveryPartners(filters);

            if (response.success) {
                setDeliveryPartners(response.data.deliveryPartners || []);
            } else {
                setError('Failed to load delivery partners');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load delivery partners');
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (name, value) => {
        setFilters((prev) => ({
            ...prev,
            [name]: value,
            page: 1,
        }));
    };

    const handleStatusChange = async (partnerId, newStatus) => {
        try {
            setError('');

            const response = await adminAPI.updateDeliveryPartnerStatus(
                partnerId,
                { status: newStatus }
            );

            if (response.success) {
                setSuccess(`Delivery partner marked as ${newStatus}`);
                fetchDeliveryPartners();
            } else {
                setError(response.message || 'Failed to update status');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update status');
        }
    };

    const statusOptions = [
        { label: 'Approved', value: 'active' },
        { label: 'Pending', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
    ];

    if (loading && deliveryPartners.length === 0) {
        return (
            <div className="loading-container">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="admin-restaurants-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Delivery Partner Management</h1>
                    <p className="page-subtitle">Manage delivery partners and approvals</p>
                </div>
            </div>

            {/* Filters */}
            <Card className="filters-card">
                <div className="filters-grid">
                    <div className="filter-group">
                        <Input
                            label="Search"
                            type="text"
                            placeholder="Search by name or phone..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <Select
                            label="Active Status"
                            name="isActive"
                            value={filters.isActive}
                            onChange={(e) => handleFilterChange('isActive', e.target.value)}
                            options={statusOptions}
                        />
                    </div>
                </div>
            </Card>

            {/* Delivery Partners Grid */}
            <div className="restaurants-grid">
                {deliveryPartners.map((partner) => (
                    <Card key={partner.id} className="restaurant-card">
                        <div className="restaurant-card-header">
                            <div className="restaurant-info">
                                <div className="restaurant-icon">
                                    <User size={24} />
                                </div>
                                <div>
                                    <h3 className="restaurant-name">{partner.fullName}</h3>
                                </div>
                            </div>

                            <div className="restaurant-statuses">
                                <StatusBadge status={partner.isOnline} type="delivery_partner" />
                            </div>
                        </div>

                        <div className="restaurant-details">
                            <div className="details-head">
                            {partner.phoneNumber && (
                                <div className="detail-item">
                                    <Phone size={16} />
                                    <span>{partner.phoneNumber}</span>
                                </div>
                            )}

                            <Button
                                variant="info"
                                size="sm"
                                onClick={() => navigate(`/admin/delivery-partners/${partner.userId}`)}
                                >
                                <Eye size={14} />
                            </Button>

                            </div>

                            {partner.email && (
                                <div className="detail-item">
                                    <Mail size={16} />
                                    <span>{partner.email}</span>
                                </div>
                            )}
                        </div>
                        <div className="restaurant-actions">
                            <Select
                                label="Status"
                                name="status"
                                value={partner.status}
                                onChange={(e) =>
                                    handleStatusChange(partner.id, e.target.value)
                                }
                                options={statusOptions}
                            />
                        </div>

                    </Card>
                ))}
            </div>

            {deliveryPartners.length === 0 && (
                <Card>
                    <div className="empty-state">
                        <User size={48} />
                        <h3>No delivery partners found</h3>
                        <p>Try adjusting your filters.</p>
                    </div>
                </Card>
            )}

        </div>
    );
};

export default AdminDeliveryPartners;
