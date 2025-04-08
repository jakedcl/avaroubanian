'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  
  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success?: boolean;
    message?: string;
  }>({ submitted: false });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission (would connect to real backend in production)
    setFormStatus({ 
      submitted: true, 
      success: true, 
      message: 'Thank you for your message! I will get back to you soon.' 
    });
    
    // Reset form after successful submission
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    
    // Close modal after a delay
    setTimeout(() => {
      onClose();
      // Reset form status after closing
      setTimeout(() => {
        setFormStatus({ submitted: false });
      }, 300);
    }, 2500);
  };

  // Close modal when clicking the backdrop
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscapeKey);
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="modal-backdrop"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="modal-content"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/20">
              <h2 className="text-white text-xl uppercase tracking-wide">
                GET IN TOUCH
              </h2>
            </div>
            
            {/* Body */}
            <div className="p-6">
              {formStatus.submitted && formStatus.success ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-white text-lg mb-2">
                    {formStatus.message}
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label 
                      htmlFor="name" 
                      className="block text-white/90 uppercase text-sm mb-2"
                    >
                      NAME
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="modal-input"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-white/90 uppercase text-sm mb-2"
                    >
                      EMAIL
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="modal-input"
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="message" 
                      className="block text-white/90 uppercase text-sm mb-2"
                    >
                      MESSAGE
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="modal-input resize-none"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full py-3 bg-white text-background font-medium hover:bg-white/90 transition-colors uppercase rounded-md"
                  >
                    SEND MESSAGE
                  </button>
                </form>
              )}
            </div>
            
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/80 hover:text-white"
              aria-label="Close modal"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
} 