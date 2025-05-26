// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-yellow-500 p-4 mt-8">
      <div className="container mx-auto text-center text-white">
        <p>&copy; 2025 Treat Me. All rights reserved.</p>
        <p>Follow us on social media!</p>
        <div className="flex justify-center space-x-4 mt-2">
          <a href="#" className="text-white hover:text-gray-800">Facebook</a>
          <a href="#" className="text-white hover:text-gray-800">Instagram</a>
          <a href="#" className="text-white hover:text-gray-800">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
