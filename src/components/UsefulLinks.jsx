import React from 'react';

const UsefulLinks = () => {
  const linkSections = [
    {
      title: 'U Presents',
      links: [
        { text: 'Help', href: '#' },
        { text: 'Activate Your TV', href: '#' },
        { text: 'Terms & Conditions', href: '#', external: true }
      ]
    },
    {
      title: 'Information',
      links: [
        { text: 'Privacy Policy', href: '#', external: true },
        { text: 'Cookie Policy', href: '#' },
        { text: 'Manage Cookies', href: '#' }
      ]
    },
    {
      title: 'Our values',
      links: [
        { text: 'Sustainability', href: '#' },
        { text: 'Accessibility', href: '#' },
        { text: 'Modern slavery', href: '#', external: true }
      ]
    },
    {
      title: 'Corporate',
      links: [
        { text: 'UKTV Corporate', href: '#', external: true },
        { text: 'UKTV Careers', href: '#', external: true },
        { text: 'Ways to Watch', href: '#' }
      ]
    }
  ];

  return (
    <section className="bg-white py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Useful Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {linkSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="text-gray-600 hover:text-gray-900 transition-colors"
                      target={link.external ? '_blank' : undefined}
                      rel={link.external ? 'noopener noreferrer' : undefined}
                    >
                      {link.text}
                      {link.external && (
                        <span className="ml-1 text-xs">(Opens in a new browser tab)</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UsefulLinks;

