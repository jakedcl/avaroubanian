'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ContactModal from './ContactModal';

const Header = () => {
  const router = useRouter();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  // Function to scroll to bio section
  const scrollToBio = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    router.push('/', { scroll: false });
  };

  // Function to open contact modal
  const openContactModal = () => {
    setIsContactModalOpen(true);
  };

  // Function to close contact modal
  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-background z-10">
        <div className="site-container">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button onClick={scrollToBio} className="h-12 w-auto cursor-pointer bg-transparent border-0 p-0">
                <Image
                  src="/logo.png"
                  alt="Ava Roubanian"
                  width={150}
                  height={48}
                  style={{ objectFit: 'contain', height: '48px', width: 'auto' }}
                  priority
                />
              </button>
            </div>

            {/* Contact Text Link */}
            <div>
              <span 
                onClick={openContactModal}
                className="contact-text-link"
              >
                Contact
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Contact Modal */}
      <ContactModal isOpen={isContactModalOpen} onClose={closeContactModal} />
    </>
  );
};

export default Header; 