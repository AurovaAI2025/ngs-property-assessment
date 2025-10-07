
export default function HowItWorks() {
  const steps = [
    {
      icon: 'ri-file-list-3-line',
      title: 'Take the Assessment',
      description: 'Answer simple questions about your building\'s current security measures, access controls, emergency protocols, and safety infrastructure.'
    },
    {
      icon: 'ri-bar-chart-line',
      title: 'Get Your Score',
      description: 'Receive an instant security readiness score with detailed insights and recommendations for improvement areas.'
    },
    {
      icon: 'ri-shield-check-line',
      title: 'Receive Your Progress',
      description: 'Get a detailed progress report with specific recommendations to enhance your building\'s security infrastructure.'
    },
    {
      icon: 'ri-file-text-line',
      title: 'Strengthen Your Security',
      description: 'Implement recommended security measures, track your progress, and ensure your building meets the highest safety standards.'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-16">
          Here's How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ backgroundColor: 'hsla(187.82608696,42.99065421%,91.96078431%,1)' }}
              >
                <i 
                  className={`${step.icon} text-2xl`}
                  style={{ color: 'hsla(187.82608696,42.99065421%,41.96078431%,1)' }}
                ></i>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
