
import { useState } from 'react';
import AssessmentModal from '../../../components/base/AssessmentModal';

export default function Hero() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <section 
        className="relative min-h-screen flex items-center justify-start bg-cover bg-center"
        style={{
          backgroundImage: `url('https://readdy.ai/api/search-image?query=Modern%20luxury%20residential%20building%20with%20glass%20facades%20and%20contemporary%20architecture%20at%20dusk%2C%20professional%20real%20estate%20photography%20with%20warm%20interior%20lighting%20visible%20through%20large%20windows%2C%20clean%20geometric%20design%20with%20multiple%20levels%20and%20balconies%2C%20urban%20setting%20with%20landscaping%2C%20high-end%20property%20development%20aesthetic&width=1920&height=1080&seq=hero-building&orientation=landscape')`
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8">
          {/* Logo */}
          <div className="pt-8 pb-10">
            <img
              src="https://images.squarespace-cdn.com/content/v1/63a061087c044706137df0b8/b08f0a7c-3dca-4e5c-ab8c-d9a4e4819a1e/NGS+Logo__White.png?format=1500w"
              alt="NGS Security"
              className="h-10 w-auto"
              loading="eager"
            />
          </div>
          <div className="max-w-2xl">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Is Your Building<br />
              Delivering the Safety<br />
              Residents Expect?
            </h1>
            <p className="text-lg lg:text-xl text-white/90 mb-8 leading-relaxed">
              Take our 3-minute Building Safety<br />
              Readiness Test to discover how<br />
              secure your property really is.
            </p>
            <button 
              className="btn-ngs text-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Start Assessment
            </button>
          </div>
        </div>
      </section>

      <AssessmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
