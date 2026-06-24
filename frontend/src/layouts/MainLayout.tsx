import { Outlet, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-brand-white text-brand-black font-sans flex flex-col">
      <header className="border-b border-brand-charcoal-800/5 py-4 px-6 bg-brand-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <Logo size="sm" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-[10px] font-bold text-brand-gray-400 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-brand-blue transition-colors">Home</Link>
            <Link to="/assessment" className="hover:text-brand-blue transition-colors">Assessment</Link>
            <Link to="/dependency-map" className="hover:text-brand-blue transition-colors">Dependency Map</Link>
            <Link to="/knowledge" className="hover:text-brand-blue transition-colors">Knowledge Base</Link>
            <Link to="/dashboard" className="hover:text-brand-blue transition-colors">Dashboard</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button size="sm" className="px-6">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="border-t border-brand-charcoal-800/5 py-12 bg-brand-gray-100/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 grayscale opacity-50 hover:opacity-100 transition-opacity">
            <Logo size="sm" />
          </div>
          <p className="text-brand-gray-400 text-[10px] font-bold uppercase tracking-[0.3em]">
            © 2026 WorkforceOS • Build a business that survives people.
          </p>
          <div className="flex gap-6 text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-brand-blue">Privacy</a>
            <a href="#" className="hover:text-brand-blue">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
