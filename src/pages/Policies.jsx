import React from 'react';
import InnerBanner from '../components/layout/InnerBanner';
import { Shield, BookOpen, CheckCircle, Building } from 'lucide-react';

const Policies = () => {
  return (
    <div className="policies-page">
      <InnerBanner 
        title="School Policies" 
        subtitle="Our commitment to maintaining a safe, transparent, and supportive environment."
      />

      <section className="section bg-bg-soft min-h-[50vh]">
        <div className="container max-w-4xl space-y-12">
          {/* Policy 1 */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border/50">
            <div className="flex items-center gap-4 mb-8 border-b pb-6">
              <div className="bg-primary/10 p-3 rounded-xl">
                <Shield className="text-primary" size={32} />
              </div>
              <h2 className="text-3xl text-primary font-bold">1. Child Protection & Safeguarding Statement</h2>
            </div>
            
            <div className="space-y-6 text-text-muted text-lg leading-relaxed">
              <p>
                Peak Point International Schools is committed to providing a safe, secure, caring, and supportive learning environment for every child. The school upholds the rights, dignity, welfare, and protection of all learners entrusted into our care.
              </p>
              <p>
                We maintain a zero-tolerance approach toward abuse, bullying, neglect, discrimination, harassment, or any form of harmful behavior that may affect the physical, emotional, social, or psychological wellbeing of our learners.
              </p>
              <p>
                All staff members, caregivers, and stakeholders are expected to uphold the school's safeguarding principles and contribute to creating a healthy and secure educational environment where children can learn, grow, and thrive safely.
              </p>
            </div>
          </div>

          {/* Policy 2 */}
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-border/50">
            <div className="flex items-center gap-4 mb-8 border-b pb-6">
              <div className="bg-secondary/20 p-3 rounded-xl">
                <BookOpen className="text-secondary" size={32} />
              </div>
              <h2 className="text-3xl text-primary font-bold">2. School Policy & Code of Conduct</h2>
            </div>
            
            <div className="space-y-8 text-text-muted text-lg leading-relaxed">
              <div>
                <h3 className="text-xl font-bold text-primary mb-4">School Policy</h3>
                <p className="mb-4">
                  Peak Point International Schools promotes discipline, integrity, excellence, responsibility, respect, and academic diligence.
                </p>
                <p className="mb-4 font-semibold text-text">The school maintains policies that support:</p>
                <ul className="grid md:grid-cols-2 gap-3">
                  {[
                    'Child safety and protection',
                    'Academic excellence',
                    'Respectful communication',
                    'Positive behavior management',
                    'Attendance and punctuality',
                    'Cleanliness and personal hygiene',
                    'Responsible use of school property',
                    'Parent-school collaboration'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary shrink-0"></div>
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-primary mb-4">Code of Conduct</h3>
                <p className="mb-4 font-semibold text-text">All learners and staff are expected to:</p>
                <ul className="space-y-3">
                  {[
                    'Show respect to teachers, fellow learners, parents, and visitors',
                    'Maintain discipline and good character',
                    'Avoid bullying, fighting, or disruptive behavior',
                    'Dress appropriately according to school standards',
                    'Be punctual and committed to learning',
                    'Promote honesty, responsibility, and teamwork'
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="text-primary/60 shrink-0" size={20} />
                      <span className="text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default Policies;
