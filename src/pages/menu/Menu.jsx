import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import { menuAPI } from '../../api/menu.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import Textarea from '../../components/common/Textarea';
import Select from '../../components/common/Select';
import ImageUpload from '../../components/common/ImageUpload';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import Toggle from '../../components/common/Toggle';
import { formatCurrency } from '../../utils/format';
import { useAuth } from '../../store/AuthContext';
import './Menu.css';

const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  price: '',
  category: '',
  isAvailable: true,
  foodType: 'veg',
  preparationTime: '',
};

const FOOD_TYPE_OPTIONS = [
  { value: 'veg', label: 'Veg' },
  { value: 'nonVeg', label: 'Non-Veg' },
  { value: 'jain', label: 'Jain' },
];

const normalizeFoodType = (value) => {
  if (typeof value !== 'string') {
    return null;
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === 'veg' || normalizedValue === 'vegetarian') {
    return 'veg';
  }

  if (['nonveg', 'non-veg', 'non_veg'].includes(normalizedValue)) {
    return 'nonVeg';
  }

  if (normalizedValue === 'jain') {
    return 'jain';
  }

  return null;
};

const getFoodTypeValue = (item) => {
  const normalizedFoodType = normalizeFoodType(item?.foodType);

  if (normalizedFoodType) {
    return normalizedFoodType;
  }

  if (typeof item?.isVeg === 'boolean') {
    return item.isVeg ? 'veg' : 'nonVeg';
  }

  return 'veg';
};

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const { isRestaurant } = useAuth();
  const [formData, setFormData] = useState({ ...DEFAULT_FORM_DATA });
  const [menuImage, setMenuImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await menuAPI.getAllMenuItems();
      if (response.success) {
        setMenuItems(response.data.menus || []);
      } else {
        setError('Failed to load menu items');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name || '',
        description: item.description || '',
        price: item.price || '',
        category: item.category || '',
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        foodType: getFoodTypeValue(item),
        preparationTime: item.preparationTime || '',
      });
      setCurrentImageUrl(item.imageUrl || null);
      setMenuImage(null); // Reset new image file
    } else {
      setEditingItem(null);
      setFormData({ ...DEFAULT_FORM_DATA });
      setCurrentImageUrl(null);
      setMenuImage(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ ...DEFAULT_FORM_DATA });
    setCurrentImageUrl(null);
    setMenuImage(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        preparationTime: parseInt(formData.preparationTime) || 0,
        isVeg: formData.foodType !== 'nonVeg',
      };

      if (editingItem) {
        const response = await menuAPI.updateMenuItem(editingItem.id, submitData, menuImage);
        if (response.success) {
          await fetchMenuItems();
          handleCloseModal();
        } else {
          setError('Failed to update menu item');
        }
      } else {
        const response = await menuAPI.createMenuItem(submitData, menuImage);
        if (response.success) {
          await fetchMenuItems();
          handleCloseModal();
        } else {
          setError('Failed to create menu item');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save menu item');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    try {
      setError('');
      const response = await menuAPI.deleteMenuItem(id);
      if (response.success) {
        await fetchMenuItems();
      } else {
        setError('Failed to delete menu item');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete menu item');
    }
  };

  const categoryOptions = [
    { value: 'Pizza', label: 'Pizza' },
    { value: 'Salads', label: 'Salads' },
    { value: 'Appetizers', label: 'Appetizers' },
    { value: 'Main Course', label: 'Main Course' },
    { value: 'Desserts', label: 'Desserts' },
    { value: 'Beverages', label: 'Beverages' },
  ];

  const modalFooter = (
    <>
      <Button variant="outline" onClick={handleCloseModal}>
        Cancel
      </Button>
      <Button onClick={handleSubmit} loading={submitting}>
        {editingItem ? 'Update' : 'Create'} Menu Item
      </Button>
    </>
  );

  return (
    <div className="menu-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menu Management</h1>
          <p className="page-subtitle">Manage your restaurant menu items</p>
        </div>
        {isRestaurant && (
          <Button onClick={() => handleOpenModal()}>
            <Plus size={18} />
            Add Menu Item
          </Button>
        )}
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}

      {loading ? (
        <div className="loading-container">
          <Loading size="lg" />
        </div>
      ) : (
        <Card>
          {menuItems.length > 0 ? (
            <div className="menu-grid">
              {menuItems.map((item) => (
                <div key={item.id} className="menu-item-card">
                  <div className="menu-item-image">
                    {item.imageUrl ? (
                      <>
                        <img src={item.imageUrl} alt={item.name} onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }} />
                        <div className="menu-item-image-placeholder" style={{ display: 'none' }}>
                          <ImageIcon size={32} />
                        </div>
                      </>
                    ) : (
                      <div className="menu-item-image-placeholder">
                        <ImageIcon size={32} />
                      </div>
                    )}
                    <StatusBadge status={item.isAvailable} type="availability" className="menu-item-badge" />
                    <StatusBadge
                      status={item.foodType ?? item.isVeg}
                      type="itemtype"
                      className="menu-item-badge"
                    />
                  </div>
                  <div className="menu-item-content">
                    <h3 className="menu-item-name">{item.name}</h3>
                    <p className="menu-item-description">{item.description}</p>
                    <div className="menu-item-footer">
                      <div>
                        <p className="menu-item-price">{formatCurrency(item.price)}</p>
                        {item.category && (
                          <p className="menu-item-category">{item.category}</p>
                        )}
                      </div>
                      <div className="menu-item-actions">
                        {isRestaurant ? (<>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenModal(item)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </>) : (
                          item.restaurant?.name
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No menu items found</h3>
              <p>Get started by adding your first menu item.</p>
              <Button onClick={() => handleOpenModal()} className="mt-4">
                <Plus size={18} />
                Add Your First Menu Item
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingItem ? 'Edit Menu Item' : 'Add Menu Item'}
        size="lg"
        footer={modalFooter}
      >
        <form onSubmit={handleSubmit} className="menu-form">
          <div className="form-grid">
            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Margherita Pizza"
              required
            />

            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categoryOptions}
              required
            />
          </div>

          <Textarea
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe the menu item"
            rows={3}
          />

          <div className="form-grid">
            <Input
              label="Price"
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              required
            />

            <Input
              label="Preparation Time (minutes)"
              type="number"
              name="preparationTime"
              value={formData.preparationTime}
              onChange={handleChange}
              placeholder="20"
            />
          </div>

          <ImageUpload
            label="Menu Item Image"
            value={menuImage}
            onChange={setMenuImage}
            previewUrl={currentImageUrl}
          />

          <div className="checkbox-group">
            <Toggle
              checked={formData.isAvailable}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isAvailable: e.target.checked,
                }))
              }
              label="Available"
              size="md"
            />
          </div>

          <div className="food-type-group">
            <span className="food-type-label">Food Type</span>
            <div className="food-type-options">
              {FOOD_TYPE_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`food-type-option ${formData.foodType === option.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="foodType"
                    value={option.value}
                    checked={formData.foodType === option.value}
                    onChange={handleChange}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>


        </form>
      </Modal>
    </div>
  );
};

export default Menu;
