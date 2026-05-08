import React from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Microscope, Laptop, Library, PlayCircle, Trophy, ShieldCheck, HeartPulse, Bus, Utensils, Music, Cpu, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

import scienceLab from '../assets/facilities/science_lab.png';
import ictHub from '../assets/facilities/ict_hub.png';
import library from '../assets/facilities/library.png';
import playground from '../assets/facilities/playground.png';
import sportsField from '../assets/facilities/sports_field.png';
import innovation from '../assets/facilities/innovation_extracurricular.png';
import creativity from '../assets/facilities/creativity_extracurricular.png';
import teamwork from '../assets/facilities/teamwork_extracurricular.png';
import character from '../assets/facilities/character_extracurricular.png';
import bannerImg from '../assets/banners/facilities.png';

const Facilities = () => {
  const facilities = [
    { name: 'Modern Science Lab', desc: 'Equipped with the latest tools for chemistry, physics, and biology experiments.', icon: <Microscope size={24} />, image: scienceLab },
    { name: 'ICT Innovation Hub', desc: 'A dedicated space for coding, robotics, and digital literacy training.', icon: <Laptop size={24} />, image: ictHub },
    { name: 'Creative Library', desc: 'A vast collection of books and digital resources to spark imagination.', icon: <Library size={24} />, image: library },
    { name: 'Junior Playground', desc: 'A safe, colorful, and engaging space for our early years students.', icon: <PlayCircle size={24} />, image: playground },
    { name: 'Multi-Sport Complex', desc: 'Professional-grade courts and fields for football, basketball, and more.', icon: <Trophy size={24} />, image: sportsField },
  ];



  return (
    <div className="facilities-page">
      <InnerBanner 
        title="Facilities & Campus Life" 
        subtitle="A world-class environment designed to inspire every facet of your child's potential."
        image={bannerImg}
      />

      {/* Facilities Grid */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Facilities & Learning Environment</span>
            <h2 className="text-4xl mb-6">Built for Excellence</h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Peak Point International Schools provides a conducive, secure, and learner-friendly environment that supports academic excellence and holistic development.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {facilities.map((f, i) => (
              <div key={i} className={`p-0 rounded-[2.5rem] border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500 group overflow-hidden ${i === 0 ? 'md:col-span-2' : 'bg-white'}`}>
                <div className="relative h-64 overflow-hidden">
                   <img src={f.image} alt={f.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex items-end p-8">
                      <div className={`w-12 h-12 rounded-xl flex-center backdrop-blur-md border border-white/20 ${i === 0 ? 'bg-secondary text-primary' : 'bg-white/10 text-white'}`}>
                        {f.icon}
                      </div>
                   </div>
                </div>
                <div className={`p-8 ${i === 0 ? 'bg-primary text-white' : ''}`}>
                  <h3 className={`text-2xl font-bold mb-4 ${i === 0 ? 'text-white' : 'text-primary'}`}>{f.name}</h3>
                  <p className={`leading-relaxed ${i === 0 ? 'text-white/70' : 'text-text-muted'}`}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-border/50">
            <h3 className="text-2xl font-bold text-primary mb-8 text-center">Comprehensive Facilities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
              {[
                'Well-ventilated classrooms',
                'ICT/Computer laboratory',
                'Science laboratory',
                'Library',
                'School playground',
                'School hall',
                'Administrative offices',
                'Safe learning environment',
                'Audio-visual learning support',
                'Sporting facilities',
                'Early years learning resources'
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                  <span className="text-base font-medium text-text-muted">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Extracurriculars */}
      <section className="section bg-bg-soft">
        <div className="container">
          
          {/* Row 1: Creativity Image (Left) / Intro & Events (Right) */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-16 md:mb-24">
            <div className="order-2 md:order-1 rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/3] md:aspect-square relative group">
              <img src={creativity} alt="Creativity" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-8 md:p-12">
                <span className="text-white font-bold text-3xl">Creativity</span>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Beyond Academics</span>
              <h2 className="text-4xl mb-6">School Activities & Clubs</h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                Peak Point International Schools provides learners with opportunities for academic, leadership, creative, and social development through various school activities and clubs.
              </p>

              <div>
                <h3 className="text-xl font-bold text-primary mb-4">The school also organizes:</h3>
                <div className="flex flex-wrap gap-3">
                  {[
                    'Inter-house Sports', 'Educational Excursions', 
                    'Quiz Competitions', 'Talent Exhibitions', 'Leadership Programs', 
                    'Academic Competitions'
                  ].map((event, i) => (
                    <span key={i} className="px-4 py-2 bg-white border border-border/50 rounded-xl text-sm font-bold text-primary shadow-sm hover:border-secondary transition-colors cursor-default">
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Available Clubs (Left) / Teamwork Image (Right) */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-1">
              <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm border border-border/50">
                <h3 className="text-3xl font-bold text-primary mb-8">Available Activities & Clubs</h3>
                <div className="grid sm:grid-cols-2 gap-y-4 gap-x-6">
                  {[
                    'Debate Club', 'Press Club', 'Literary & Drama Club', 'Music Club', 
                    'Coding & ICT Club', 'Mathematics Club', 'Science Club', 'Jet Club', 
                    'Cultural Dance Group', 'Sports & Athletics', 'Art & Creativity Club', 
                    'Entrepreneurial Club', 'Leadership & Public Speaking'
                  ].map((club, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                      <span className="text-base font-medium text-text-muted">{club}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="order-2 rounded-[2.5rem] overflow-hidden shadow-xl aspect-[4/3] md:aspect-square relative group">
              <img src={teamwork} alt="Teamwork" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent flex items-end p-8 md:p-12">
                <span className="text-white font-bold text-3xl">Teamwork</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Health & Safety */}
      <section className="section">
        <div className="container">
          <div className="bg-primary rounded-[3.5rem] p-12 md:p-20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-secondary opacity-10 blur-3xl -mr-48 -mt-48"></div>
            
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">Safety is Our Priority</h2>
                <p className="text-white/70 text-lg mb-10">
                  We maintain the highest standards of safety and hygiene to ensure a worry-free environment for students and peace of mind for parents.
                </p>
                <div className="space-y-6">
                  {[
                    { title: '24/7 Security & CCTV', icon: <ShieldCheck className="text-secondary" /> },
                    { title: 'On-site Medical Clinic', icon: <HeartPulse className="text-secondary" /> },
                    { title: 'Safe Transportation', icon: <Bus className="text-secondary" /> },
                    { title: 'Hygienic School Kitchen', icon: <Utensils className="text-secondary" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="bg-white/10 p-3 rounded-xl">{item.icon}</div>
                      <span className="font-bold text-white/90">{item.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 text-center">
                 <h4 className="text-2xl font-bold mb-4 text-secondary">Student Services</h4>
                 <p className="text-white/60 mb-8">Comprehensive support services for every student.</p>
                 <div className="space-y-4">
                    <div className="p-6 bg-white/10 rounded-2xl text-left border border-white/5">
                       <h5 className="font-bold text-white mb-2">School Bus Service</h5>
                       <p className="text-xs text-white/50">Safe, tracked, and reliable transport across major routes.</p>
                    </div>
                    <div className="p-6 bg-white/10 rounded-2xl text-left border border-white/5">
                       <h5 className="font-bold text-white mb-2">Nutritional Meal Plan</h5>
                       <p className="text-xs text-white/50">Balanced and healthy meals prepared fresh daily.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Facilities;
