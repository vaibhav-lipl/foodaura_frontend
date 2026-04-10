import { useEffect, useMemo, useState } from 'react';
import {
  CircleHelp,
  Edit,
  Layers3,
  Plus,
  Search,
  Trash2,
  UserRound,
  Bike,
} from 'lucide-react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Modal from '../../components/common/Modal';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import { confirmDelete, showDeleteSuccess } from '../../utils/sweetAlert';
import './AdminFaqs.css';

const NEW_MODULE_VALUE = '__new__';

const EMPTY_FAQ_FORM = {
  moduleId: '',
  newModuleName: '',
  user_type: 'customer',
  question: '',
  answer: '',
};

const EMPTY_MODULE_FORM = {
  name: '',
};

const USER_TYPE_OPTIONS = [
  { value: '', label: 'All User Types' },
  { value: 'customer', label: 'Customer' },
  { value: 'delivery_partner', label: 'Delivery Partner' },
];

const FAQ_USER_TYPE_OPTIONS = USER_TYPE_OPTIONS.filter((option) => option.value);

const getCollection = (value, fallbackKey) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (fallbackKey && Array.isArray(value?.[fallbackKey])) {
    return value[fallbackKey];
  }

  if (Array.isArray(value?.data)) {
    return value.data;
  }

  if (Array.isArray(value?.data?.[fallbackKey])) {
    return value.data[fallbackKey];
  }

  return [];
};

const getModuleName = (item) =>
  item.module_data?.name ||
  item.moduleData?.name ||
  item.module?.name ||
  item.moduleName ||
  item.name ||
  'Unassigned';

const getModuleId = (item) =>
  item.module_data?.id ||
  item.moduleData?.id ||
  item.module?.id ||
  item.moduleId ||
  item.id;

