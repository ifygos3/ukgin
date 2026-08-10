import { useEffect } from 'react';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    if (!notification) return undefined;
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [notification, onClose]);

  if (!notification) return null;

  const tone = notification.type === 'announcement'
    ? 'border-red-500/60 bg-red-500/15 text-red-200'
    : notification.type === 'error'
      ? 'border-red-500/40 bg-red-500/10 text-red-200'
      : notification.type === 'warning'
        ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-200'
        : 'border-green-500/40 bg-green-500/10 text-green-200';

  return (
    <div className={`fixed top-24 right-6 z-[60] w-96 max-w-sm rounded-2xl border px-6 py-5 shadow-2xl backdrop-blur-md bg-gray-950/95 text-base font-bold ${tone}`}>
      {notification.message}
    </div>
  );
};

export default NotificationToast;
