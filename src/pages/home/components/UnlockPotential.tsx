
import { useState } from 'react';
import AssessmentModal from '../../../components/base/AssessmentModal';

export default function UnlockPotential() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section 
        className="py-20"
        style={{ background: `linear-gradient(to right, hsla(187.82608696,42.99065421%,51.96078431%,1), hsla(187.82608696,42.99065421%,41.96078431%,1))` }}
      >
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-8">
            Unlock Your Property's Full Potential
          </h2>
          <p className="text-lg text-white/90 leading-relaxed mb-8">
            This assessment will provide you with a clear understanding of your building's current security 
            status and actionable recommendations to enhance safety measures. Take the first step 
            towards creating a more secure environment for your residents, tenants, and visitors. 
            Discover how to optimize your building's security infrastructure and ensure peace of mind 
            for everyone. It's fast and takes about three minutes.
          </p>
          <button 
            className="bg-white text-lg font-semibold px-8 py-4 transition-colors cursor-pointer whitespace-nowrap hover:bg-gray-100 btn-angled"
            style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}
            onClick={() => setIsModalOpen(true)}
          >
            Start Your Assessment
          </button>
        </div>
      </section>

      <AssessmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
