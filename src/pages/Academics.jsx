import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import InnerBanner from '../components/layout/InnerBanner';
import { BookOpen, Target, Award, CheckCircle, Heart, Microscope, Users, Sparkles, GraduationCap } from 'lucide-react';
import bannerImg from '../assets/banners/academics.png';
import earlyYearsImg from '../assets/early_years.png';
import nurseryImg from '../assets/nursery.png';
import primaryImg from '../assets/primary.png';
import juniorSecondaryImg from '../assets/junior_secondary.png';
import seniorSecondaryImg from '../assets/senior_secondary.png';

import academicCareImg from '../assets/academic_care.png';

const Academics = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="academics-page">
      <InnerBanner 
        title="Academics" 
        subtitle="Experience a world-class education designed to inspire brilliance and character."
        image={bannerImg}
      />

      {/* Curriculum Overview Section */}
      <section className="section bg-bg-soft">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Our Curriculum</span>
              <h2 className="text-4xl mb-6">A Triple-Threat Educational Approach</h2>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                At Peak Point, we have meticulously blended three world-leading educational philosophies to create a unique learning experience.
              </p>
              
              <div className="space-y-6">
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all">
                  <div className="mt-1"><Target className="text-secondary" /></div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">The Montessori Method</h4>
                    <p className="text-text-muted text-sm">Used in our Early Years to foster independence and sensory-based learning.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all">
                  <div className="mt-1"><BookOpen className="text-secondary" /></div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">The British National Curriculum</h4>
                    <p className="text-text-muted text-sm">Provides global benchmarks in Literacy, Numeracy, and Scientific inquiry.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-white rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-all">
                  <div className="mt-1"><Award className="text-secondary" /></div>
                  <div>
                    <h4 className="font-bold text-primary mb-1">The Nigerian Curriculum</h4>
                    <p className="text-text-muted text-sm">Ensures our students are deeply rooted in their cultural heritage and national values.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
                <div className="w-full h-full relative group">
                  <img src={academicCareImg} alt="Total Academic Care" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-primary/80 backdrop-blur-[2px] flex-center p-12 md:p-16 text-center">
                    <div>
                      <h3 className="text-3xl font-baloo font-bold mb-4 text-white">Total Academic Care</h3>
                      <p className="text-white/90 leading-relaxed italic text-lg">
                        "We focus on the child, not just the grade. Every level is a step towards a more confident, capable, and compassionate human being."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-secondary rounded-full blur-3xl opacity-30"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent rounded-full blur-3xl opacity-20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Levels Section */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl mb-6">Academic Structure</h2>
            <p className="text-text-muted text-lg">
              Explore our specialized learning environments tailored for every stage of your child's growth.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {[
              {
                id: 'early-years',
                title: 'Early Years',
                subtitle: 'Foundation of Growth',
                icon: Heart,
                image: earlyYearsImg,
                desc: 'Our Early Years program utilizes a Montessori-inspired approach, focusing on sensory exploration and emotional security in a nurturing environment.',
                subjects: ['Practical Life Skills', 'Sensory Development', 'Physical Growth', 'Social Discovery']
              },
              {
                id: 'nursery',
                title: 'Nursery Section',
                subtitle: 'Creative Exploration',
                icon: Sparkles,
                image: nurseryImg,
                desc: 'A vibrant learning space where children (Nursery 1-2) begin their formal journey into literacy and numeracy through creative and interactive play.',
                subjects: ['Basic Literacy', 'Numeracy Skills', 'Creative Arts', 'Language Development']
              },
              {
                id: 'primary',
                title: 'Primary Section',
                subtitle: 'Nurturing Global Thinkers',
                icon: BookOpen,
                image: primaryImg,
                desc: 'Our Primary division offers a robust blend of the British National Curriculum and the Nigerian Curriculum, emphasizing critical thinking and moral standards.',
                subjects: ['English & Literacy', 'Mathematics', 'Science & ICT', 'Social Studies']
              },
              {
                id: 'junior-secondary',
                title: 'Junior Secondary Section',
                subtitle: 'Shaping Future Leaders',
                icon: Users,
                image: juniorSecondaryImg,
                desc: 'Transitioning students into independent scholars with a focus on leadership, innovation, and technological proficiency.',
                subjects: ['Integrated Science', 'Business Studies', 'Basic Tech', 'Leadership Skills']
              },
              {
                id: 'senior-secondary',
                title: 'Senior Secondary Section',
                subtitle: 'Academic Excellence',
                icon: GraduationCap,
                image: seniorSecondaryImg,
                desc: 'Preparing students for global academic success (IGCSE, WAEC), focusing on advanced subjects and university readiness.',
                subjects: ['Advanced Sciences', 'Further Mathematics', 'Economics', 'University Prep']
              }
            ].map((level, i) => {
              return (
                <div key={level.id} id={level.id} className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all scroll-mt-24">
                  <div className={i % 2 === 1 ? 'md:order-2' : ''}>
                    <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">{level.subtitle}</span>
                    <h3 className="text-3xl mb-6">{level.title}</h3>
                    <p className="text-text-muted mb-8 leading-relaxed">{level.desc}</p>
                    <div className="grid grid-cols-2 gap-4">
                      {level.subjects.map((sub, j) => (
                        <div key={j} className="flex items-center gap-2 text-sm text-text-muted font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                          {sub}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className={`rounded-3xl aspect-[4/3] overflow-hidden shadow-xl ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                    <img src={level.image} alt={level.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning Philosophy */}
      <section className="section bg-primary text-white">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white/10 rounded-3xl border border-white/10">
              <CheckCircle className="text-secondary mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Inquiry-Based</h4>
              <p className="text-white/70 text-sm">Learning through discovery and questions.</p>
            </div>
            <div className="p-8 bg-white/10 rounded-3xl border border-white/10">
              <CheckCircle className="text-secondary mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Holistic Growth</h4>
              <p className="text-white/70 text-sm">Focusing on academic and character excellence.</p>
            </div>
            <div className="p-8 bg-white/10 rounded-3xl border border-white/10">
              <CheckCircle className="text-secondary mx-auto mb-4" size={40} />
              <h4 className="text-xl font-bold mb-2">Global Vision</h4>
              <p className="text-white/70 text-sm">Preparing students for a connected world.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Academics;
