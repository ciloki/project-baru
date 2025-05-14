import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useUI } from "@/context/UIContext";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { openAdminPanel, openLoginModal } = useUI();
  const { user, isLoadingUser } = useData();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <nav className="bg-dark-lighter border-b border-gray-700 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <Link href="/">
                <a className="ml-2 text-xl font-bold text-white">Airdrops Hunter</a>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/">
                <a className={`nav-link ${isActive('/') ? 'active-nav text-white' : 'text-gray-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                  Home
                </a>
              </Link>
              <Link href="/airdrops">
                <a className={`nav-link ${isActive('/airdrops') ? 'active-nav text-white' : 'text-gray-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                  Airdrops
                </a>
              </Link>
              <Link href="/blog">
                <a className={`nav-link ${isActive('/blog') ? 'active-nav text-white' : 'text-gray-300 hover:text-white'} px-3 py-2 text-sm font-medium`}>
                  Blog
                </a>
              </Link>
              <a 
                href="#about" 
                className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  const aboutSection = document.getElementById('about');
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: 'smooth' });
                  } else if (location !== '/') {
                    window.location.href = '/#about';
                  }
                }}
              >
                About
              </a>
              <a 
                href="#contact" 
                className="nav-link text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                onClick={(e) => {
                  e.preventDefault();
                  const contactSection = document.getElementById('contact');
                  if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                  } else if (location !== '/') {
                    window.location.href = '/#contact';
                  }
                }}
              >
                Contact
              </a>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoadingUser ? (
              <Button variant="ghost" size="sm" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </Button>
            ) : user ? (
              <div className="flex items-center space-x-3">
                {/* Conditional rendering for admin button */}
                {user.isAdmin === true && (
                  <Button variant="ghost" size="sm" onClick={openAdminPanel}>
                    Admin Dashboard
                  </Button>
                )}
                <span className="text-sm text-gray-300">Hello, {user.username}</span>
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => window.location.href = '/auth'}
                >
                  Login
                </Button>

              </>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-dark-light focus:outline-none focus:bg-dark-light transition duration-150 ease-in-out"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className={`sm:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link href="/">
            <a onClick={closeMobileMenu} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-dark-light text-white' : 'text-gray-300 hover:text-white hover:bg-dark-light'}`}>Home</a>
          </Link>
          <Link href="/airdrops">
            <a onClick={closeMobileMenu} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/airdrops') ? 'bg-dark-light text-white' : 'text-gray-300 hover:text-white hover:bg-dark-light'}`}>Airdrops</a>
          </Link>
          <Link href="/blog">
            <a onClick={closeMobileMenu} className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/blog') ? 'bg-dark-light text-white' : 'text-gray-300 hover:text-white hover:bg-dark-light'}`}>Blog</a>
          </Link>
          <a 
            href="#about" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-light"
            onClick={(e) => {
              e.preventDefault();
              closeMobileMenu();
              const aboutSection = document.getElementById('about');
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
              } else if (location !== '/') {
                window.location.href = '/#about';
              }
            }}
          >
            About
          </a>
          <a 
            href="#contact" 
            className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-dark-light"
            onClick={(e) => {
              e.preventDefault();
              closeMobileMenu();
              const contactSection = document.getElementById('contact');
              if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
              } else if (location !== '/') {
                window.location.href = '/#contact';
              }
            }}
          >
            Contact
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-700">
          <div className="flex items-center px-5 space-x-3">
            {isLoadingUser ? (
              <Button variant="ghost" size="sm" disabled className="w-full">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading
              </Button>
            ) : user ? (
              <>
                {user.isAdmin && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      openAdminPanel();
                      closeMobileMenu();
                    }}
                    className="w-full"
                  >
                    Admin Dashboard
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    window.location.href = '/auth';
                    closeMobileMenu();
                  }}
                  className="w-full"
                >
                  Login
                </Button>

              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
