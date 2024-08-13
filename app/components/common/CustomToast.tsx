import { toast, ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

interface ToastOptions {
  message: string;
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  allowDuplicates?: boolean;
}

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

export function errorMessage(props: ToastOptions) {
  const { message, position = 'top-center', allowDuplicates = false } = props;
  if (allowDuplicates || !displayedToasts.has(message)) {
    toast.error(message, {
      position,
      onClose: () => displayedToasts.delete(message),
    });
    if (!allowDuplicates) {
      displayedToasts.add(message);
    }
  }
}

export function successMessage(props: ToastOptions) {
  const { message, position = 'top-center', allowDuplicates = false } = props;
  if (allowDuplicates || !displayedToasts.has(message)) {
    toast.success(message, {
      position,
      onClose: () => displayedToasts.delete(message),
    });
    if (!allowDuplicates) {
      displayedToasts.add(message);
    }
  }
}

export function infoMessage(props: ToastOptions) {
  const { message, position = 'top-center', allowDuplicates = false } = props;
  if (allowDuplicates || !displayedToasts.has(message)) {
    toast.info(message, {
      position,
      onClose: () => displayedToasts.delete(message),
    });
    if (!allowDuplicates) {
      displayedToasts.add(message);
    }
  }
}
