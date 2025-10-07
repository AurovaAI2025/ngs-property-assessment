// NGS Property Readiness Questionnaire - Updated Questions
// Structured according to new assessment framework

export interface Question {
  id: number;
  text: string;
  category: string; // Maps to ASSESSMENT_CATEGORIES
  options?: string[];
  type?: 'choice' | 'text';
  scoringArea: 'security' | 'cleaning';
}

export const questions: Question[] = [
  // Security Staffing & Response (Q1-5)
  {
    id: 1,
    text: 'Do you currently employ SIA-licensed security staff on-site?',
    category: 'security_staffing',
    scoringArea: 'security',
    options: [
      'No, we have no security staff',
      'No, but we have non-licensed staff',
      'Yes, part-time SIA-licensed staff',
      'Yes, full-time SIA-licensed staff'
    ]
  },
  {
    id: 2,
    text: 'Do you have dedicated concierge staff on-site?',
    category: 'security_staffing',
    scoringArea: 'security',
    options: [
      'No concierge staff',
      'Part-time concierge (limited hours)',
      'Daytime concierge only',
      '24/7 dedicated concierge staff'
    ]
  },
  {
    id: 3,
    text: 'Do you have a clear incident reporting & escalation procedure?',
    category: 'security_staffing',
    scoringArea: 'security',
    options: [
      'No formal procedure in place',
      'Basic informal process',
      'Written policy exists',
      'Comprehensive, trained, and audited procedure'
    ]
  },
  {
    id: 4,
    text: 'What level of staffing coverage do you have?',
    category: 'security_staffing',
    scoringArea: 'security',
    options: [
      'No dedicated security/concierge coverage',
      'Ad hoc / part-time contractors only',
      'Daytime coverage only',
      '24/7 professional coverage'
    ]
  },
  {
    id: 5,
    text: 'How quickly are incidents typically responded to?',
    category: 'security_staffing',
    scoringArea: 'security',
    options: [
      'Over 30 minutes or no response',
      '15-30 minutes',
      '10-15 minutes',
      'Under 10 minutes'
    ]
  },
  
  // Access Control (Q6-8)
  {
    id: 6,
    text: 'How often are access permissions updated when residents move out or staff leave?',
    category: 'access_control',
    scoringArea: 'security',
    options: [
      'Rarely or never updated',
      'Updated every few months',
      'Updated monthly',
      'Updated weekly or automated with tenancy data'
    ]
  },
  {
    id: 7,
    text: 'What type of access system do you currently use?',
    category: 'access_control',
    scoringArea: 'security',
    options: [
      'Manual keys only',
      'Basic key cards/fobs',
      'PIN codes or shared digital codes',
      'Mobile app or integrated smart access system'
    ]
  },
  {
    id: 8,
    text: 'How are visitor and contractor accesses managed?',
    category: 'access_control',
    scoringArea: 'security',
    options: [
      'Manual sign-ins or paper log only',
      'Reception staff manage access',
      'Digital booking with ID verification',
      'Integrated visitor management system with tracking'
    ]
  },
  
  // Technology & Monitoring (Q9-12)
  {
    id: 9,
    text: 'How are incidents detected?',
    category: 'technology_monitoring',
    scoringArea: 'security',
    options: [
      'Not actively monitored',
      'Reviewed only after incidents occur',
      'Manually monitored during staffed hours',
      'Automated alerts with 24/7 escalation'
    ]
  },
  {
    id: 10,
    text: 'What best describes your CCTV coverage?',
    category: 'technology_monitoring',
    scoringArea: 'security',
    options: [
      'No CCTV coverage',
      'Entrance points only',
      'Entrances and main communal areas',
      'Comprehensive coverage with live monitoring'
    ]
  },
  {
    id: 11,
    text: 'How do you manage blind spots around the property (car parks, stairwells, laundry areas)?',
    category: 'technology_monitoring',
    scoringArea: 'security',
    options: [
      'No monitoring of these areas',
      'Occasional staff patrols only',
      'Partial camera coverage',
      'Full coverage and active monitoring of all high-risk areas'
    ]
  },
  {
    id: 12,
    text: 'Do you conduct regular security audits or drills at your property?',
    category: 'technology_monitoring',
    scoringArea: 'security',
    options: [
      'No audits or drills conducted',
      'Annual audits only',
      'Bi-annual audits and occasional drills',
      'Quarterly audits with regular staff drills'
    ]
  },
  
  // Resident Experience & Safety Culture (Q13-17)
  {
    id: 13,
    text: 'How often do residents receive safety communications?',
    category: 'resident_experience',
    scoringArea: 'security',
    options: [
      'Never or very rarely',
      'Only at move-in',
      'Occasionally when issues arise',
      'Regular structured safety updates'
    ]
  },
  {
    id: 14,
    text: 'How confident do you feel residents are in the property\'s security?',
    category: 'resident_experience',
    scoringArea: 'security',
    options: [
      'Very low confidence or frequent complaints',
      'Some concerns raised by residents',
      'Generally confident with occasional feedback',
      'Very confident and reassured'
    ]
  },
  {
    id: 15,
    text: 'How do residents report safety issues?',
    category: 'resident_experience',
    scoringArea: 'security',
    options: [
      'Informally or word of mouth only',
      'Basic email or phone contact',
      'Through property management channels',
      'Central digital platform or app with tracking'
    ]
  },
  {
    id: 16,
    text: 'How visible and approachable are your staff to residents?',
    category: 'resident_experience',
    scoringArea: 'security',
    options: [
      'Rarely seen or difficult to find',
      'Occasionally visible',
      'Regularly visible during peak hours',
      'Highly visible and proactive presence'
    ]
  },
  {
    id: 17,
    text: 'Do you currently provide residents with a 24/7 emergency contact for security issues?',
    category: 'resident_experience',
    scoringArea: 'security',
    options: [
      'No emergency contact provided',
      'Emergency number but limited availability',
      'Emergency contact during business hours',
      'Dedicated 24/7 emergency security contact'
    ]
  },
  
  // Cleaning & Facilities Standards (Q18-21)
  {
    id: 18,
    text: 'How frequently are communal areas cleaned?',
    category: 'cleaning_facilities',
    scoringArea: 'cleaning',
    options: [
      'Ad hoc or when complaints arise',
      'Weekly cleaning schedule',
      'Every few days',
      'Daily professional cleaning'
    ]
  },
  {
    id: 19,
    text: 'Do you have a structured cleaning rota in place and visible to residents?',
    category: 'cleaning_facilities',
    scoringArea: 'cleaning',
    options: [
      'No structured rota',
      'Internal rota but not visible to residents',
      'Visible rota but irregularly updated',
      'Comprehensive visible rota with accountability'
    ]
  },
  {
    id: 20,
    text: 'How do you monitor or audit cleaning standards?',
    category: 'cleaning_facilities',
    scoringArea: 'cleaning',
    options: [
      'No monitoring or audits',
      'Informal occasional checks',
      'Regular management inspections',
      'Formal audit system with resident feedback integration'
    ]
  },
  {
    id: 21,
    text: 'Have you received resident complaints or feedback regarding cleanliness?',
    category: 'cleaning_facilities',
    scoringArea: 'cleaning',
    options: [
      'Frequent complaints and unresolved issues',
      'Occasional complaints that take time to resolve',
      'Rare complaints that are addressed promptly',
      'Consistently positive feedback or no complaints'
    ]
  },
  
  // Optional investment planning questions
  {
    id: 22,
    text: 'Are you planning to review or invest in security solutions in the next 6-12 months?',
    category: 'investment_planning',
    scoringArea: 'security',
    options: [
      'No plans currently',
      'Considering but no budget allocated',
      'Planning with budget allocated',
      'Active procurement process underway'
    ]
  },
  {
    id: 23,
    text: 'Which area do you see as the biggest priority for improvement?',
    category: 'investment_planning',
    scoringArea: 'security',
    options: [
      'Security staffing and response',
      'Access control systems',
      'Monitoring and technology',
      'Cleaning and facilities standards'
    ]
  },
  
  // Text question at the end (skippable)
  {
    id: 24,
    text: 'What\'s the biggest challenge you currently face with your security or concierge setup?',
    category: 'general',
    scoringArea: 'security',
    type: 'text'
  }
];