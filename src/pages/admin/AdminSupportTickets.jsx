import { useEffect, useMemo, useRef, useState } from 'react';
import {
  CircleAlert,
  LifeBuoy,
  Mail,
  MessageSquareMore,
  Phone,
  Search,
  UserRound,
} from 'lucide-react';
import { adminAPI } from '../../api/admin.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import Textarea from '../../components/common/Textarea';
import Loading from '../../components/common/Loading';
import { useToastNotifications } from '../../hooks/useToastNotifications';
import StatusBadge from '../../components/common/StatusBadge';
import './AdminSupportTickets.css';

const STATUS_OPTIONS = [
  { value: '', label: 'All Statuses' },
  { value: 'open', label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

const USER_TYPE_OPTIONS = [
  { value: '', label: 'All User Types' },
  { value: 'customer', label: 'Customer' },
  { value: 'delivery_partner', label: 'Delivery Partner' },
];

const REPLY_STATUS_OPTIONS = STATUS_OPTIONS.filter((option) => option.value);

const DEFAULT_REPLY_FORM = {
  message: '',
  status: 'in_progress',
};

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

const getTicketPayload = (response) =>
  response?.data?.ticket ||
  response?.data ||
  response?.ticket ||
  null;

const getMessages = (ticket) =>
  ticket?.messages || ticket?.conversation || ticket?.data?.messages || [];

const formatUserType = (value) =>
  value === 'delivery_partner' ? 'Delivery Partner' : 'Customer';

const formatDateTime = (value) => {
  if (!value) {
    return 'N/A';
  }

  return new Date(value).toLocaleString();
};

const AdminSupportTickets = () => {
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [replySubmitting, setReplySubmitting] = useState(false);
  const [statusSubmitting, setStatusSubmitting] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    user_type: '',
    search: '',
    page: 1,
    limit: 20,
  });
  const [replyForm, setReplyForm] = useState(DEFAULT_REPLY_FORM);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const threadEndRef = useRef(null);

  useToastNotifications({ error, success, setError, setSuccess });

  useEffect(() => {
    fetchTickets();
  }, [filters.status, filters.user_type, filters.search]);

  useEffect(() => {
    if (selectedTicketId) {
      fetchTicketDetails(selectedTicketId);
    }
  }, [selectedTicketId]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  const stats = useMemo(
    () => ({
      total: tickets.length,
      open: tickets.filter((ticket) => ticket.status === 'open').length,
      inProgress: tickets.filter((ticket) => ticket.status === 'in_progress').length,
      resolved: tickets.filter((ticket) => ticket.status === 'resolved').length,
    }),
    [tickets]
  );

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getSupportTickets(filters);
      const nextTickets = getCollection(response, 'tickets');
      setTickets(nextTickets);

      if (!selectedTicketId && nextTickets.length > 0) {
        setSelectedTicketId(nextTickets[0].id);
      }

      if (selectedTicketId && !nextTickets.some((ticket) => ticket.id === selectedTicketId)) {
        setSelectedTicketId(nextTickets[0]?.id || null);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load support tickets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId) => {
    try {
      setDetailLoading(true);
      setError('');
      const response = await adminAPI.getSupportTicketById(ticketId);
      const ticket = getTicketPayload(response);
      setSelectedTicket(ticket ? { ...ticket, messages: getMessages(ticket) } : null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load support ticket details');
    } finally {
      setDetailLoading(false);
    }
  };

  const updateTicketInList = (ticketId, updates) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updates } : ticket))
    );
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      page: 1,
    }));
  };

  const handleSelectTicket = (ticketId) => {
    setSelectedTicketId(ticketId);
    setSuccess('');
    setError('');
  };

  const handleReplyChange = (e) => {
    const { name, value } = e.target;
    setReplyForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    if (!selectedTicket) {
      return;
    }

    const message = replyForm.message.trim();
    if (!message) {
      setError('Reply message is required');
      return;
    }

    try {
      setReplySubmitting(true);
      setError('');
      setSuccess('');

      const response = await adminAPI.replyToSupportTicket(selectedTicket.id, {
        message,
        status: replyForm.status || 'in_progress',
        attachments: [],
      });

      const replyData =
        response?.data?.message ||
        response?.data?.reply ||
        response?.message ||
        response?.reply ||
        null;

      const nextStatus = response?.data?.ticket?.status || replyForm.status || 'in_progress';

      setSelectedTicket((prev) => ({
        ...(prev || {}),
        status: nextStatus,
        updatedAt: new Date().toISOString(),
        messages: replyData ? [...(prev?.messages || []), replyData] : prev?.messages || [],
      }));

      updateTicketInList(selectedTicket.id, {
        status: nextStatus,
        updatedAt: new Date().toISOString(),
      });

      setReplyForm({
        message: '',
        status: nextStatus === 'open' ? 'in_progress' : nextStatus,
      });
      setSuccess('Reply sent successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reply to support ticket');
    } finally {
      setReplySubmitting(false);
    }
  };

  const handleStatusChange = async (e) => {
    const nextStatus = e.target.value;

    if (!selectedTicket || !nextStatus || nextStatus === selectedTicket.status) {
      return;
    }

    try {
      setStatusSubmitting(true);
      setError('');
      setSuccess('');
      const response = await adminAPI.updateSupportTicketStatus(selectedTicket.id, {
        status: nextStatus,
      });

      const resolvedStatus = response?.data?.status || nextStatus;

      setSelectedTicket((prev) => ({
        ...prev,
        status: resolvedStatus,
        updatedAt: new Date().toISOString(),
      }));
      updateTicketInList(selectedTicket.id, {
        status: resolvedStatus,
        updatedAt: new Date().toISOString(),
      });
      setReplyForm((prev) => ({
        ...prev,
        status: resolvedStatus === 'open' ? 'in_progress' : resolvedStatus,
      }));
      setSuccess('Ticket status updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket status');
    } finally {
      setStatusSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="admin-support-tickets-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Support Tickets</h1>
          <p className="page-subtitle">Review user issues, manage ticket status, and send admin replies</p>
        </div>
      </div>

      <div className="support-stats-grid">
        <Card className="support-stat-card">
          <div className="support-stat-content">
            <p className="support-stat-label">Visible Tickets</p>
            <h3 className="support-stat-value">{stats.total}</h3>
          </div>
        </Card>
        <Card className="support-stat-card">
          <div className="support-stat-content">
            <p className="support-stat-label">Open</p>
            <h3 className="support-stat-value">{stats.open}</h3>
          </div>
        </Card>
        <Card className="support-stat-card">
          <div className="support-stat-content">
            <p className="support-stat-label">In Progress</p>
            <h3 className="support-stat-value">{stats.inProgress}</h3>
          </div>
        </Card>
        <Card className="support-stat-card">
          <div className="support-stat-content">
            <p className="support-stat-label">Resolved</p>
            <h3 className="support-stat-value">{stats.resolved}</h3>
          </div>
        </Card>
      </div>

      <Card className="filters-card">
        <div className="filters-grid">
          <div className="filter-group">
            <label className="form-label">Search</label>
            <div className="ticket-search-input">
              <Search size={18} />
              <input
                type="text"
                className="form-input"
                placeholder="Search ticket number, subject, category..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
          <div className="filter-group">
            <Select
              label="Status"
              name="status"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              options={STATUS_OPTIONS}
            />
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
        </div>
      </Card>

      <div className="support-layout-grid">
        <Card
          className="support-list-card"
          title="Ticket Queue"
          subtitle="Select a ticket to review full details and conversation"
        >
          <div className="support-ticket-list">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                type="button"
                className={`support-ticket-item ${selectedTicketId === ticket.id ? 'active' : ''}`}
                onClick={() => handleSelectTicket(ticket.id)}
              >
                <div className="support-ticket-item-header">
                  <strong>{ticket.ticketNumber}</strong>
                  <StatusBadge status={ticket.status} type="support_ticket" />
                </div>
                <p className="support-ticket-subject">{ticket.subject}</p>
                <div className="support-ticket-meta">
                  <span>{ticket.user?.name || 'Unknown User'}</span>
                  <span>{formatUserType(ticket.user_type)}</span>
                  <span>{ticket.category || 'General'}</span>
                </div>
                <p className="support-ticket-updated">Updated {formatDateTime(ticket.updatedAt)}</p>
              </button>
            ))}
          </div>

          {tickets.length === 0 && (
            <div className="empty-state">
              <LifeBuoy size={44} />
              <h3>No support tickets found</h3>
              <p>Try adjusting the filters to find active conversations.</p>
            </div>
          )}
        </Card>

        <Card
          className="support-detail-card"
          title="Conversation"
          subtitle="Review ticket details, reply as admin, and update status"
        >
          {detailLoading ? (
            <div className="loading-container">
              <Loading size="md" />
            </div>
          ) : selectedTicket ? (
            <div className="support-detail-panel">
              <div className="support-ticket-header">
                <div>
                  <h3>{selectedTicket.subject}</h3>
                  <p className="support-ticket-number">{selectedTicket.ticketNumber}</p>
                </div>
                <div className="support-ticket-header-actions">
                  <StatusBadge status={selectedTicket.status} type="support_ticket" />
                  <Select
                    name="status"
                    value={selectedTicket.status || ''}
                    onChange={handleStatusChange}
                    options={REPLY_STATUS_OPTIONS}
                    placeholder="Update status"
                    disabled={statusSubmitting}
                  />
                </div>
              </div>

              <div className="support-ticket-info-grid">
                <div className="support-info-card">
                  <h4>User Details</h4>
                  <div className="support-info-row">
                    <UserRound size={16} />
                    <span>{selectedTicket.user?.name || 'Unknown User'}</span>
                  </div>
                  <div className="support-info-row">
                    <Mail size={16} />
                    <span>{selectedTicket.user?.email || 'No email available'}</span>
                  </div>
                  <div className="support-info-row">
                    <Phone size={16} />
                    <span>{selectedTicket.user?.phone || 'No phone available'}</span>
                  </div>
                  <div className="support-info-row">
                    <CircleAlert size={16} />
                    <span>{formatUserType(selectedTicket.user_type)}</span>
                  </div>
                </div>

                <div className="support-info-card">
                  <h4>Ticket Details</h4>
                  <div className="support-detail-line">
                    <span>Category</span>
                    <strong>{selectedTicket.category || 'General'}</strong>
                  </div>
                  <div className="support-detail-line">
                    <span>Created</span>
                    <strong>{formatDateTime(selectedTicket.createdAt)}</strong>
                  </div>
                  <div className="support-detail-line">
                    <span>Last Updated</span>
                    <strong>{formatDateTime(selectedTicket.updatedAt)}</strong>
                  </div>
                </div>
              </div>

              <div className="support-description-card">
                <h4>Issue Description</h4>
                <p>{selectedTicket.description || 'No description provided.'}</p>
              </div>

              <div className="support-thread">
                {(selectedTicket.messages || []).map((message) => (
                  <div
                    key={message.id}
                    className={`support-message ${message.senderType === 'admin' ? 'admin' : 'user'}`}
                  >
                    <div className="support-message-meta">
                      <strong>{message.sender?.name || message.senderType || 'Unknown Sender'}</strong>
                      <span>{formatDateTime(message.createdAt)}</span>
                    </div>
                    <p>{message.message}</p>
                    {Array.isArray(message.attachments) && message.attachments.length > 0 && (
                      <div className="support-attachments">
                        {message.attachments.map((attachment, index) => (
                          <span key={`${message.id}-attachment-${index}`} className="attachment-chip">
                            {typeof attachment === 'string'
                              ? attachment
                              : attachment.name || attachment.url || 'Attachment'}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>

              <form className="support-reply-form" onSubmit={handleReplySubmit}>
                <div className="support-reply-topbar">
                  <h4>Reply as Admin</h4>
                  <Select
                    name="status"
                    value={replyForm.status}
                    onChange={handleReplyChange}
                    options={REPLY_STATUS_OPTIONS}
                    placeholder="Reply status"
                  />
                </div>
                <Textarea
                  label="Message"
                  name="message"
                  value={replyForm.message}
                  onChange={handleReplyChange}
                  placeholder="Write your reply to this support ticket"
                  rows={4}
                  required
                />
                <div className="support-reply-actions">
                  <Button type="submit" loading={replySubmitting}>
                    <MessageSquareMore size={16} />
                    Send Reply
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            <div className="empty-state">
              <MessageSquareMore size={44} />
              <h3>No ticket selected</h3>
              <p>Select a support ticket from the queue to review and reply.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminSupportTickets;
