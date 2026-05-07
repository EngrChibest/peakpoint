import React from 'react';
import { motion } from 'framer-motion';

const InnerBanner = ({ title, subtitle, image }) => {
  return (
    <section className="relative h-40vh min-h-300 flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary"></div>
        )}
        <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px]"></div>
      </div>
      
      <div className="container relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-white text-5xl md:text-6xl mb-4">{title}</h1>
          {subtitle && <p className="text-white/70 text-lg max-w-xl">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default InnerBanner;
