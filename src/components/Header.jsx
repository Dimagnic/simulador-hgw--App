import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Shield, Menu, X, User, LogOut, Settings } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/devices', label: 'Devices' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/settings', label: 'Settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary neon-glow" />
            <span className="text-xl font-bold text-primary neon-text mono-font">
              SecurityScan Pro
            </span>
          </Link>

          {isAuthenticated && (
            <>
              <nav className="hidden md:flex items-center gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 relative ${
                      location.pathname === link.path
                        ? 'text-primary font-semibold'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {link.label}
                    {location.pathname === link.path && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary neon-glow" />
                    )}
                  </Link>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span className="text-sm">{currentUser?.name || currentUser?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => navigate('/settings')}>
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <button
                className="md:hidden text-foreground"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </>
          )}

          {!isAuthenticated && (
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === link.path
                      ? 'text-primary font-semibold bg-muted'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border my-2" />
              <button
                onClick={() => {
                  navigate('/settings');
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4 inline mr-2" />
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;