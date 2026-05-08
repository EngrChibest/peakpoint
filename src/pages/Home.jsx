import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import { BookOpen, Users, Trophy, Target, ArrowRight, Quote, Calendar, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import testimonialBg from '../assets/testimonial_bg.png';
import whyChooseUsImg from '../assets/home/why_choose_us.png';
import scienceNewsImg from '../assets/home/science_news.png';
import conferenceNewsImg from '../assets/home/conference_news.png';
import sportsNewsImg from '../assets/home/sports_news.png';

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "The dedication of the teachers is truly unmatched. My child has blossomed both academically and socially since joining.",
      author: "Mrs. Adebayo",
      role: "Parent of Year 4 Student",
      initials: "MA"
    },
    {
      text: "Peak Point provided me with the solid foundation I needed to excel at the university level. The supportive environment made all the difference.",
      author: "Chisom O.",
      role: "Alumni, Class of 2023",
      initials: "CO"
    },
    {
      text: "We love the focus on not just academics, but character development. It's truly a place that raises role models.",
      author: "Mr. & Mrs. Johnson",
      role: "Parents",
      initials: "MJ"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);
  return (
    <div className="home-page">
      <Hero />
      
      {/* Sections for Primary & Secondary School */}
      <section className="section bg-bg-soft">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl mb-4">Our Academic Divisions</h2>
            <p className="text-text-muted text-lg">
              We offer a comprehensive educational journey from foundation to graduation, 
              tailored to each stage of your child's development.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Primary School Card */}
            <div className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-xl transition-all group">
              <div className="bg-secondary/10 w-16 h-16 flex-center rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <BookOpen className="text-secondary" size={32} />
              </div>
              <h3 className="text-2xl mb-4">Primary School</h3>
              <p className="text-text-muted mb-6 leading-relaxed">
                Nurturing young minds through a creative and engaging curriculum. 
                Our primary division focuses on building a strong foundation in core subjects 
                while encouraging curiosity and social growth.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Foundation to Year 6
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Inquiry-based Learning
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                  Creative Arts & Sports
                </li>
              </ul>
              <button className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                Learn More <ArrowRight size={18} />
              </button>
            </div>

            {/* Secondary School Card */}
            <div className="bg-white p-8 rounded-2xl shadow-md border hover:shadow-xl transition-all group">
              <div className="bg-accent/10 w-16 h-16 flex-center rounded-xl mb-6 group-hover:scale-110 transition-transform">
                <Target className="text-accent" size={32} />
              </div>
              <h3 className="text-2xl mb-4">Secondary School</h3>
              <p className="text-text-muted mb-6 leading-relaxed">
                Preparing students for global success and university excellence. 
                Our secondary program emphasizes critical thinking, leadership, 
                and advanced academic rigor across all disciplines.
              </p>
              <ul className="flex flex-col gap-3 mb-8">
                <li className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  Year 7 to Year 13
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  IGCSE & A-Level Pathways
                </li>
                <li className="flex items-center gap-2 text-sm font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
                  University Placement Support
                </li>
              </ul>
              <button className="flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all">
                Learn More <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl mb-6">Why Choose Peak Point?</h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                Peak Point International Schools is committed to academic excellence, character development, and innovation. We provide a conducive environment where learners are empowered to succeed academically and socially.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { title: 'Conducive Environment', desc: 'Serene and learner-friendly atmosphere.' },
                  { title: 'Dedicated Teachers', desc: 'Qualified educators focused on student growth.' },
                  { title: 'Moral Foundation', desc: 'Strong focus on character and academic standards.' },
                  { title: 'Tech-Supported', desc: 'Modern technology integrated into learning.' },
                  { title: 'Balanced Activities', desc: 'Harmony of academic and extracurricular life.' },
                  { title: 'Leadership Focus', desc: 'Nurturing creativity and future leaders.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="bg-primary text-white p-3 rounded-lg h-fit flex-shrink-0">
                      <Target size={20} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold mb-1 leading-tight">{item.title}</h4>
                      <p className="text-text-muted text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square bg-bg-soft rounded-3xl overflow-hidden shadow-2xl">
                <img src={whyChooseUsImg} alt="Students collaborating" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full mix-blend-multiply opacity-20 blur-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section relative overflow-hidden" style={{ minHeight: '700px' }}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img src={testimonialBg} alt="School Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-primary/90 backdrop-blur-[2px] mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg opacity-90"></div>
        </div>

        <div className="container relative z-10 h-full flex flex-col justify-center">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary border border-secondary/30 font-bold uppercase tracking-widest text-sm mb-6 inline-block px-4 py-1 rounded-full shadow-lg">
              Testimonial
            </span>
            <h2 className="text-4xl mb-4 text-white">What Our Community Says</h2>
            <p className="text-white/80 text-lg">
              Hear from our students and parents about their experiences at Peak Point Int'l Schools.
            </p>
          </div>

          <div className="max-w-4xl mx-auto w-full relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="bg-white/10 backdrop-blur-md p-8 md:p-16 rounded-3xl shadow-2xl border border-white/20 text-center relative"
              >
                <Quote size={64} className="text-secondary/30 absolute bottom-8 right-8 rotate-180" />
                
                <p className="text-white text-xl md:text-3xl italic mb-12 leading-relaxed font-medium relative z-10">
                  "{testimonials[currentTestimonial].text}"
                </p>
                
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary text-primary flex-center text-xl font-bold border-4 border-white/20">
                    {testimonials[currentTestimonial].initials}
                  </div>
                  <div>
                    <h4 className="font-bold text-secondary font-baloo text-2xl">{testimonials[currentTestimonial].author}</h4>
                    <p className="text-white/80 font-medium tracking-wide">{testimonials[currentTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="flex-center gap-6 mt-12">
              <button 
                onClick={prevTestimonial}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-secondary hover:text-primary text-white flex-center transition-colors border border-white/20"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex gap-3">
                {testimonials.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentTestimonial(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${currentTestimonial === idx ? 'bg-secondary scale-125' : 'bg-white/30'}`}
                  />
                ))}
              </div>

              <button 
                onClick={nextTestimonial}
                className="w-12 h-12 rounded-full bg-white/10 hover:bg-secondary hover:text-primary text-white flex-center transition-colors border border-white/20"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* News & Upcoming Activities Section */}
      <section className="section">
        <div className="container">
          <div className="flex-between mb-12 flex-wrap gap-4">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Stay Updated</span>
              <h2 className="text-4xl">News & Upcoming Activities</h2>
            </div>
            <Link to="/news" className="btn btn-outline">View All Events</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                date: "15",
                month: "MAY",
                title: "Annual Science Exhibition",
                desc: "Join us as our students showcase their innovative science projects.",
                time: "09:00 AM - 02:00 PM",
                location: "School Main Hall",
                image: scienceNewsImg
              },
              {
                date: "28",
                month: "MAY",
                title: "Parent-Teacher Conference",
                desc: "An opportunity to discuss your child's progress with their teachers.",
                time: "01:00 PM - 05:00 PM",
                location: "Classrooms",
                image: conferenceNewsImg
              },
              {
                date: "05",
                month: "JUN",
                title: "Inter-House Sports Competition",
                desc: "Cheer on our athletes in our annual inter-house sports festival.",
                time: "10:00 AM - 04:00 PM",
                location: "School Sports Field",
                image: sportsNewsImg
              }
            ].map((event, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md border overflow-hidden group hover:shadow-xl transition-all">
                <div className="h-40 bg-bg-soft relative overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-500"></div>
                  
                  <div className="absolute top-4 left-4 bg-primary text-white text-center rounded-xl overflow-hidden shadow-xl border border-white/20">
                    <div className="bg-secondary text-primary font-bold text-[10px] py-1 px-3 uppercase tracking-tighter">
                      {event.month}
                    </div>
                    <div className="text-xl font-bold font-baloo px-3 py-1.5">
                      {event.date}
                    </div>
                  </div>
                </div>
                
                <div className="p-8">
                  <h3 className="text-2xl font-baloo font-bold text-primary mb-3 leading-tight group-hover:text-secondary transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-text-muted text-base leading-relaxed mb-6">
                    {event.desc}
                  </p>
                  
                  <div className="flex flex-col gap-3 pt-6 border-t border-primary/5">
                    <div className="flex items-center gap-3 text-sm font-semibold text-primary/70">
                      <div className="bg-secondary/20 p-1.5 rounded-lg">
                        <Clock size={14} className="text-primary" />
                      </div>
                      {event.time}
                    </div>
                    <div className="flex items-center gap-3 text-sm font-semibold text-primary/70">
                      <div className="bg-secondary/20 p-1.5 rounded-lg">
                        <MapPin size={14} className="text-primary" />
                      </div>
                      {event.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Floating Card over Footer */}
      <div className="container relative">
        <div className="absolute bottom-0 translate-y-1/2 right-4 md:right-10 z-10 bg-secondary p-8 rounded-2xl shadow-xl max-w-[200px] text-center">
          <div className="text-4xl font-bold text-primary mb-1">100%</div>
          <div className="text-primary/70 text-xs font-bold uppercase tracking-wider">University Acceptance</div>
        </div>
      </div>
    </div>
  );
};


export default Home;
