// "use client";

// import { useState } from "react";
// import Link from "next/link";

// export default function Navbar() {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           {/* Logo */}
//           <Link href="/" className="flex items-center space-x-2">
//             <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-xl">B</span>
//             </div>
//             <span className="text-2xl font-bold text-slate-800">
//               Blackcoffer
//             </span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex items-center space-x-8">
//             <Link
//               href="/"
//               className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
//             >
//               Home
//             </Link>
//             <Link
//               href="/about"
//               className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
//             >
//               About
//             </Link>
//             <Link
//               href="/contact"
//               className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
//             >
//               Contact Us
//             </Link>
//             <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
//               Get Started
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="md:hidden p-2 rounded-lg hover:bg-slate-100"
//           >
//             <div className="w-6 h-6 flex flex-col justify-center items-center">
//               <span
//                 className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
//                   isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
//                 }`}
//               ></span>
//               <span
//                 className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
//                   isMenuOpen ? "opacity-0" : "opacity-100"
//                 }`}
//               ></span>
//               <span
//                 className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
//                   isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
//                 }`}
//               ></span>
//             </div>
//           </button>
//         </div>

//         {/* Mobile Menu */}
//         {isMenuOpen && (
//           <div className="md:hidden py-4 border-t border-slate-200">
//             <div className="flex flex-col space-y-4">
//               <Link
//                 href="/"
//                 className="text-slate-700 hover:text-teal-600 font-medium"
//               >
//                 Home
//               </Link>
//               <Link
//                 href="/about"
//                 className="text-slate-700 hover:text-teal-600 font-medium"
//               >
//                 About
//               </Link>
//               <Link
//                 href="/contact"
//                 className="text-slate-700 hover:text-teal-600 font-medium"
//               >
//                 Contact Us
//               </Link>
//               <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors w-fit">
//                 Get Started
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }
"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-teal-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="text-2xl font-bold text-slate-800">
              Blackcoffer
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-slate-700 hover:text-teal-600 font-medium transition-colors"
            >
              Contact Us
            </Link>
            <Link href="/login">
              <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors">
                Login
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span
                className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? "rotate-45 translate-y-1" : "-translate-y-0.5"
                }`}
              ></span>
              <span
                className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm my-0.5 ${
                  isMenuOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`bg-slate-600 block transition-all duration-300 ease-out h-0.5 w-6 rounded-sm ${
                  isMenuOpen ? "-rotate-45 -translate-y-1" : "translate-y-0.5"
                }`}
              ></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-slate-700 hover:text-teal-600 font-medium"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-slate-700 hover:text-teal-600 font-medium"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-slate-700 hover:text-teal-600 font-medium"
              >
                Contact Us
              </Link>
              <Link href="/login">
                <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors w-fit">
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
