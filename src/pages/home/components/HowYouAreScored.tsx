
export default function HowYouAreScored() {
  const scoreCards = [
    {
      image: 'https://readdy.ai/api/search-image?query=Modern%20building%20entrance%20lobby%20with%20security%20desk%20and%20access%20control%20systems%2C%20professional%20commercial%20interior%20with%20marble%20floors%20and%20glass%20walls%2C%20security%20personnel%20at%20reception%20desk%2C%20contemporary%20architectural%20design%20with%20high%20ceilings%20and%20natural%20lighting&width=400&height=300&seq=lobby-security&orientation=landscape',
      title: 'ACCESS CONTROL',
      description: 'Evaluating access control systems and entry point security measures to ensure only authorized personnel can enter your building.'
    },
    {
      image: 'https://readdy.ai/api/search-image?query=Building%20security%20monitoring%20room%20with%20multiple%20surveillance%20screens%20and%20control%20panels%2C%20professional%20security%20operations%20center%20with%20CCTV%20monitors%20displaying%20building%20cameras%2C%20modern%20security%20technology%20setup%20with%20ergonomic%20workstations&width=400&height=300&seq=security-monitoring&orientation=landscape',
      title: 'SECURITY SYSTEMS & RESPONSE',
      description: 'Assessing your surveillance systems, alarm systems, and emergency response protocols to maintain building safety.'
    },
    {
      image: 'https://readdy.ai/api/search-image?query=Security%20control%20room%20with%20wall%20of%20surveillance%20monitors%20showing%20building%20camera%20feeds%2C%20professional%20security%20monitoring%20setup%20with%20multiple%20screens%20displaying%20different%20areas%2C%20modern%20security%20operations%20center%20with%20control%20panels%20and%20communication%20equipment&width=400&height=300&seq=surveillance-room&orientation=landscape',
      title: 'MONITORING & SURVEILLANCE',
      description: 'Reviewing your building monitoring capabilities, camera coverage, and real-time surveillance systems for comprehensive security.'
    },
    {
      image: 'https://readdy.ai/api/search-image?query=Business%20meeting%20room%20with%20security%20professionals%20discussing%20building%20safety%20protocols%2C%20corporate%20conference%20setting%20with%20security%20consultants%20presenting%20safety%20measures%2C%20professional%20team%20meeting%20about%20building%20security%20assessment%20and%20planning&width=400&height=300&seq=security-meeting&orientation=landscape',
      title: 'SECURITY PROTOCOLS & SAFETY',
      description: 'Analyzing your security protocols, staff training programs, and safety procedures to ensure comprehensive building protection.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-4">
          How You Are Scored
        </h2>
        <p className="text-center text-gray-600 mb-16 max-w-3xl mx-auto">
          Your safety score is calculated across multiple key areas of building security. 
          We evaluate each aspect to give you a comprehensive understanding of your 
          building's current security posture and areas for improvement.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {scoreCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <img 
                src={card.image} 
                alt={card.title}
                className="w-full h-48 object-cover object-top"
              />
              <div 
                className="p-6"
                style={{ backgroundColor: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}
              >
                <h3 className="text-xl font-bold text-white mb-3">
                  {card.title}
                </h3>
                <p className="text-white/90 leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
