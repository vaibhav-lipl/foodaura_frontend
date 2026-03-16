import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../api/restaurant.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Alert from '../../components/common/Alert';
import Loading from '../../components/common/Loading';
import { formatCurrency } from '../../utils/format';
import ImageUpload from '../../components/common/ImageUpload';
import './RestaurantOffers.css';

const RestaurantOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialFormState = {
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    startDate: '',
    endDate: '',
    code: '',
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormState);
  const [offerImage, setOfferImage] = useState(null);
  const [currentOfferImageUrl, setCurrentOfferImageUrl] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantAPI.getOffers();
      if (response.success && response.data?.offers) {
        setOffers(response.data.offers);
      }
    } catch (err) {
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setOfferImage(null);
    setCurrentOfferImageUrl(null);
  };

  const handleOpenModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        minOrderAmount: parseFloat(formData.minOrderAmount),
        maxDiscount: parseFloat(formData.maxDiscount || 0),
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isActive: Boolean(formData.isActive)
      };

      const response = await restaurantAPI.createOffer(
        submitData,
        offerImage
      );

      if (response.success) {
        setSuccess('Offer created successfully');
        await fetchOffers();
        handleCloseModal();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create offer');
    } finally {
      setSubmitting(false);
    }
  };


  const discountTypeOptions = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' }
  ];

  const modalFooter = (
    <>
      <Button variant="outline" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} loading={submitting}>
        Create Offer
      </Button>
    </>
  );

  return (
    <div className="offers-page">
      <div className="page-header">
        <div>
          <Link to="/restaurant">
            <Button variant="outline" size="sm">← Back to Profile</Button>
          </Link>
          <h1 className="page-title">Offers & Promotions</h1>
          <p className="page-subtitle">Create and manage promotional offers</p>
        </div>
        <Button onClick={handleOpenModal}>Create Offer</Button>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      {loading ? (
        <Card>
          <div className="loading-container">
            <Loading size="lg" />
          </div>
        </Card>
      ) : (
        <Card>
          {offers.length > 0 ? (
            <div className="offers-list">
              {offers.map((offer) => (
                <div key={offer.id} className="offer-card">
                  <div className="offer-header">
                    <div>
                      <h3 className="offer-title">{offer.title}</h3>
                      <p className="offer-description">{offer.description}</p>
                    </div>
                    <StatusBadge status={offer.isActive} type="availability" />
                  </div>

                  {offer.imageSmall && (
                    <img
                      src={offer.imageSmall}
                      alt={offer.title}
                      className="offer-image"
                    />
                  )}

                  <div className="offer-details">
                    <div className="offer-detail-item">
                      <span className="offer-detail-label">Discount</span>
                      <span className="offer-detail-value">
                        {offer.discountType === 'percentage'
                          ? `${offer.discountValue}%`
                          : formatCurrency(offer.discountValue)}
                      </span>
                    </div>

                    <div className="offer-detail-item">
                      <span className="offer-detail-label">Min Order</span>
                      <span className="offer-detail-value">
                        {formatCurrency(offer.minOrderAmount)}
                      </span>
                    </div>

                    <div className="offer-detail-item">
                      <span className="offer-detail-label">Code</span>
                      <span className="offer-detail-value offer-code">
                        {offer.code}
                      </span>
                    </div>

                    <div className="offer-detail-item">
                      <span className="offer-detail-label">Valid Until</span>
                      <span className="offer-detail-value">
                        {new Date(offer.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🎁</div>
              <h3>No offers created yet</h3>
              <p>Create your first promotional offer to attract more customers.</p>
              <Button onClick={handleOpenModal} className="mt-4">
                Create Your First Offer
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Create Offer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create Offer"
        size="lg"
        footer={modalFooter}
      >
        <form onSubmit={handleSubmit} className="offer-form">
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />

          <ImageUpload
            label="Offer Image"
            value={offerImage}
            onChange={setOfferImage}
            previewUrl={currentOfferImageUrl}
          />

          <div className="form-grid">
            <Select
              label="Discount Type"
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              options={discountTypeOptions}
            />

            <Input
              label="Discount Value"
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
            />
          </div>

          <div className="form-grid">
            <Input
              label="Minimum Order Amount"
              type="number"
              name="minOrderAmount"
              value={formData.minOrderAmount}
              onChange={handleChange}
            />

            <Input
              label="Maximum Discount"
              type="number"
              name="maxDiscount"
              value={formData.maxDiscount}
              onChange={handleChange}
            />
          </div>

          <Input
            label="Promo Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
          />

          <div className="form-grid">
            <Input
              label="Start Date"
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
            />

            <Input
              label="End Date"
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              <span>Active</span>
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default RestaurantOffers;
