import { Link } from 'react-router-dom';
import { FiFacebook, FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi';

const FOOTER_LINKS = [
  { title: 'Audio Description', href: '#' },
  { title: 'Help Center', href: '#' },
  { title: 'Gift Cards', href: '#' },
  { title: 'Media Center', href: '#' },
  { title: 'Investor Relations', href: '#' },
  { title: 'Jobs', href: '#' },
  { title: 'Terms of Use', href: '#' },
  { title: 'Privacy', href: '#' },
  { title: 'Legal Notices', href: '#' },
  { title: 'Cookie Preferences', href: '#' },
  { title: 'Corporate Information', href: '#' },
  { title: 'Contact Us', href: '#' },
];

export const Footer = () => (
  <footer className="bg-black border-t border-white/5 pt-12 pb-8 px-4 md:px-12">
    <div className="max-w-6xl mx-auto">
      <div className="flex gap-6 mb-8">
        {[
          { icon: FiFacebook, href: '#' },
          { icon: FiInstagram, href: '#' },
          { icon: FiTwitter, href: '#' },
          { icon: FiYoutube, href: '#' },
        ].map(({ icon: Icon, href }) => (
          <a key={href} href={href} className="text-streamly-gray-light hover:text-white transition-colors">
            <Icon size={22} />
          </a>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {FOOTER_LINKS.map((link) => (
          <Link
            key={link.title}
            to={link.href}
            className="text-xs text-streamly-gray hover:text-streamly-gray-light transition-colors"
          >
            {link.title}
          </Link>
        ))}
      </div>

      <button className="border border-streamly-gray text-streamly-gray px-3 py-1.5 text-xs hover:text-white hover:border-white transition-colors mb-6">
        Service Code
      </button>

      <div className="mb-4">
        <span className="text-lg font-bold tracking-[-0.04em] font-['Space_Grotesk',sans-serif] text-gradient-streamly-logo-blue">
          STREAMLY
        </span>
      </div>
      <p className="text-xs text-streamly-gray">
        &copy; {new Date().getFullYear()} STREAMLY. All rights reserved.
      </p>
    </div>
  </footer>
);
