import React from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Target, Eye, Heart, Award, Shield, Music, BookOpen, Quote, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import chairmanImg from '../assets/chairman.png';
import bannerImg from '../assets/banners/about.png';

const About = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <div className="about-page">
      <InnerBanner 
        title="About Our School" 
        subtitle="A legacy of excellence, innovation, and community at Peak Point Int'l Schools."
        image={bannerImg}
      />
      
      {/* Our Story Section */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Our Commitment</span>
              <h2 className="text-4xl mb-6">Excellence in Every Step</h2>
              <p className="text-text-muted text-lg mb-6 leading-relaxed">
                Peak Point International Schools is committed to academic excellence, character development, innovation, and holistic learner growth. 
                The school provides a conducive and engaging environment where learners are empowered to succeed academically and socially.
              </p>
              
              <div className="mt-10">
                <h4 className="text-primary font-bold mb-4 uppercase tracking-wider text-sm">Academic Structure</h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    'Early Years', 'Nursery Section', 'Primary Section', 
                    'Junior Secondary', 'Senior Secondary'
                  ].map((level, i) => (
                    <div key={i} className="flex items-center gap-2 text-text-muted">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="font-medium">{level}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <div className="bg-bg-soft rounded-3xl p-1 aspect-square overflow-hidden shadow-xl relative z-10">
                 <div className="w-full h-full bg-primary/5 flex-center border border-primary/10">
                   <Award size={120} className="text-primary/20" />
                 </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary rounded-full mix-blend-multiply opacity-50 blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Chairman's Message Section */}
      <section className="section bg-bg-soft overflow-hidden">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl">
                <img src={chairmanImg} alt="Chairman" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-2xl shadow-xl border-l-4 border-primary max-w-[240px]">
                <p className="font-baloo font-bold text-primary text-xl leading-tight">Rev. Dr. Prince Chima Nnabugwu</p>
                <p className="text-text-muted text-sm font-medium">Chairman / Founder</p>
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Leadership Message</span>
              <h2 className="text-4xl mb-6">A Word from our Chairman</h2>
              <div className="relative">
                <Quote size={48} className="text-primary/10 absolute bottom-0 right-0 rotate-180" />
                <div className="space-y-4 text-text-muted text-lg leading-relaxed relative z-10">
                  <p>
                    "Welcome to Peak Point International Schools. Our commitment is to provide a nurturing environment where every child is recognized as a unique potential. We don't just teach; we inspire greatness."
                  </p>
                  <p>
                    At Peak Point, we believe that education is the bedrock of a successful future. We have meticulously crafted an environment that balances academic excellence with character development, ensuring our students are not just competitive, but also compassionate leaders.
                  </p>
                  <p>
                    Join us as we raise a generation of world-changers."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values, Philosophy Section */}
      <section className="section bg-white">
        <div className="container">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={itemVariants} className="bg-bg-soft p-8 rounded-[2rem] border border-border/50 hover:shadow-xl transition-all group">
              <div className="bg-primary text-white p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Mission</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                To provide quality, child-centered, and value-driven education that nurtures academic excellence, leadership, creativity, discipline, and lifelong learning.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-bg-soft p-8 rounded-[2rem] border border-border/50 hover:shadow-xl transition-all group">
              <div className="bg-secondary text-primary p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Eye size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Vision</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                To raise confident, responsible, innovative, and globally competitive learners equipped for future success and positive societal impact.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-bg-soft p-8 rounded-[2rem] border border-border/50 hover:shadow-xl transition-all group">
              <div className="bg-accent text-white p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Educational Philosophy</h3>
              <p className="text-text-muted text-sm leading-relaxed">
                We believe every child possesses unique abilities that can be nurtured through quality education, discipline, encouragement, and purposeful mentorship.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-bg-soft p-8 rounded-[2rem] border border-border/50 hover:shadow-xl transition-all group">
              <div className="bg-primary text-white p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Heart size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Our Core Values</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Excellence', 'Integrity', 'Discipline', 'Responsibility', 
                  'Respect', 'Creativity', 'Innovation', 'Leadership', 
                  'Teamwork', 'Lifelong Learning'
                ].map((val, i) => (
                  <span key={i} className="text-[10px] font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full text-primary border border-primary/10">
                    {val}
                  </span>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="section bg-bg-soft">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">The Peak Point Edge</span>
            <h2 className="text-4xl mb-4">Why Choose Us?</h2>
            <p className="text-text-muted">A dedicated focus on what matters most for your child's future.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Conducive Environment', desc: 'A serene and learner-friendly atmosphere that supports academic focus and safety.' },
              { title: 'Dedicated Teachers', desc: 'Qualified educators committed to personalized learner development and excellence.' },
              { title: 'Strong Foundations', desc: 'A rigorous focus on moral and academic standards from the very first steps.' },
              { title: 'Tech-Supported', desc: 'Integration of modern technology to enhance the learning experience and digital literacy.' },
              { title: 'Balanced Activities', desc: 'A perfect harmony between academic rigor and vibrant extracurricular programs.' },
              { title: 'Future Leaders', desc: 'Intentional mentorship designed to nurture creativity, leadership, and social impact.' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="mt-1"><Shield className="text-secondary" size={24} /></div>
                <div>
                  <h4 className="font-bold text-primary mb-1">{item.title}</h4>
                  <p className="text-text-muted text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Motto, Pledge, Anthem Section */}
      <section className="section bg-primary text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent opacity-20 blur-3xl -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary opacity-10 blur-3xl -ml-48 -mb-48"></div>
        
        <div className="container relative z-10">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="mb-12">
                <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Our Identity</span>
                <h2 className="text-4xl mb-8 text-white">Motto & Pledge</h2>
                <div className="space-y-8">
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                    <h4 className="text-secondary uppercase text-sm font-bold tracking-widest mb-2">School Motto</h4>
                    <p className="text-2xl font-baloo font-bold">"Ascending to Excellence"</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/10">
                    <h4 className="text-secondary uppercase text-sm font-bold tracking-widest mb-2">School Pledge</h4>
                    <p className="italic leading-relaxed text-lg">
                      "I pledge to Peak Point Int'l Schools, my alma mater, to be diligent in my studies, respectful to my mentors, and a light to my community. I will uphold the values of integrity and excellence in all my endeavors."
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Our Spirit</span>
              <h2 className="text-4xl mb-8 text-white">School Anthem</h2>
              <div className="bg-white text-primary p-8 md:p-12 rounded-3xl shadow-2xl relative overflow-hidden">
                <Music size={120} className="absolute -bottom-10 -right-10 text-primary/5" />
                <div className="space-y-6 relative z-10">
                  <div className="flex-between items-center pb-6 border-b border-primary/10">
                    <div>
                      <p className="font-bold text-lg">The Peak Point Hymn</p>
                      <p className="text-sm text-text-muted">Standard Version</p>
                    </div>
                    <button className="w-12 h-12 bg-primary text-white rounded-full flex-center hover:scale-110 transition-transform shadow-lg">
                      <Play size={20} fill="white" />
                    </button>
                  </div>
                  <div className="text-center font-medium italic space-y-4">
                    <p>On the heights where wisdom glows,<br/>Peak Point's noble spirit grows.</p>
                    <p>In our hearts and in our minds,<br/>Excellence is what we find.</p>
                    <div className="text-primary font-bold not-italic pt-4">
                      <p>(Chorus)</p>
                      <p>Peak Point, Peak Point, our shining star,<br/>Leading us to where we are.</p>
                      <p>With integrity and grace,<br/>We will take our rightful place.</p>
                    </div>
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

export default About;
