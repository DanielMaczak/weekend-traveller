/**
 * @module
 * Notification presets.
 * ToastComponent is placed in App.tsx.
 * @version 1.0.0
 */

//  External dependencies
import { toast } from 'react-toastify';

/**
 * Preset for error notifications.
 * @param message text to display
 */
export const notifyError = (message: string) => {
  toast.error(message, {
    position: 'top-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  });
};

export const notifyInfo = (message: string) => {
  toast.info(message, {
    position: 'top-left',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'light',
  });
};
