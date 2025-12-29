import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Copy, Check, ArrowRight, TrendingUp, AlertTriangle, Menu, X, ExternalLink } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Lenis from 'lenis'

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Components
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [marketCap, setMarketCap] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchMarketCap = async () => {
      try {
        const response = await fetch('https://api.dexscreener.com/latest/dex/pairs/solana/B9wKM6pjxsGamAbYm78YBsbFvKpDQFnQ3a4csnGKiKiM');
        const data = await response.json();
        if (data.pairs && data.pairs[0] && data.pairs[0].marketCap) {
             setMarketCap(data.pairs[0].marketCap);
        }
      } catch (error) {
        console.error("Failed to fetch market cap", error);
      }
    };

    fetchMarketCap();
    const interval = setInterval(fetchMarketCap, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Roadmap', href: '#roadmap' },
    { name: 'Chart', href: '#chart' },
    { name: 'Buy', href: '#buy' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
      scrolled ? "bg-brand-dark/80 backdrop-blur-md border-white/10 py-4" : "bg-transparent py-6"
    )}>
      <div className="container mx-auto px-8 md:px-16 flex justify-between items-center">
        <a href="#" className="text-2xl font-bold tracking-tighter hover:text-brand-accent transition-colors">
          $WYNN
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {marketCap && (
            <div className="hidden lg:flex items-center gap-2 text-sm font-medium text-brand-accent bg-brand-accent/10 px-4 py-1.5 rounded-full border border-brand-accent/20 animate-pulse">
               <TrendingUp size={14} />
               <span>MCap: ${(marketCap / 1000000).toFixed(2)}M</span>
            </div>
          )}
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => document.getElementById('buy').scrollIntoView()}
            className="px-5 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-gray-200 transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Nav Toggle */}
        <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-brand-dark border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
        >
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-300 hover:text-white"
            >
              {link.name}
            </a>
          ))}
        </motion.div>
      )}
    </nav>
  );
};

const FadeIn = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    className={className}
  >
    {children}
  </motion.div>
);

const Section = ({ children, id, className }) => (
  <section id={id} className={cn("py-24 relative", className)}>
    <div className="container mx-auto px-6 lg:px-24 xl:px-32 relative z-10">
      {children}
    </div>
  </section>
);

