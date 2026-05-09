import React from 'react';
import { motion } from 'framer-motion';

const InnerBanner = ({ title, subtitle, image }) => {
  return (
    <section className="relative h-[350px] md:h-[45vh] min-h-[300px] flex items-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-primary"></div>
        )}
        <div className="absolute inset-0 bg-primary/75 backdrop-blur-[1px]"></div>
      </div>
      
      <div className="container relative z-10 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 leading-tight">{title}</h1>
          {subtitle && <p className="text-white/80 text-base md:text-xl max-w-2xl leading-relaxed">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
};

export default InnerBanner;
