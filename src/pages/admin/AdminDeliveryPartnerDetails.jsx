import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { adminAPI } from '../../api/admin.api';
import './AdminDeliveryPartnerDetails.css';

const tabsList = [
    'profile',
    'vehicle',
    'documents',
    'earnings',
    'payouts',
    'payoutMethods',
    'locations',
    'ratings',
    'schedules'
];

const AdminDeliveryPartnerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);


    useEffect(() => {
        fetchDetails();
    }, [id]);

    const fetchDetails = async () => {
        try {
            setLoading(true);
            const response = await adminAPI.getDeliveryPartnerById(id);
            setData(response.data);
        } catch (err) {
            setError('Failed to load delivery partner details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;
    if (error) return <Alert type="error" message={error} />;

    const {
        deliveryPartnerProfile,
        deliveryPartnerVehicle,
        deliveryPartnerDocuments,
        deliveryPartnerEarnings,
        deliveryPartnerPayouts,
        deliveryPartnerPayoutMethods,
        deliveryPartnerLocations,
        deliveryPartnerRatings,
        deliveryPartnerSchedules
    } = data;

    const renderEmpty = () => <div className="empty-tab">No data available</div>;

    return (
        <div className="admin-details-page">

            {/* Header */}
            <div className="details-header">
                <Button variant="secondary" onClick={() => navigate(-1)}>
                    ← Back
                </Button>
                <h2>{deliveryPartnerProfile?.fullName || 'Delivery Partner Details'}</h2>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
                {tabsList.map(tab => (
                    <button
                        key={tab}
                        className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <Card className="tab-card">

                {/* PROFILE */}
                {activeTab === 'profile' && (
                    deliveryPartnerProfile ? (
                        <div className="grid-2">
                            <Info label="Full Name" value={deliveryPartnerProfile.fullName} />
                            <Info label="Email" value={deliveryPartnerProfile.email} />
                            <Info label="Phone" value={deliveryPartnerProfile.phoneNumber} />
                            <Info label="City" value={deliveryPartnerProfile.city} />
                            <Info label="State" value={deliveryPartnerProfile.state} />
                            <Info label="Status" value={deliveryPartnerProfile.status} />
                            <Info label="Verification" value={deliveryPartnerProfile.verificationStatus} />
                            <Info label="Rating" value={deliveryPartnerProfile.rating} />
                            <Info label="Total Deliveries" value={deliveryPartnerProfile.totalDeliveries} />
                        </div>
                    ) : renderEmpty()
                )}

                {/* VEHICLE */}
                {activeTab === 'vehicle' && (
                    deliveryPartnerVehicle ? (
                        <div className="grid-2">
                            <Info label="Type" value={deliveryPartnerVehicle.type} />
                            <Info label="Make" value={deliveryPartnerVehicle.make} />
                            <Info label="Model" value={deliveryPartnerVehicle.model} />
                            <Info label="Year" value={deliveryPartnerVehicle.year} />
                            <Info label="Registration No" value={deliveryPartnerVehicle.registrationNumber} />
                            <Info label="Color" value={deliveryPartnerVehicle.color} />
                        </div>
                    ) : renderEmpty()
                )}

                {/* DOCUMENTS */}
                {activeTab === 'documents' && (
                    deliveryPartnerDocuments?.length > 0 ? (
                        deliveryPartnerDocuments.map(doc => (
                            <Card key={doc.id} className="inner-card">
                                <div className="grid-2">
                                    <Info label="Name" value={doc.name} />
                                    <Info label="Status" value={doc.status} />
                                    <Info label="Expiry" value={doc.expiryDate} />
                                </div>
                                <Button
                                    size="sm"
                                    variant="info"
                                    onClick={() => {
                                        setSelectedImage(doc.url);
                                        setIsImageModalOpen(true);
                                    }}

                                >
                                    View Document
                                </Button>
                            </Card>
                        ))
                    ) : renderEmpty()
                )}

                {/* EARNINGS */}
                {activeTab === 'earnings' && (
                    deliveryPartnerEarnings?.length > 0
                        ? JSON.stringify(deliveryPartnerEarnings)
                        : renderEmpty()
                )}

                {/* PAYOUTS */}
                {activeTab === 'payouts' && (
                    deliveryPartnerPayouts?.length > 0
                        ? JSON.stringify(deliveryPartnerPayouts)
                        : renderEmpty()
                )}

                {/* PAYOUT METHODS */}
                {activeTab === 'payoutMethods' && (
                    deliveryPartnerPayoutMethods?.length > 0
                        ? JSON.stringify(deliveryPartnerPayoutMethods)
                        : renderEmpty()
                )}

                {/* LOCATIONS */}
                {activeTab === 'locations' && (
                    deliveryPartnerLocations?.length > 0
                        ? JSON.stringify(deliveryPartnerLocations)
                        : renderEmpty()
                )}

                {/* RATINGS */}
                {activeTab === 'ratings' && (
                    deliveryPartnerRatings?.length > 0
                        ? JSON.stringify(deliveryPartnerRatings)
                        : renderEmpty()
                )}

                {/* SCHEDULES */}
                {activeTab === 'schedules' && (
                    deliveryPartnerSchedules?.length > 0
                        ? JSON.stringify(deliveryPartnerSchedules)
                        : renderEmpty()
                )}

            </Card>
            {isImageModalOpen && (
                <div
                    className="image-modal-overlay"
                    onClick={() => setIsImageModalOpen(false)}
                >
                    <div
                        className="image-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="image-modal-close"
                            onClick={() => setIsImageModalOpen(false)}
                        >
                            ×
                        </button>

                        <img
                            src={selectedImage}
                            alt="Document"
                            className="image-preview"
                        />
                    </div>
                </div>
            )}

        </div>
    );
};

const Info = ({ label, value }) => (
    <div className="info-item">
        <span className="info-label">{label}</span>
        <span className="info-value">{value || '-'}</span>
    </div>
);

export default AdminDeliveryPartnerDetails;
