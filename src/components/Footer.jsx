import React from 'react';

const Footer = () => {
  const socialLinks = [
    { name: 'Facebook', href: '#', icon: '📘' },
    { name: 'Instagram', href: '#', icon: '📷' },
    { name: 'Youtube', href: '#', icon: '▶️' },
    { name: 'X', href: '#', icon: '𝕏' },
    { name: 'TikTok', href: '#', icon: '🎵' }
  ];

  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-gray-400 text-sm">
            Copyright © {new Date().getFullYear()} UKTV Media Limited
          </div>
          <div className="flex space-x-4">
            <span className="text-gray-400 text-sm">Social Media Links:</span>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`U on ${social.name} (Opens in a new browser tab)`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="text-xl">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

