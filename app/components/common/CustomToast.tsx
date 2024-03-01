import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

// Toast Container
export default function CustomToastContainer() {
  return (
    <ToastContainer
      position="bottom-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
}

const displayedToasts = new Set<string>();

// Toast options
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

interface ToastOptions {
  message: string;
  position?: ToastPosition;
}

export function errorMessage(props: ToastOptions) {
  const { message, position = 'top-center' } = props;
  if (message && !displayedToasts.has(message)) {
    toast.error(message, { position, onClose: () => displayedToasts.delete(message) });
    displayedToasts.add(message);
  }
}

export function successMessage(props: ToastOptions) {
  const { message, position = 'top-center' } = props;
  if (message && !displayedToasts.has(message)) {
    toast.success(message, { position, onClose: () => displayedToasts.delete(message) });
    displayedToasts.add(message);
  }
}

export function infoMessage(props: ToastOptions) {
  const { message, position = 'top-center' } = props;
  if (message && !displayedToasts.has(message)) {
    toast.info(message, { position, onClose: () => displayedToasts.delete(message) });
    displayedToasts.add(message);
  }
}