function App() {
  const [copied, setCopied] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const contractAddress = "E9uUgGXJ77AVmaqVhN544oz644VUPBGU6r4qUaeppump";

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    
    return () => {
        lenis.destroy()
    }
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(contractAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans selection:bg-brand-accent selection:text-white overflow-hidden">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-accent/20 rounded-full blur-[128px] opacity-50 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-secondary/10 rounded-full blur-[128px] opacity-30 -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="container mx-auto px-8 md:px-16 relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <FadeIn>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-brand-accent mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-accent"></span>
                </span>
                Live on PumpFun
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-accent to-brand-secondary">Meme Finance</span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 max-w-lg leading-relaxed">
                James Wynn Real official meme token. No intrinsic value, just pure vibes and community. Professional grade shitcoin.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => document.getElementById('buy').scrollIntoView()}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  Start Trading <ArrowRight size={18} />
                </button>
                <div 
                  onClick={copyToClipboard}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-gray-300 font-mono text-sm rounded-lg hover:bg-white/10 transition-colors cursor-pointer flex items-center justify-center gap-3 group"
                >
                  <span className="truncate max-w-[150px]">{contractAddress}</span>
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} className="group-hover:text-white" />}
                </div>
              </div>
            </FadeIn>
          </div>

          <motion.div 
            style={{ y: y1 }}
            className="order-1 md:order-2 flex justify-center md:justify-end"
          >
            <div className="relative group cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-accent to-brand-secondary rounded-full blur-2xl opacity-40 animate-pulse group-hover:opacity-60 transition-opacity" />
              <img 
                src="https://pbs.twimg.com/profile_images/2005246915915444224/_QfyGK2O_400x400.jpg" 
                alt="$WYNN Coin" 
                className="w-64 h-64 md:w-96 md:h-96 rounded-full border-2 border-white/10 shadow-2xl relative z-10 object-cover animate-float group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                 <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-white/10">
                    Click to Expand
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <Section id="about" className="bg-brand-card/50">
        <div className="grid md:grid-cols-2 gap-16 items-center">
           {/* Mobile Image */}
           <div className="md:hidden relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10" />
                 <img 
                    src="/wynn_about.png" 
                    alt="About $WYNN" 
                    className="w-full h-auto object-cover"
                 />
              </div>
           </div>

           <motion.div style={{ y: y2 }} className="hidden md:block relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent z-10" />
                 <img 
                    src="/wynn_about.png" 
                    alt="About $WYNN" 
                    className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                 />
              </div>
           </motion.div>
           
           <div>
             <FadeIn>
               <h2 className="text-3xl md:text-4xl font-bold mb-6">About The Project</h2>
               <div className="space-y-6 text-gray-400 text-lg leading-relaxed">
                 <p>
                   $WYNN is not just another token. It represents a movement of pure community-driven value. 
                   While we state there is no intrinsic value, the value lies in the network of believers.
                 </p>
                 <p>
                   We are building a robust ecosystem where memes meet professional execution. 
                   Transparency, community engagement, and viral potential are our core pillars.
                 </p>
                 <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
                    <div>
                      <h4 className="text-3xl font-bold text-white mb-1">100%</h4>
                      <p className="text-sm text-gray-500">Fair Launch</p>
                    </div>
                    <div>
                      <h4 className="text-3xl font-bold text-white mb-1">0%</h4>
                      <p className="text-sm text-gray-500">Tax</p>
                    </div>
                 </div>
               </div>
             </FadeIn>
           </div>
        </div>
      </Section>

      {/* Roadmap Section */}
      <Section id="roadmap">
        <FadeIn className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Strategic Roadmap</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our path to dominating the meme space is clear. We are executing with precision.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Phase 1: Foundation", 
              desc: "Launch on PumpFun. Community building. Initial marketing push.",
              icon: <TrendingUp className="text-brand-accent" />
            },
            { 
              title: "Phase 2: Expansion", 
              desc: "Flip TheWhiteWhale. Strategic partnerships. CEX listings.",
              icon: <ExternalLink className="text-brand-secondary" />
            },
            { 
              title: "Phase 3: Domination", 
              desc: "Global recognition. Ecosystem development. Meme singularity.",
              icon: <Check className="text-green-400" />
            }
          ].map((phase, i) => (
            <FadeIn key={i} delay={i * 0.1} className="p-8 bg-brand-card border border-white/5 rounded-2xl hover:border-brand-accent/30 transition-all group">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {phase.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{phase.title}</h3>
              <p className="text-gray-400 leading-relaxed">{phase.desc}</p>
            </FadeIn>
          ))}
        </div>
      </Section>

      {/* Chart Section */}
      <Section id="chart">
         <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Live Chart</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
               Track $WYNN performance in real-time.
            </p>
         </FadeIn>
         
         <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm">
            <style>{`#dexscreener-embed{position:relative;width:100%;padding-bottom:125%;}@media(min-width:1400px){#dexscreener-embed{padding-bottom:65%;}}#dexscreener-embed iframe{position:absolute;width:100%;height:100%;top:0;left:0;border:0;}`}</style>
            <div id="dexscreener-embed">
               <iframe src="https://dexscreener.com/solana/B9wKM6pjxsGamAbYm78YBsbFvKpDQFnQ3a4csnGKiKiM?embed=1&loadChartSettings=0&tabs=0&info=0&chartLeftToolbar=0&chartTimeframesToolbar=0&loadChartSettings=0&chartTheme=dark&theme=dark&chartStyle=1&chartType=marketCap&interval=5"></iframe>
            </div>
         </div>
      </Section>

      {/* CTA / Buy Section */}
      <Section id="buy" className="text-center">
        <FadeIn className="bg-gradient-to-b from-brand-card to-brand-dark border border-white/10 rounded-3xl p-12 md:p-20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.15),transparent_50%)]" />
          
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the Movement?</h2>
            <p className="text-xl text-gray-400 mb-10">
              The train is leaving the station. Don't miss your chance to be part of history.
            </p>
            <a 
              href="https://pump.fun/coin/E9uUgGXJ77AVmaqVhN544oz644VUPBGU6r4qUaeppump" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105"
            >
              Buy on PumpFun <ExternalLink size={18} />
            </a>
          </div>
        </FadeIn>
      </Section>

      {/* Footer / Disclaimer */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="container mx-auto px-8 md:px-16 lg:px-24 xl:px-32">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <h4 className="text-2xl font-bold mb-2">$WYNN</h4>
              <p className="text-gray-500 text-sm">Official Meme Token</p>
            </div>
            <div className="flex gap-6">
               <a href="https://x.com/JamesWynnReal" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
               <a href="https://t.me/wynnmeme" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Telegram</a>
               <a href="https://dexscreener.com/solana/B9wKM6pjxsGamAbYm78YBsbFvKpDQFnQ3a4csnGKiKiM" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">DexScreener</a>
            </div>
          </div>
          
          <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-xl">
             <div className="flex items-start gap-3">
               <AlertTriangle className="text-red-500/50 shrink-0 mt-1" size={20} />
               <div className="text-xs text-gray-500 leading-relaxed">
                 <strong className="text-red-400 block mb-1">Risk Disclaimer</strong>
                 "This is a stupid silly meme coin with no intrinsic value, there is no guarantee of gain or loss. 
                 Wear your bigboy pants this is a shitcoin it could go to zero. 
                 Have fun, trade responsibly, take profits and only invest what you can afford to lose and if you understand the extreme volatility shitcoins bring."
                 <br />
                 <span className="opacity-50 mt-2 block">- Wynn</span>
               </div>
             </div>
          </div>
          
          <div className="mt-8 text-center text-xs text-gray-600 flex flex-col gap-2">
            <p>© {new Date().getFullYear()} $WYNN. All rights reserved.</p>
            <p>
              Website by <a href="https://x.com/mittoonsol" target="_blank" rel="noopener noreferrer" className="hover:text-brand-accent transition-colors">@mittoonsol</a>
            </p>
          </div>
        </div>
      </footer>

      {/* Image Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsPreviewOpen(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative max-w-6xl w-full h-full max-h-[90vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="absolute top-4 right-4 md:top-0 md:-right-12 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors z-20"
              >
                <X size={24} />
              </button>
              <img
                src="/view_full.png"
                alt="Full Preview"
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl cursor-default"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
