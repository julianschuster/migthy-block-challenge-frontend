/* eslint-disable react/jsx-closing-tag-location */
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const Modal = ({
  children, onClose, show, title,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  const closeOnEscapeKeyDown = (e) => {
    if ((e.charCode || e.keyCode) === 27) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDown);
    return function cleanup() {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDown);
    };
  }, []);

  return mounted ? createPortal(<div className={`modal ${show ? 'show' : ''}`}>
    <div className="modal-content">
      <div className="modal-header display-flex justify-content-center position-relative">
        <h3 className="title">
          {title}
        </h3>
        <i role="presentation" className="ri-close-line close" onClick={onClose} />
      </div>
      <div className="modal-body">
        {children}
      </div>
    </div>
  </div>, document.querySelector('#__next')) : null;
};

export { Modal };
