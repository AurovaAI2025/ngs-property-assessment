
import { useState } from 'react';
import AssessmentModal from '../../../components/base/AssessmentModal';

export default function ReadyToStrengthen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">
            Ready to Strengthen Your Building's Security?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed mb-8">
            Take the first step towards a more secure building. Our comprehensive assessment 
            will help you identify vulnerabilities and provide actionable recommendations 
            to enhance your property's safety measures.
          </p>
          <button 
            className="text-white px-8 py-4 text-lg font-semibold transition-colors cursor-pointer whitespace-nowrap btn-angled"
            style={{ backgroundColor: 'rgb(61, 141, 153)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgb(54, 125, 136)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgb(61, 141, 153)'}
            onClick={() => setIsModalOpen(true)}
          >
            Start Your Security Assessment
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
