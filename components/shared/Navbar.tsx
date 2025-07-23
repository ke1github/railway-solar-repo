'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Overview', icon: '🏠' },
    { href: '/sites', label: 'Sites', icon: '🏗️' },
    { href: '/epc', label: 'EPC Projects', icon: '⚡' },
    { href: '/map', label: 'Map', icon: '🗺️' },
    { href: '/analytics', label: 'Analytics', icon: '📊' },
  ];

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container-outstanding">
        <div className="flex justify-between items-center py-4">
          <div className="flex justify-center flex-1">
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-link ${pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href)) ? 'active' : ''}`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}