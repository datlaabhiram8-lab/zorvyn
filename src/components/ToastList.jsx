import { CheckCircle, XCircle, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ICONS = {
  success: <CheckCircle size={16} />,
  error:   <XCircle size={16} />,
  info:    <Info size={16} />,
};

export default function ToastList() {
  const { state } = useApp();
  return (
    <div className="toast-container">
      {state.toasts.map(t => (
        <div key={t.id} className={`toast ${t.variant}`}>
          {ICONS[t.variant] ?? ICONS.info}
          {t.message}
        </div>
      ))}
    </div>
  );
}
