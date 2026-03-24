import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const recentToasts = new Map();
const DEDUPE_WINDOW_MS = 800;

const shouldToast = (type, message) => {
  const key = `${type}:${message}`;
  const now = Date.now();
  const lastShownAt = recentToasts.get(key);

  if (lastShownAt && now - lastShownAt < DEDUPE_WINDOW_MS) {
    return false;
  }

  recentToasts.set(key, now);
  return true;
};

export const useToastNotifications = ({
  error,
  success,
  setError,
  setSuccess,
}) => {
  useEffect(() => {
    if (!error || !shouldToast('error', error)) {
      return;
    }

    toast.error(error);
    setError?.('');
  }, [error, setError]);

  useEffect(() => {
    if (!success || !shouldToast('success', success)) {
      return;
    }

    toast.success(success);
    setSuccess?.('');
  }, [success, setSuccess]);
};
