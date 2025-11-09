'use client';

import { createContext, useContext, useState } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({ isOpen: false });

  const openModal = (props) => {
    setModalState({ ...props, isOpen: true });
  };

  const closeModal = () => {
    setModalState({ isOpen: false });
  };

  return (
    <ModalContext.Provider value={{ modalState, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
