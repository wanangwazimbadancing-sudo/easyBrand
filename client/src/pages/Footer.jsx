

import React from 'react'

const Footer = () => {
  return (
    <footer class="flex flex-col md:flex-row gap-3 items-center justify-around w-full py-4 text-sm bg-white">
    <p>&copy; 2026 Happy Zimba team. All rights reservered.</p>
    <div class="flex items-center gap-4">
        <a href="#contact" class="hover:text-white transition-all">
            Contact Us
        </a>
        <div class="h-8 w-px bg-white/20"></div>
        <a href="#booking" class="hover:text-white transition-all">
            book
        </a>
        <div class="h-8 w-px bg-white/20"></div>
        <a href="#about" class="hover:text-white transition-all">
            About
        </a>
    </div>
</footer>
  )
}

export default Footer