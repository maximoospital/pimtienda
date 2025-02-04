import Link from 'next/link'
import { slugify } from '../utils/helpers'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { navItemLength } from '../ecommerce.config'
import CartLink from '../components/CartLink'
import Search from '../components/Search'
import { useState } from 'react'
import { FaEnvelope, FaInstagram, FaMailBulk, FaMailchimp, FaPhone } from 'react-icons/fa'

export default function Layout({ children, categories }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  if (categories.length > navItemLength) {
    categories = categories.slice(0, navItemLength)
  }
  return (
    (<div className='min-h-screen'>
      <nav className='hidden md:block sticky top-0 z-50 bg-[#AEAEAE]'>
        <div className="bg-neutral-800 text-white text-center py-0.5">
          <p className='text-white text-md'>Compra mínima $70.000 | Envíos a todo el país</p>
        </div>
        <div className="pt-2 pb-2 flex flex-row w-full justify-center gap-32 items-center px-2">
        <div className="ml-16">
          <Search className="w-6 h-6 text-zinc-800 hover:text-gray-700 transition-color" />
        </div>
        <div>
          <Link href="/">
            <img 
              src="/logo-bg.png" 
              alt="logo" 
              className="w-[180px] md:w-[180px] h-auto max-w-full" 
            />
          </Link>
        </div>
        <div className="mr-16 flex flex-row gap-4">
          <CartLink />
        </div>
      </div>
        <div className="bg-neutral-800 text-white text-center py-1">
          <div className="flex flex-wrap justify-center">
              <Link href="/" aria-label="Home">
                <p className="sm:mr-8 text-left text-smaller mr-4 text-white hover:text-gray-400 transition-color">Home</p>
              </Link>
              <Link href="/categories" aria-label="Catalogo">
                <p className="sm:mr-8 text-left text-smaller mr-4  text-white hover:text-gray-400 transition-color">Catalogo</p>
              </Link> 
              <Link href="/categories" aria-label="Catalogo">
                <p className="sm:mr-8 text-left text-smaller mr-4  text-white hover:text-gray-400 transition-color">Mayorista</p>
              </Link> 
              {
                categories.map((category, index) => (
                  <Link href={`/category/${slugify(category)}`} key={index} aria-label={category}>
                    <p className="sm:mr-8 text-left text-smaller mr-4 text-white hover:text-gray-400 transition-color">{category.charAt(0).toUpperCase() + category.slice(1)}</p>
                  </Link>
                ))
              }       
            </div>
        </div>
      </nav>
      {/* Mobile header */}
      <nav className="sticky top-0 z-50 bg-[#AEAEAE] md:hidden">
        {/* Top banner */}
        <div className="bg-neutral-800 text-white text-center py-0.5">
          <p className="text-white text-md">Compra mínima $70.000 | Envíos a todo el país</p>
        </div>

        {/* Main navigation container */}
        <div className="px-4 py-2 flex justify-between items-center">
          {/* Logo */}
          <Link href="/">
            <img
              src="/logo-bg.png"
              alt="logo"
              className="w-[180px] md:w-[180px] h-auto"
            />
          </Link>

          {/* Hamburger menu button - visible only on mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>

          {/* Navigation links - hidden on mobile unless menu is open */}
          <div
            className={`${
              isMenuOpen ? "block" : "hidden"
            } md:block absolute md:relative top-full left-0 right-0 bg-neutral-800 md:bg-transparent`}
          >
            <div className="flex flex-col md:flex-row gap-4 p-4 md:p-0">
              <Link
                href="/"
                aria-label="Home"
                className="sm:mr-8 text-left text-smaller mr-4 text-white"
              >
                Home
              </Link>
              <Link
                href="/search"
                aria-label="Buscar"
                className="sm:mr-8 text-left text-smaller mr-4 text-white"
              >
                Buscar
              </Link>
              <Link
                href="/cart"
                aria-label="Carrito"
                className="sm:mr-8 text-left text-smaller mr-4 text-white"
              >
                Carrito
              </Link>
              {/* Categories mapping */}
              {categories.map((category, index) => (
                <Link
                  key={index}
                  href={`/category/${slugify(category)}`}
                  aria-label={category}
                  className="sm:mr-8 text-left text-smaller mr-4 text-white"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
              <Link
                href="/categories"
                aria-label="All categories"
                className="sm:mr-8 text-left text-smaller mr-4 text-white"
              >
                All
              </Link>
            </div>
          </div>

        </div>
    </nav>
      <div className="mobile:px-10 px-4 pb-10 pt-2 flex justify-center">
        <main className="w-fw">{children}</main>
      </div>
      <footer className="flex justify-center">
        <div className="
        sm:flex-row sm:items-center
        flex-col
        flex w-fw px-12 py-8
        justify-between
        desktop:px-0
        border-solid
        border-t border-gray-300">
          <span className="block text-gray-700 text-xs">Copyright © 2025 NeverDie Piercings. Todos los derechos reservados.</span>
          <div className='flex flex-row gap-4'>
              <Link href="https://www.instagram.com/pimkita.piercer/">
                <FaInstagram className="w-6 h-6 text-zinc-800 hover:text-gray-700 transition-color" />
              </Link>
              <Link href="mailto:melisaverrengia@gmail.com ">
                <FaEnvelope className="w-6 h-6 text-zinc-800 hover:text-gray-700 transition-color" />
              </Link>
              <Link href="tel:+543425455655">
                <FaPhone className="w-5 h-5 text-zinc-800 hover:text-gray-700 transition-color" />
              </Link> 
              <span className="text-gray-800 text-sm">25 de Mayo 3665, Santa Fe</span>             
          </div>
        </div>
        
      </footer>
      <ToastContainer autoClose={3000} />
    </div>)
  );
}