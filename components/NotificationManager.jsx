import Notification from './Notification';

export default function NotificationManager({ notifications }) {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-2">
      {Object.entries(notifications).map(([key, notification]) => (
        notification.show && (
          <Notification
            key={key}
            show={notification.show}
            onClose={notification.onClose}
            message={notification.message}
            type={notification.type}
          />
        )
      ))}
    </div>
  );
} 