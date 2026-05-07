import React from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Target, Eye, Heart, Award, Shield, Music, BookOpen, Quote, Play, Pause } from 'lucide-react';
import { motion } from 'framer-motion';
import chairmanImg from '../assets/chairman.png';

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
              <span className="text-secondary font-bold uppercase tracking-widest text-sm mb-4 block">Our Story</span>
              <h2 className="text-4xl mb-6">Built on a Vision of Excellence</h2>
              <p className="text-text-muted text-lg mb-6 leading-relaxed">
                Peak Point Int'l Schools was founded with a single mission: to provide 
                a holistic education that prepares students for the challenges of a globalized world. 
                Our approach combines academic rigor with creative expression and social responsibility.
              </p>
              <p className="text-text-muted text-lg mb-8 leading-relaxed">
                Over the years, we have grown into a diverse community of learners, educators, 
                and families, all dedicated to the pursuit of knowledge and personal growth.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">15+</div>
                  <div className="text-text-muted text-sm uppercase font-bold">Years Experience</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-primary mb-1">50+</div>
                  <div className="text-text-muted text-sm uppercase font-bold">Nationalities</div>
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

      {/* Mission, Vision, Values Section */}
      <section className="section">
        <div className="container">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl shadow-md border hover:shadow-xl transition-all group">
              <div className="bg-primary text-white p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Target size={32} />
              </div>
              <h3 className="text-2xl mb-4">Our Mission</h3>
              <p className="text-text-muted leading-relaxed">
                To provide a world-class, holistic education that empowers every student with the character, skills, and knowledge required to thrive in a globalized society.
              </p>
            </motion.div>
            
            <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl shadow-md border hover:shadow-xl transition-all group">
              <div className="bg-secondary text-primary p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Eye size={32} />
              </div>
              <h3 className="text-2xl mb-4">Our Vision</h3>
              <p className="text-text-muted leading-relaxed">
                To be a globally recognized center of educational excellence, nurturing innovators and leaders who will positively transform the world.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="bg-white p-10 rounded-3xl shadow-md border hover:shadow-xl transition-all group">
              <div className="bg-accent text-white p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform">
                <Heart size={32} />
              </div>
              <h3 className="text-2xl mb-4">Our Values</h3>
              <p className="text-text-muted leading-relaxed">
                <strong>Integrity, Excellence, Innovation, & Leadership.</strong> These core pillars guide our actions and define our community's character.
              </p>
            </motion.div>
          </motion.div>
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
