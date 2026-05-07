import React from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { BookOpen, Target, Award, CheckCircle, Heart, Microscope, Users } from 'lucide-react';

const Academics = () => {
  return (
    <div className="academics-page">
      <InnerBanner 
        title="Academics" 
        subtitle="Experience a world-class education designed to inspire brilliance and character."
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
                <div className="w-full h-full bg-primary flex-center text-white p-16 text-center">
                   <div>
                    <h3 className="text-3xl font-baloo font-bold mb-4">Total Academic Care</h3>
                    <p className="text-white/80 leading-relaxed italic">"We focus on the child, not just the grade. Every level is a step towards a more confident, capable, and compassionate human being."</p>
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
            <h2 className="text-4xl mb-6">Our Academic Arms</h2>
            <p className="text-text-muted text-lg">
              Explore our specialized learning environments tailored for every stage of your child's growth.
            </p>
          </div>

          <div className="flex flex-col gap-12">
            {[
              {
                id: 'early-years',
                title: 'Creche & Nursery',
                subtitle: 'The Foundation of Wonder',
                icon: Heart,
                iconColor: 'text-secondary',
                desc: 'Our Early Years program (Creche to Nursery 2) utilizes a Montessori-inspired approach, focusing on sensory exploration and emotional security.',
                subjects: ['Practical Life Skills', 'Sensory Development', 'Language & Phonics', 'Mathematical Concepts']
              },
              {
                id: 'primary',
                title: 'Primary School',
                subtitle: 'Nurturing Global Thinkers',
                icon: BookOpen,
                iconColor: 'text-primary',
                desc: 'Our Primary division offers a robust blend of the British National Curriculum and the Nigerian Curriculum, emphasizing critical thinking.',
                subjects: ['English & Literacy', 'Mathematics', 'Science & ICT', 'Social Studies']
              },
              {
                id: 'secondary',
                title: 'Secondary School',
                subtitle: 'Shaping Future Leaders',
                icon: Target,
                iconColor: 'text-accent',
                desc: 'Our Secondary program prepares students for global academic success (IGCSE, WAEC), transitioning them into independent scholars.',
                subjects: ['Advanced Sciences', 'Further Mathematics', 'Business & Economics', 'Leadership Studies']
              }
            ].map((level, i) => {
              const Icon = level.icon;
              return (
                <div key={level.id} className="grid md:grid-cols-2 gap-12 items-center bg-white p-8 md:p-12 rounded-[2rem] border border-border/50 shadow-sm hover:shadow-md transition-all">
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
                  <div className={`bg-bg-soft rounded-3xl aspect-[4/3] flex-center ${i % 2 === 1 ? 'md:order-1' : ''}`}>
                     <Icon size={100} className={`${level.iconColor} opacity-20`} />
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
