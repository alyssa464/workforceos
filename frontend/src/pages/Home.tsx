import { Link } from 'react-router-dom';
import Button from '../components/Button';
import Card from '../components/Card';
import Logo from '../components/Logo';

const Home = () => {
  return (
    <div className="bg-brand-white min-h-screen">
      {/* Navigation / Header */}
      <nav className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
        <Logo size="md" />
        <div className="flex gap-4">
          <Link to="/assessment">
            <Button variant="outline" size="sm" className="hidden sm:inline-flex">Sign In</Button>
          </Link>
          <Link to="/assessment">
            <Button size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32 px-6 relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-blue/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/5 border border-brand-blue/10 mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.2em]">The Organizational Intelligence Platform</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-bold text-brand-black tracking-tightest leading-[1.05] mb-8">
            Build a business that <br />
            <span className="text-brand-blue italic">survives people.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-brand-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            WorkforceOS transforms your company from <span className="text-brand-black font-semibold italic">Person-Dependent</span> to <span className="text-brand-black font-semibold italic">System-Dependent</span>. Captured intelligence. Permanent assets. Total independence.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/assessment" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-10 py-5 text-lg shadow-2xl shadow-brand-blue/20">
                Run Diagnostic Audit
              </Button>
            </Link>
            <Button variant="ghost" size="lg" className="w-full sm:w-auto px-10 py-5 text-lg font-bold border border-brand-charcoal-800/10 hover:bg-brand-gray-100/50">
              Watch the OS in Action
            </Button>
          </div>
          
          <div className="mt-16 flex items-center justify-center gap-4 opacity-60">
             <div className="flex -space-x-2">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-white bg-brand-gray-100" />)}
             </div>
             <p className="text-xs font-bold text-brand-gray-400 uppercase tracking-widest">Join 850+ independent founders</p>
          </div>
        </div>
      </section>

      {/* Stats/Pain Section */}
      <section className="py-24 bg-brand-black px-6 overflow-hidden relative">
        <div className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <div className="grid grid-cols-12 h-full gap-2">
              {[...Array(24)].map((_, i) => <div key={i} className="border-r border-brand-white/20" />)}
           </div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
             <h2 className="text-[10px] font-bold text-brand-blue uppercase tracking-[0.4em] mb-4">The Cost of Dependency</h2>
             <p className="text-3xl md:text-4xl font-bold text-brand-white tracking-tightest leading-tight">Your business risk isn't competition. <br/>It's individual dependency.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 p-10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500" padding="none">
              <h3 className="text-5xl font-bold text-brand-white mb-4 tracking-tightest group-hover:text-brand-blue transition-colors">90%</h3>
              <p className="text-brand-gray-400 font-medium leading-relaxed">of founders are the primary bottleneck for critical approvals and growth-path decisions.</p>
            </Card>
            <Card className="bg-white/5 border-white/10 p-10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500" padding="none">
              <h3 className="text-5xl font-bold text-brand-white mb-4 tracking-tightest group-hover:text-brand-blue transition-colors">70%</h3>
              <p className="text-brand-gray-400 font-medium leading-relaxed">reduction in onboarding time via WorkforceOS AI Successor Training and knowledge capture.</p>
            </Card>
            <Card className="bg-white/5 border-white/10 p-10 backdrop-blur-sm group hover:bg-white/10 transition-all duration-500" padding="none">
              <h3 className="text-5xl font-bold text-brand-white mb-4 tracking-tightest group-hover:text-brand-blue transition-colors">4.5x</h3>
              <p className="text-brand-gray-400 font-medium leading-relaxed">average valuation increase for service businesses that achieve a high Organizational Independence Score.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-brand-charcoal-800/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <Logo size="sm" showSlogan={true} />
           <p className="text-[10px] font-bold text-brand-gray-400 uppercase tracking-widest">
              © 2026 WorkforceOS. Build a business that survives people.
           </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
