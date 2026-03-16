import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../../api/restaurant.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import Alert from '../../components/common/Alert';
import { formatTime } from '../../utils/format';
import './RestaurantSchedule.css';

const RestaurantSchedule = () => {
  const daysOfWeek = [
    { value: 'monday', label: 'Monday' },
    { value: 'tuesday', label: 'Tuesday' },
    { value: 'wednesday', label: 'Wednesday' },
    { value: 'thursday', label: 'Thursday' },
    { value: 'friday', label: 'Friday' },
    { value: 'saturday', label: 'Saturday' },
    { value: 'sunday', label: 'Sunday' },
  ];

  const [schedules, setSchedules] = useState(
    daysOfWeek.map((day) => ({
      dayOfWeek: day.value,
      openTime: '09:00',
      closeTime: '22:00',
      isClosed: false,
    }))
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSchedule();
  }, []);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await restaurantAPI.getSchedule();
      if (response.success && response.data?.schedules) {
        // Map the fetched schedules to our format
        const fetchedSchedules = response.data.schedules;
        const updatedSchedules = daysOfWeek.map((day) => {
          const fetchedDay = fetchedSchedules.find(
            (s) => s.dayOfWeek === day.value
          );
          return fetchedDay || {
            dayOfWeek: day.value,
            openTime: '09:00',
            closeTime: '22:00',
            isClosed: false,
          };
        });
        setSchedules(updatedSchedules);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load restaurant schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (index, field, value) => {
    const updated = [...schedules];
    if (field === 'isClosed') {
      updated[index].isClosed = value;
    } else {
      updated[index][field] = value;
    }
    setSchedules(updated);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError('');
      setSuccess('');

      const response = await restaurantAPI.updateSchedule(schedules);
      if (response.success) {
        setSuccess('Schedule updated successfully');
      } else {
        setError('Failed to update schedule');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update schedule');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="schedule-page">
        <div className="loading-container">
          <Loading size="lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="schedule-page">
      <div className="page-header">
        <div>
          <Link to="/restaurant">
            <Button variant="outline" size="sm">← Back to Profile</Button>
          </Link>
          <h1 className="page-title">Restaurant Schedule</h1>
          <p className="page-subtitle">Set your restaurant operating hours</p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}

      <Card>
        <form onSubmit={handleSubmit} className="schedule-form">
          {schedules.map((schedule, index) => {
            const dayLabel = daysOfWeek.find((d) => d.value === schedule.dayOfWeek)?.label;
            return (
              <div
                key={schedule.dayOfWeek}
                className="schedule-day-card"
              >
                <div className="schedule-day-header">
                  <h3 className="schedule-day-title">{dayLabel}</h3>
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={schedule.isClosed}
                      onChange={(e) =>
                        handleScheduleChange(index, 'isClosed', e.target.checked)
                      }
                    />
                    <span>Closed</span>
                  </label>
                </div>

                {!schedule.isClosed && (
                  <div className="schedule-time-grid">
                    <Input
                      label="Open Time"
                      type="time"
                      name={`openTime-${index}`}
                      value={schedule.openTime}
                      onChange={(e) =>
                        handleScheduleChange(index, 'openTime', e.target.value)
                      }
                      required
                    />
                    <Input
                      label="Close Time"
                      type="time"
                      name={`closeTime-${index}`}
                      value={schedule.closeTime}
                      onChange={(e) =>
                        handleScheduleChange(index, 'closeTime', e.target.value)
                      }
                      required
                    />
                  </div>
                )}

                {schedule.isClosed && (
                  <p className="schedule-closed-message">Restaurant is closed on this day</p>
                )}
              </div>
            );
          })}

          <div className="form-footer">
            <Button type="submit" loading={submitting}>
              Save Schedule
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RestaurantSchedule;
