"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 text-white">
      {/* 🌟 Navbar */}
      <nav className="flex flex-col items-center justify-center px-6 py-4 bg-white/10 backdrop-blur-xl sticky top-0 z-50 shadow-xl border-b border-white/10 transition-all duration-300">
        <div className="flex flex-col items-center justify-center mb-2">
          <h1 className="text-3xl font-extrabold tracking-wide drop-shadow-md">
            CSBS<span className="text-amber-300"> SYNC</span>
          </h1>
          <p className="text-sm text-white/80 font-medium tracking-wide">
            A place for students, by students 🎓
          </p>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-10 text-lg font-medium justify-center items-center mt-2">
          {[
            { name: "Home", link: "/" },
            { name: "About", link: "/about" },
            { name: "Services", link: "/services" },
            { name: "Gallery", link: "/gallery" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              className="hover:text-amber-300 transition relative after:absolute after:w-0 after:h-[2px] after:bg-amber-300 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            className="bg-amber-400 text-black px-4 py-2 rounded-xl font-semibold hover:bg-amber-300 transition shadow-md hover:shadow-yellow-400/40"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white absolute right-6 top-5 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="md:hidden flex flex-col bg-white/10 backdrop-blur-lg text-center py-6 space-y-5 text-lg font-medium shadow-xl border-b border-white/10"
        >
          {[
            { name: "Home", link: "/" },
            { name: "About", link: "/about" },
            { name: "Services", link: "/services" },
            { name: "Gallery", link: "/gallery" },
            { name: "Contact", link: "/contact" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.link}
              onClick={() => setMenuOpen(false)}
              className="hover:text-amber-300 transition"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/login"
            onClick={() => setMenuOpen(false)}
            className="bg-amber-400 text-black px-5 py-2 rounded-lg font-semibold hover:bg-amber-300 transition mx-auto w-2/3 shadow-md"
          >
            Login
          </Link>
        </motion.div>
      )}

      {/* 📞 Contact Section */}
      <section className="relative z-10 max-w-3xl mx-auto mt-28 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-300 via-pink-300 to-cyan-300 drop-shadow-lg mb-10">
          Contact Us
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10">
          We’re here to help and answer any question you might have 💬
        </p>

        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-white/20 text-left space-y-6 max-w-md mx-auto">
          <div className="flex items-center space-x-4">
            <Mail className="text-amber-300" size={26} />
            <div>
              <h2 className="font-semibold text-xl">Email</h2>
              <p className="text-white/80">csbshub@gmail.com</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Phone className="text-amber-300" size={26} />
            <div>
              <h2 className="font-semibold text-xl">Phone</h2>
              <p className="text-white/80">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <MapPin className="text-amber-300" size={26} />
            <div>
              <h2 className="font-semibold text-xl">Address</h2>
              <p className="text-white/80">
                CSBS Services, Example College,
                <br />
                Chennai, Tamil Nadu, India.
              </p>
            </div>
          </div>
        </div>

        <footer className="text-white/70 text-sm mt-16">
          © {new Date().getFullYear()} CSBS SYNC — Connect. Communicate. Collaborate 💫
        </footer>
      </section>
    </main>
  );
}
