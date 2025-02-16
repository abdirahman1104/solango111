import { NOTIFICATION_TYPES } from '@/src/constants';
import { XMarkIcon } from '@heroicons/react/24/outline';

const STYLE_VARIANTS = {
  [NOTIFICATION_TYPES.SUCCESS]: {
    container: 'bg-green-50 border-green-200 text-green-800',
    icon: 'text-green-500',
    button: 'text-green-600 hover:text-green-800'
  },
  [NOTIFICATION_TYPES.UPDATE]: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: 'text-blue-500',
    button: 'text-blue-600 hover:text-blue-800'
  },
  [NOTIFICATION_TYPES.DELETE]: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
    button: 'text-red-600 hover:text-red-800'
  },
  [NOTIFICATION_TYPES.ERROR]: {
    container: 'bg-red-50 border-red-200 text-red-800',
    icon: 'text-red-500',
    button: 'text-red-600 hover:text-red-800'
  }
};

const NotificationIcon = ({ type }) => {
  const iconClass = STYLE_VARIANTS[type]?.icon || STYLE_VARIANTS[NOTIFICATION_TYPES.SUCCESS].icon;
  
  return (
    <svg className={`h-5 w-5 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {type === NOTIFICATION_TYPES.DELETE || type === NOTIFICATION_TYPES.ERROR ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      ) : type === NOTIFICATION_TYPES.UPDATE ? (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      ) : (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      )}
    </svg>
  );
};

export default function Notification({ show, onClose, message, type = NOTIFICATION_TYPES.SUCCESS }) {
  if (!show) return null;

  const styles = STYLE_VARIANTS[type] || STYLE_VARIANTS[NOTIFICATION_TYPES.SUCCESS];

  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-md shadow-sm border ${styles.container}`}>
      <NotificationIcon type={type} />
      <span className="text-sm font-medium">{message}</span>
      <button 
        onClick={onClose}
        className={`ml-auto ${styles.button}`}
        aria-label="Close notification"
      >
        <XMarkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}