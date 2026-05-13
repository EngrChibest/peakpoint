import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, X } from 'lucide-react';
import heroImage from '../../assets/hero.png';

const Hero = () => {
  const [showVideo, setShowVideo] = useState(false);

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="hero-overlay z-0">
        <img
          src={heroImage}
          alt="Peak Point School Campus"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-primary"></div>
      </div>

      <div className="container relative z-20 h-full flex flex-col justify-center">
        <div className="flex items-center justify-center md:justify-start text-center md:text-left">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1.5 px-5 rounded-full bg-secondary/20 text-secondary font-bold text-[10px] md:text-sm tracking-[0.2em] uppercase mb-6 backdrop-blur-md border border-secondary/30 shadow-lg">
                Welcome to Excellence
              </span>
              <h1 className="text-white text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight">
                Shaping Future <span className="text-secondary">Leaders</span> Today.
              </h1>
              <p className="text-white/80 text-base md:text-xl mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed font-medium">
                Experience a world-class education at Peak Point International Schools.
                <br /><b className="text-secondary/90 italic">"Raising Role Models with Excellence & Character."</b>
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                <Link to="/apply" className="btn btn-secondary px-8 py-4 font-bold text-base md:text-lg shadow-xl shadow-secondary/10 group">
                  Apply Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <button
                  onClick={() => setShowVideo(true)}
                  className="btn bg-white/10 hover:bg-white/20 text-white px-8 py-4 text-base md:text-lg border border-white/20 backdrop-blur-md flex items-center gap-3 transition-all"
                >
                  <div className="bg-white/20 p-2 rounded-full">
                    <Play size={16} fill="white" />
                  </div>
                  Watch Video
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Modal Overlay */}
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex-center bg-primary/95 backdrop-blur-xl p-4 md:p-10"
          >
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-6 right-6 text-white hover:text-secondary transition-colors z-[101]"
            >
              <X size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                title="Peak Point School Advertisement"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Hero;
