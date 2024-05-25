import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';
import { Header } from '@/components/layouts/Header';
import { CircleDollarSign, Plus, X } from 'lucide-react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  onSumit: () => void;
  title: string;
  content: string;
}

const Dialog = ({ open, onClose, onSumit, title, content }: DialogProps) => {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div style={modalStyles.overlay}>
      <div style={modalStyles.content}>
        <div>{title}</div>

        <div>{content}</div>
        <div>
          <div
            onClick={() => {
              onClose();
            }}
          >
            취소
          </div>
          <div
            onClick={() => {
              onSumit();
            }}
          >
            확인
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('global-modal') as HTMLElement,
  );
};
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 배경 투명도
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  content: {
    paddingTop: '24px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    position: 'relative',
    maxWidth: '500px',
    width: '375px',
    // height: '100%',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'transparent',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Dialog;
