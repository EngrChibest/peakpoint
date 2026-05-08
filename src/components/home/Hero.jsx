import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import heroImage from '../../assets/hero.png';

const Hero = () => {
  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Peak Point School Campus" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/60 to-transparent"></div>
      </div>

      <div className="container relative z-10">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-secondary/20 text-secondary font-semibold text-sm tracking-wider uppercase mb-6 backdrop-blur-sm border border-secondary/30">
              Welcome to Excellence
            </span>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1]">
              Shaping Future <span className="text-secondary">Leaders</span> Today.
            </h1>
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-xl leading-relaxed">
              Experience a world-class education at Peak Point Int'l Schools. 
              Raising Role Models with Excellence & Character.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/apply" className="btn btn-secondary px-8 py-4 text-lg group">
                Apply Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn bg-white/10 hover:bg-white/20 text-white px-8 py-4 text-lg border border-white/20 backdrop-blur-sm flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Play size={16} fill="white" />
                </div>
                Watch Video
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="absolute bottom-10 left-0 right-0 z-10 hidden md:block">
        <div className="container">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid md:grid-cols-4 gap-8 bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20"
          >
            {[
              { label: 'Students', value: '1,200+' },
              { label: 'Success Rate', value: '99%' },
              { label: 'Expert Teachers', value: '85+' },
              { label: 'Award Winning', value: '15+' },
            ].map((stat, i) => (
              <div key={i} className="text-center border-r border-white/10 last:border-0">
                <div className="text-white text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-white/60 text-sm font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
