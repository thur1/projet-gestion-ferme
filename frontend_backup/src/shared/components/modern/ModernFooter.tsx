/**
 * ModernFooter - Footer professionnel type SaaS 2025
 * 4 colonnes avec liens utiles
 */

import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

const footerLinks = {
  product: [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Projets', href: '/projects' },
    { name: 'Stock', href: '/stock' },
    { name: 'Rapports', href: '/reports' },
    { name: 'Équipe', href: '/team' },
  ],
  resources: [
    { name: 'Documentation', href: '/docs' },
    { name: 'API', href: '/api-docs' },
    { name: 'Support', href: '/support' },
    { name: 'Tutoriels', href: '/tutorials' },
    { name: 'Changelog', href: '/changelog' },
  ],
  company: [
    { name: 'À propos', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Carrières', href: '/careers' },
    { name: 'Contact', href: '/contact' },
  ],
  legal: [
    { name: 'Confidentialité', href: '/privacy' },
    { name: 'Conditions d\'utilisation', href: '/terms' },
    { name: 'Cookies', href: '/cookies' },
    { name: 'Licences', href: '/licenses' },
  ],
};

const socialLinks = [
  { name: 'GitHub', href: 'https://github.com', icon: Github },
  { name: 'Twitter', href: 'https://twitter.com', icon: Twitter },
  { name: 'LinkedIn', href: 'https://linkedin.com', icon: Linkedin },
  { name: 'Email', href: 'mailto:contact@agritrack.pro', icon: Mail },
];

export function ModernFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t" style={{ borderColor: 'var(--gray-200)', backgroundColor: 'var(--gray-50)' }}>
      {/* Main footer content */}
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Produit */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Produit</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Ressources</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Entreprise */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Entreprise</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Légal</h3>
            <ul className="mt-4 space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-600 transition-colors hover:text-gray-900"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social links */}
        <div className="mt-8 border-t pt-8" style={{ borderColor: 'var(--gray-200)' }}>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              © {currentYear} AgriTrack Pro. Tous droits réservés.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 transition-colors hover:text-gray-600"
                    aria-label={social.name}
                  >
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
