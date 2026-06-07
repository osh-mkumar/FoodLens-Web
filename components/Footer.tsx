export default function Footer() {
  return (
    <footer className="w-full py-12 px-4 mt-auto flex flex-col items-center text-center relative z-20">
      <div className="flex flex-col items-center gap-4 text-white/80 max-w-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
        
        <p className="font-playfair text-lg italic">
          Made with coffee, curiosity, and a lot of debugging.
        </p>

        <p className="font-light text-sm">
          Built by <span className="font-medium text-white">Osh Manoj Kumar</span>
        </p>

        <div className="flex items-center gap-4 text-sm font-medium my-2">
          <a 
            href="https://github.com/osh-mkumar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] hover:-translate-y-0.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[var(--color-accent)] after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300"
          >
            GitHub
          </a>
          <span className="text-white/40">&middot;</span>
          <a 
            href="https://www.linkedin.com/in/osh-manojkumar-b355a0329/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-[var(--color-accent)] hover:-translate-y-0.5 transition-all duration-300 relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[var(--color-accent)] after:origin-bottom-right hover:after:scale-x-100 hover:after:origin-bottom-left after:transition-transform after:duration-300"
          >
            LinkedIn
          </a>
        </div>

        <p className="font-light text-sm mt-2">
          Connect with me if you have any suggestions!
        </p>

        <p className="font-pinyon text-xl text-white/60 mt-4 tracking-widest">
          FoodLens v1.0
        </p>

      </div>
    </footer>
  );
}