const AdminFaqs = () => {
  const [loading, setLoading] = useState(true);
  const [submittingFaq, setSubmittingFaq] = useState(false);
  const [submittingModule, setSubmittingModule] = useState(false);
  const [faqs, setFaqs] = useState([]);
  const [modules, setModules] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filters, setFilters] = useState({
    user_type: '',
    moduleId: '',
    search: '',
  });
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ_FORM);
  const [moduleForm, setModuleForm] = useState(EMPTY_MODULE_FORM);

  useToastNotifications({ error, success, setError, setSuccess });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [filters.user_type, filters.moduleId]);

  const moduleOptions = useMemo(
    () => [
      ...modules.map((module) => ({
        value: String(getModuleId(module)),
        label: getModuleName(module),
      })),
      { value: NEW_MODULE_VALUE, label: '+ New Module' },
    ],
    [modules]
  );

  const filteredFaqs = useMemo(() => {
    const searchValue = filters.search.trim().toLowerCase();
    if (!searchValue) {
      return faqs;
    }

    return faqs.filter((faq) => {
      const haystack = [
        faq.question,
        faq.answer,
        faq.user_type,
        getModuleName(faq),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return haystack.includes(searchValue);
    });
  }, [faqs, filters.search]);

  const stats = useMemo(
    () => ({
      totalFaqs: faqs.length,
      totalModules: modules.length,
      customerFaqs: faqs.filter((faq) => faq.user_type === 'customer').length,
      partnerFaqs: faqs.filter((faq) => faq.user_type === 'delivery_partner').length,
    }),
    [faqs, modules]
  );

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError('');
      const [modulesResponse, faqsResponse] = await Promise.all([
        adminAPI.getFaqModules(),
        adminAPI.getFaqs(),
      ]);

      setModules(getCollection(modulesResponse, 'modules'));
      setFaqs(getCollection(faqsResponse, 'faqs'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load FAQ management data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFaqs = async () => {
    try {
      setError('');
      const response = await adminAPI.getFaqs({
        user_type: filters.user_type || undefined,
        moduleId: filters.moduleId || undefined,
      });
      setFaqs(getCollection(response, 'faqs'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load FAQs');
    }
  };

  const fetchModules = async () => {
    try {
      setError('');
      const response = await adminAPI.getFaqModules();
      setModules(getCollection(response, 'modules'));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load FAQ modules');
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const openFaqModal = (faq = null) => {
    setError('');
    setSuccess('');
    setEditingFaq(faq);

    if (faq) {
      const selectedModuleId = getModuleId(faq);

      setFaqForm({
        moduleId: selectedModuleId ? String(selectedModuleId) : '',
        newModuleName: '',
        user_type: faq.user_type || 'customer',
        question: faq.question || '',
        answer: faq.answer || '',
      });
    } else {
      setFaqForm(EMPTY_FAQ_FORM);
    }

    setFaqModalOpen(true);
  };

  const closeFaqModal = () => {
    setFaqModalOpen(false);
    setEditingFaq(null);
    setFaqForm(EMPTY_FAQ_FORM);
  };

  const openModuleModal = (module = null) => {
    setError('');
    setSuccess('');
    setEditingModule(module);
    setModuleForm({
      name: module ? getModuleName(module) : '',
    });
    setModuleModalOpen(true);
  };

  const closeModuleModal = () => {
    setModuleModalOpen(false);
    setEditingModule(null);
    setModuleForm(EMPTY_MODULE_FORM);
  };

  const handleFaqChange = (e) => {
    const { name, value } = e.target;

    setFaqForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'moduleId' && value !== NEW_MODULE_VALUE ? { newModuleName: '' } : {}),
    }));
  };

  const handleModuleChange = (e) => {
    const { name, value } = e.target;
    setModuleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();

    const trimmedQuestion = faqForm.question.trim();
    const trimmedAnswer = faqForm.answer.trim();
    const trimmedNewModuleName = faqForm.newModuleName.trim();

    if (!trimmedQuestion || !trimmedAnswer) {
      setError('Question and answer are required');
      return;
    }

    if (!faqForm.moduleId) {
      setError('Please select a module');
      return;
    }

    if (faqForm.moduleId === NEW_MODULE_VALUE && !trimmedNewModuleName) {
      setError('Please enter a new module name');
      return;
    }

    try {
      setSubmittingFaq(true);
      setError('');
      setSuccess('');

      const payload = {
        user_type: faqForm.user_type,
        question: trimmedQuestion,
        answer: trimmedAnswer,
      };

      if (faqForm.moduleId === NEW_MODULE_VALUE) {
        payload.module = trimmedNewModuleName;
      } else {
        payload.moduleId = Number(faqForm.moduleId);
      }

      const response = editingFaq
        ? await adminAPI.updateFaq(editingFaq.id, payload)
        : await adminAPI.createFaq(payload);

      if (response.success) {
        setSuccess(`FAQ ${editingFaq ? 'updated' : 'created'} successfully`);
        closeFaqModal();
        await Promise.all([fetchFaqs(), fetchModules()]);
      } else {
        setError(response.message || `Failed to ${editingFaq ? 'update' : 'create'} FAQ`);
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${editingFaq ? 'update' : 'create'} FAQ`);
    } finally {
      setSubmittingFaq(false);
    }
  };

  const handleModuleSubmit = async (e) => {
    e.preventDefault();

    const trimmedName = moduleForm.name.trim();
    if (!trimmedName) {
      setError('Module name is required');
      return;
    }

    try {
      setSubmittingModule(true);
      setError('');
      setSuccess('');

      const response = editingModule
        ? await adminAPI.updateFaqModule(getModuleId(editingModule), { name: trimmedName })
        : await adminAPI.createFaqModule({ name: trimmedName });

      if (response.success) {
        setSuccess(`FAQ module ${editingModule ? 'updated' : 'created'} successfully`);
        closeModuleModal();
        await fetchModules();
      } else {
        setError(response.message || `Failed to ${editingModule ? 'update' : 'create'} FAQ module`);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          `Failed to ${editingModule ? 'update' : 'create'} FAQ module`
      );
    } finally {
      setSubmittingModule(false);
    }
  };

  const handleDeleteFaq = async (faqId) => {
    const isConfirmed = await confirmDelete({
      text: 'This FAQ entry will be removed and can no longer be shown to users.',
      confirmButtonText: 'Yes, delete FAQ',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setError('');
      const response = await adminAPI.deleteFaq(faqId);
      if (response.success) {
        await fetchFaqs();
        await showDeleteSuccess({
          text: 'The FAQ has been deleted successfully.',
        });
      } else {
        setError(response.message || 'Failed to delete FAQ');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  const handleDeleteModule = async (moduleId) => {
    const isConfirmed = await confirmDelete({
      text: 'This FAQ module and its organization will be removed from the admin panel.',
      confirmButtonText: 'Yes, delete module',
    });

    if (!isConfirmed) {
      return;
    }

    try {
      setError('');
      const response = await adminAPI.deleteFaqModule(moduleId);
      if (response.success) {
        if (filters.moduleId === String(moduleId)) {
          setFilters((prev) => ({ ...prev, moduleId: '' }));
        }
        await Promise.all([fetchModules(), fetchFaqs()]);
        await showDeleteSuccess({
          text: 'The FAQ module has been deleted successfully.',
        });
      } else {
        setError(response.message || 'Failed to delete FAQ module');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete FAQ module');
    }
  };

  const faqModalFooter = (
    <div className="modal-footer-actions">
      <Button variant="secondary" onClick={closeFaqModal}>
        Cancel
      </Button>
      <Button type="submit" onClick={handleFaqSubmit} loading={submittingFaq}>
        {editingFaq ? 'Update FAQ' : 'Create FAQ'}
      </Button>
    </div>
  );

  const moduleModalFooter = (
    <div className="modal-footer-actions">
      <Button variant="secondary" onClick={closeModuleModal}>
        Cancel
      </Button>
      <Button type="submit" onClick={handleModuleSubmit} loading={submittingModule}>
        {editingModule ? 'Update Module' : 'Create Module'}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="admin-faqs-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">FAQ Management</h1>
          <p className="page-subtitle">Manage FAQ modules and support answers for admin users</p>
        </div>
        <div className="faq-header-actions">
          <Button variant="secondary" onClick={() => openModuleModal()}>
            <Layers3 size={18} />
            Add Module
          </Button>
          <Button onClick={() => openFaqModal()}>
            <Plus size={18} />
            Add FAQ
          </Button>
        </div>
      </div>

      <div className="faq-stats-grid">
        <Card className="faq-stat-card">
          <div className="faq-stat-content">
            <div>
              <p className="faq-stat-label">Total FAQs</p>
              <h3 className="faq-stat-value">{stats.totalFaqs}</h3>
            </div>
            <CircleHelp size={24} />
          </div>
        </Card>
        <Card className="faq-stat-card">
          <div className="faq-stat-content">
            <div>
              <p className="faq-stat-label">Total Modules</p>
              <h3 className="faq-stat-value">{stats.totalModules}</h3>
            </div>
            <Layers3 size={24} />
          </div>
        </Card>
        <Card className="faq-stat-card">
          <div className="faq-stat-content">
            <div>
              <p className="faq-stat-label">Customer FAQs</p>
              <h3 className="faq-stat-value">{stats.customerFaqs}</h3>
            </div>
            <UserRound size={24} />
          </div>
        </Card>
        <Card className="faq-stat-card">
          <div className="faq-stat-content">
            <div>
              <p className="faq-stat-label">Delivery FAQs</p>
              <h3 className="faq-stat-value">{stats.partnerFaqs}</h3>
            </div>
            <Bike size={24} />
          </div>
        </Card>
      </div>

      <Card className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="form-label">Search</label>
            <div className="faq-search-input">
              <Search size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Search by question, answer, module..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <Select
              label="User Type"
              name="user_type"
              value={filters.user_type}
              onChange={(e) => handleFilterChange('user_type', e.target.value)}
              options={USER_TYPE_OPTIONS}
            />
          </div>
          <div className="filter-group">
            <Select
              label="Module"
              name="moduleId"
              value={filters.moduleId}
              onChange={(e) => handleFilterChange('moduleId', e.target.value)}
              options={modules.map((module) => ({
                value: String(getModuleId(module)),
                label: getModuleName(module),
              }))}
              placeholder="All Modules"
            />
          </div>
        </div>
      </Card>

      <div className="faq-layout-grid">
        <Card
          className="faq-list-card"
          title="FAQs"
          subtitle="Create, edit, and remove support questions for customer and delivery users"
        >
          <div className="faq-table-wrapper">
            <table className="faq-table">
              <thead>
                <tr>
                  <th>Module</th>
                  <th>User Type</th>
                  <th>Question</th>
                  <th>Answer</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id}>
                    <td>
                      <span className="module-chip">{getModuleName(faq)}</span>
                    </td>
                    <td>
                      <span className={`user-type-badge ${faq.user_type}`}>
                        {faq.user_type === 'delivery_partner' ? 'Delivery Partner' : 'Customer'}
                      </span>
                    </td>
                    <td className="faq-text-cell">
                      <strong>{faq.question}</strong>
                    </td>
                    <td className="faq-text-cell">{faq.answer}</td>
                    <td>
                      <div className="table-actions">
                        <Button variant="secondary" size="sm" onClick={() => openFaqModal(faq)}>
                          <Edit size={16} />
                          Edit
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDeleteFaq(faq.id)}>
                          <Trash2 size={16} />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredFaqs.length === 0 && (
            <div className="empty-state">
              <CircleHelp size={44} />
              <h3>No FAQs found</h3>
              <p>Try changing filters or create a new FAQ entry.</p>
            </div>
          )}
        </Card>

        <Card
          className="faq-modules-card"
          title="FAQ Modules"
          subtitle="Keep module names organized for FAQ grouping and filtering"
          actions={
            <Button size="sm" onClick={() => openModuleModal()}>
              <Plus size={16} />
              Add
            </Button>
          }
        >
          <div className="faq-modules-list">
            {modules.map((module) => (
              <div key={getModuleId(module)} className="faq-module-item">
                <div>
                  <h4>{getModuleName(module)}</h4>
                  <p>ID: {getModuleId(module)}</p>
                </div>
                <div className="table-actions">
                  <Button variant="secondary" size="sm" onClick={() => openModuleModal(module)}>
                    <Edit size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteModule(getModuleId(module))}
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {modules.length === 0 && (
            <div className="empty-state">
              <Layers3 size={44} />
              <h3>No modules found</h3>
              <p>Create your first FAQ module to start organizing help content.</p>
            </div>
          )}
        </Card>
      </div>

      <Modal
        isOpen={faqModalOpen}
        onClose={closeFaqModal}
        title={editingFaq ? 'Edit FAQ' : 'Create FAQ'}
        footer={faqModalFooter}
      >
        <form className="faq-form" onSubmit={handleFaqSubmit}>
          <Select
            label="Module"
            name="moduleId"
            value={faqForm.moduleId}
            onChange={handleFaqChange}
            options={moduleOptions}
            placeholder="Select a module"
            required
          />

          {faqForm.moduleId === NEW_MODULE_VALUE && (
            <Input
              label="New Module Name"
              name="newModuleName"
              value={faqForm.newModuleName}
              onChange={handleFaqChange}
              placeholder="Enter a new FAQ module name"
              required
            />
          )}

          <Select
            label="User Type"
            name="user_type"
            value={faqForm.user_type}
            onChange={handleFaqChange}
            options={FAQ_USER_TYPE_OPTIONS}
            placeholder="Select user type"
            required
          />

          <Input
            label="Question"
            name="question"
            value={faqForm.question}
            onChange={handleFaqChange}
            placeholder="Enter the FAQ question"
            required
          />

          <Textarea
            label="Answer"
            name="answer"
            value={faqForm.answer}
            onChange={handleFaqChange}
            placeholder="Enter the FAQ answer"
            rows={5}
            required
          />
        </form>
      </Modal>

      <Modal
        isOpen={moduleModalOpen}
        onClose={closeModuleModal}
        title={editingModule ? 'Edit FAQ Module' : 'Create FAQ Module'}
        footer={moduleModalFooter}
      >
        <form className="faq-form" onSubmit={handleModuleSubmit}>
          <Input
            label="Module Name"
            name="name"
            value={moduleForm.name}
            onChange={handleModuleChange}
            placeholder="Enter FAQ module name"
            required
          />
        </form>
      </Modal>
    </div>
  );
};

export default AdminFaqs;
