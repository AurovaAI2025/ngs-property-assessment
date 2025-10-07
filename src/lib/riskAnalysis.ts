// Enhanced NGS Property Readiness Assessment System
// Dual scoring: Security Readiness + Cleaning & Facilities Standards

export interface AssessmentCategory {
  id: string;
  name: string;
  weight: number; // Weight within its scoring area (0-1)
  description: string;
  scoringArea: 'security' | 'cleaning'; // Which main score this contributes to
}

export interface QuestionConfig {
  id: number;
  category: string;
  weight: number; // Importance within category (0-1)
  pointValues: number[]; // Points for each answer option (0-3 as per spec)
  criticalFactor?: boolean;
  scoringArea: 'security' | 'cleaning';
}

export interface PropertyReadinessAnalysis {
  securityScore: number; // 0-100 (higher = better)
  securityLevel: 'low' | 'medium' | 'high';
  cleaningScore: number; // 0-100 (higher = better) 
  cleaningLevel: 'low' | 'medium' | 'high';
  categoryBreakdown: {
    [categoryId: string]: {
      score: number;
      maxScore: number;
      percentage: number;
      level: 'low' | 'medium' | 'high';
      strengths: string[];
      improvements: string[];
    };
  };
  overallRecommendations: {
    security: string[];
    cleaning: string[];
    priority: string[];
  };
  textResponse?: string; // Q6 - biggest challenge
  investmentPlanning?: { // Q7 if added
    planningInvestment: boolean;
    priorities: string[];
  };
}

// Assessment Categories aligned with NGS Property Readiness structure
export const ASSESSMENT_CATEGORIES: { [key: string]: AssessmentCategory } = {
  security_staffing: {
    id: 'security_staffing',
    name: 'Security Staffing & Response',
    weight: 0.30, // 30% of security score
    description: 'SIA-licensed staff, concierge, incident procedures, coverage, response times',
    scoringArea: 'security'
  },
  access_control: {
    id: 'access_control',
    name: 'Access Control',
    weight: 0.25, // 25% of security score
    description: 'Permission updates, access systems, visitor management',
    scoringArea: 'security'
  },
  technology_monitoring: {
    id: 'technology_monitoring',
    name: 'Technology & Monitoring',
    weight: 0.25, // 25% of security score
    description: 'Incident detection, CCTV coverage, blind spot management, audits',
    scoringArea: 'security'
  },
  resident_experience: {
    id: 'resident_experience',
    name: 'Resident Experience & Safety Culture',
    weight: 0.20, // 20% of security score
    description: 'Safety communications, resident confidence, reporting channels, staff visibility, emergency contacts',
    scoringArea: 'security'
  },
  cleaning_facilities: {
    id: 'cleaning_facilities',
    name: 'Cleaning & Facilities Standards',
    weight: 1.0, // 100% of cleaning score
    description: 'Communal area cleaning, structured rotas, monitoring, resident feedback',
    scoringArea: 'cleaning'
  },
  investment_planning: {
    id: 'investment_planning',
    name: 'Investment Planning',
    weight: 0.0, // Doesn't contribute to main scores - just for analysis
    description: 'Future investment plans and priorities',
    scoringArea: 'security'
  },
  general: {
    id: 'general',
    name: 'General Feedback',
    weight: 0.0, // Doesn't contribute to main scores - just for text responses
    description: 'Open-ended feedback and comments',
    scoringArea: 'security'
  }
};

// Question configurations for NGS Property Readiness Assessment
export const QUESTION_CONFIGS: { [key: number]: QuestionConfig } = {
  // Security Staffing & Response (Q1-5)
  1: {
    id: 1,
    category: 'security_staffing',
    weight: 1.0,
    pointValues: [0, 1, 2, 3], // Points for each option (0-3)
    criticalFactor: true,
    scoringArea: 'security'
  },
  2: {
    id: 2,
    category: 'security_staffing',
    weight: 0.9,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  3: {
    id: 3,
    category: 'security_staffing',
    weight: 1.0,
    pointValues: [0, 1, 2, 3],
    criticalFactor: true,
    scoringArea: 'security'
  },
  4: {
    id: 4,
    category: 'security_staffing',
    weight: 0.8,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  5: {
    id: 5,
    category: 'security_staffing',
    weight: 0.7,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  
  // Access Control (Q6-8)
  6: {
    id: 6,
    category: 'access_control',
    weight: 1.0,
    pointValues: [0, 1, 2, 3],
    criticalFactor: true,
    scoringArea: 'security'
  },
  7: {
    id: 7,
    category: 'access_control',
    weight: 0.9,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  8: {
    id: 8,
    category: 'access_control',
    weight: 0.8,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  
  // Technology & Monitoring (Q9-12)
  9: {
    id: 9,
    category: 'technology_monitoring',
    weight: 1.0,
    pointValues: [0, 1, 2, 3],
    criticalFactor: true,
    scoringArea: 'security'
  },
  10: {
    id: 10,
    category: 'technology_monitoring',
    weight: 0.9,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  11: {
    id: 11,
    category: 'technology_monitoring',
    weight: 0.8,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  12: {
    id: 12,
    category: 'technology_monitoring',
    weight: 0.6,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  
  // Resident Experience & Safety Culture (Q13-17)
  13: {
    id: 13,
    category: 'resident_experience',
    weight: 0.7,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  14: {
    id: 14,
    category: 'resident_experience',
    weight: 0.8,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  15: {
    id: 15,
    category: 'resident_experience',
    weight: 0.6,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  16: {
    id: 16,
    category: 'resident_experience',
    weight: 0.6,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  17: {
    id: 17,
    category: 'resident_experience',
    weight: 0.7,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  
  // Cleaning & Facilities Standards (Q18-21)
  18: {
    id: 18,
    category: 'cleaning_facilities',
    weight: 1.0,
    pointValues: [0, 1, 2, 3],
    criticalFactor: true,
    scoringArea: 'cleaning'
  },
  19: {
    id: 19,
    category: 'cleaning_facilities',
    weight: 0.8,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'cleaning'
  },
  20: {
    id: 20,
    category: 'cleaning_facilities',
    weight: 0.9,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'cleaning'
  },
  21: {
    id: 21,
    category: 'cleaning_facilities',
    weight: 0.7,
    pointValues: [0, 1, 2, 3], // Note: This is reverse scored (complaints = bad)
    scoringArea: 'cleaning'
  },
  
  // Investment Planning (Q22-23) - optional scoring
  22: {
    id: 22,
    category: 'investment_planning',
    weight: 0.3,
    pointValues: [0, 1, 2, 3],
    scoringArea: 'security'
  },
  23: {
    id: 23,
    category: 'investment_planning',
    weight: 0.2,
    pointValues: [0, 0, 0, 0], // This doesn't affect scores, just for analysis
    scoringArea: 'security'
  }
  // Q24 (text question) - not scored
};

export function analyzePropertyReadiness(responses: any[], textResponse?: string): PropertyReadinessAnalysis {
  // Initialize category tracking
  const categoryData: { [key: string]: { totalPoints: number; maxPoints: number; weightedScore: number; totalWeight: number; hasCriticalIssue: boolean } } = {};
  
  // Initialize all categories
  Object.values(ASSESSMENT_CATEGORIES).forEach(category => {
    categoryData[category.id] = {
      totalPoints: 0,
      maxPoints: 0,
      weightedScore: 0,
      totalWeight: 0,
      hasCriticalIssue: false
    };
  });

  let securityTotalWeighted = 0;
  let securityMaxWeighted = 0;
  let cleaningTotalWeighted = 0;
  let cleaningMaxWeighted = 0;

  // Process each response
  responses.forEach((response, index) => {
    const questionId = index + 1;
    const config = QUESTION_CONFIGS[questionId];
    
    if (!config || config.pointValues.length === 0) return; // Skip text questions or invalid configs
    
    const answerIndex = typeof response === 'number' ? response : (response?.score || 0);
    const points = config.pointValues[answerIndex] || 0;
    const maxPoints = Math.max(...config.pointValues);
    
    // Handle reverse scoring for complaints question (Q21)
    const actualPoints = questionId === 21 ? (maxPoints - points) : points;
    const actualMaxPoints = maxPoints;
    
    // Check for critical issues (scoring 0 on critical factor questions)
    if (config.criticalFactor && actualPoints === 0) {
      categoryData[config.category].hasCriticalIssue = true;
    }
    
    // Add to category totals
    const category = categoryData[config.category];
    if (!category) {
      console.warn(`Category ${config.category} not found for question ${questionId}`);
      return; // Skip this question if category doesn't exist
    }
    
    category.totalPoints += actualPoints;
    category.maxPoints += actualMaxPoints;
    category.weightedScore += actualPoints * config.weight;
    category.totalWeight += actualMaxPoints * config.weight;
    
    // Add to overall scoring area totals (only if category has weight)
    const categoryWeight = ASSESSMENT_CATEGORIES[config.category].weight;
    
    if (categoryWeight > 0) {
      const weightedPoints = actualPoints * config.weight * categoryWeight;
      const weightedMaxPoints = actualMaxPoints * config.weight * categoryWeight;
      
      if (config.scoringArea === 'security') {
        securityTotalWeighted += weightedPoints;
        securityMaxWeighted += weightedMaxPoints;
      } else if (config.scoringArea === 'cleaning') {
        cleaningTotalWeighted += weightedPoints;
        cleaningMaxWeighted += weightedMaxPoints;
      }
    }
  });

  // Calculate final scores
  const securityScore = securityMaxWeighted > 0 ? Math.round((securityTotalWeighted / securityMaxWeighted) * 100) : 0;
  const cleaningScore = cleaningMaxWeighted > 0 ? Math.round((cleaningTotalWeighted / cleaningMaxWeighted) * 100) : 0;
  
  // Determine levels based on NGS specification
  const getLevel = (score: number, hasCritical: boolean): 'low' | 'medium' | 'high' => {
    if (hasCritical || score <= 40) return 'low';
    if (score <= 70) return 'medium';
    return 'high';
  };
  
  // Check for critical issues in security categories
  const hasSecurityCritical = Object.entries(categoryData)
    .filter(([catId]) => ASSESSMENT_CATEGORIES[catId]?.scoringArea === 'security')
    .some(([_, data]) => data.hasCriticalIssue);
    
  const hasCleaningCritical = categoryData.cleaning_facilities?.hasCriticalIssue || false;
  
  const securityLevel = getLevel(securityScore, hasSecurityCritical);
  const cleaningLevel = getLevel(cleaningScore, hasCleaningCritical);

  // Build category breakdown
  const categoryBreakdown: { [key: string]: any } = {};
  Object.entries(categoryData).forEach(([categoryId, data]) => {
    // Skip categories that don't contribute to scoring (like investment_planning, general)
    const category = ASSESSMENT_CATEGORIES[categoryId];
    if (!category || category.weight === 0) {
      return; // Skip zero-weight categories from breakdown
    }
    
    const percentage = data.maxPoints > 0 ? Math.round((data.totalPoints / data.maxPoints) * 100) : 0;
    const level = getLevel(percentage, data.hasCriticalIssue);
    
    categoryBreakdown[categoryId] = {
      score: data.totalPoints,
      maxScore: data.maxPoints,
      percentage,
      level,
      strengths: getStrengthsForCategory(categoryId, percentage, level),
      improvements: getImprovementsForCategory(categoryId, percentage, level)
    };
  });

  // Generate recommendations
  const overallRecommendations = {
    security: getSecurityRecommendations(securityLevel, categoryBreakdown),
    cleaning: getCleaningRecommendations(cleaningLevel, categoryBreakdown),
    priority: getPriorityActions(securityLevel, cleaningLevel, categoryBreakdown)
  };

  return {
    securityScore,
    securityLevel,
    cleaningScore,
    cleaningLevel,
    categoryBreakdown,
    overallRecommendations,
    textResponse
  };
}

// Helper functions for generating insights and recommendations

function getStrengthsForCategory(categoryId: string, percentage: number, level: 'low' | 'medium' | 'high'): string[] {
  const strengths: string[] = [];
  
  if (level === 'high') {
    switch (categoryId) {
      case 'security_staffing':
        strengths.push('Strong security staffing presence');
        strengths.push('Effective incident response procedures');
        break;
      case 'access_control':
        strengths.push('Robust access management systems');
        strengths.push('Regular permission updates');
        break;
      case 'technology_monitoring':
        strengths.push('Comprehensive monitoring coverage');
        strengths.push('Advanced detection systems');
        break;
      case 'resident_experience':
        strengths.push('Strong resident confidence');
        strengths.push('Effective communication channels');
        break;
      case 'cleaning_facilities':
        strengths.push('Consistent cleaning standards');
        strengths.push('Structured maintenance approach');
        break;
    }
  } else if (level === 'medium') {
    strengths.push('Foundation systems in place');
    strengths.push('Room for enhancement identified');
  }
  
  return strengths;
}

function getImprovementsForCategory(categoryId: string, percentage: number, level: 'low' | 'medium' | 'high'): string[] {
  const improvements: string[] = [];
  
  switch (categoryId) {
    case 'security_staffing':
      if (level === 'low') {
        improvements.push('Deploy SIA-licensed security staff');
        improvements.push('Establish 24/7 coverage');
        improvements.push('Implement formal incident procedures');
      } else if (level === 'medium') {
        improvements.push('Enhance staff training programs');
        improvements.push('Improve response time targets');
      }
      break;
    
    case 'access_control':
      if (level === 'low') {
        improvements.push('Upgrade to smart access systems');
        improvements.push('Implement regular permission reviews');
        improvements.push('Deploy visitor management system');
      } else if (level === 'medium') {
        improvements.push('Automate access management');
        improvements.push('Enhance visitor tracking');
      }
      break;
    
    case 'technology_monitoring':
      if (level === 'low') {
        improvements.push('Install comprehensive CCTV coverage');
        improvements.push('Deploy automated monitoring systems');
        improvements.push('Address blind spots');
      } else if (level === 'medium') {
        improvements.push('Upgrade to intelligent monitoring');
        improvements.push('Enhance alert systems');
      }
      break;
    
    case 'resident_experience':
      if (level === 'low') {
        improvements.push('Establish regular safety communications');
        improvements.push('Deploy digital reporting platform');
        improvements.push('Increase staff visibility');
      } else if (level === 'medium') {
        improvements.push('Enhance communication frequency');
        improvements.push('Improve feedback mechanisms');
      }
      break;
    
    case 'cleaning_facilities':
      if (level === 'low') {
        improvements.push('Implement daily cleaning schedule');
        improvements.push('Deploy visible cleaning rotas');
        improvements.push('Establish audit systems');
      } else if (level === 'medium') {
        improvements.push('Enhance monitoring systems');
        improvements.push('Improve resident feedback integration');
      }
      break;
  }
  
  return improvements;
}

function getSecurityRecommendations(level: 'low' | 'medium' | 'high', categoryBreakdown: any): string[] {
  const recommendations: string[] = [];
  
  if (level === 'low') {
    recommendations.push('Immediate review of access control and monitoring systems');
    recommendations.push('Deploy SIA-licensed security personnel');
    recommendations.push('Implement comprehensive incident reporting procedures');
    recommendations.push('Establish 24/7 emergency contact system');
  } else if (level === 'medium') {
    recommendations.push('Strengthen monitoring and access control consistency');
    recommendations.push('Formalize staff training and reporting procedures');
    recommendations.push('Address compliance gaps to reduce liability');
  } else {
    recommendations.push('Regular compliance checks and audits');
    recommendations.push('Explore advanced monitoring or AI-driven solutions');
    recommendations.push('Enhance resident experience through proactive security presence');
  }
  
  return recommendations;
}

function getCleaningRecommendations(level: 'low' | 'medium' | 'high', categoryBreakdown: any): string[] {
  const recommendations: string[] = [];
  
  if (level === 'low') {
    recommendations.push('Implement structured cleaning rota with visible accountability');
    recommendations.push('Deploy formal audit and monitoring systems');
    recommendations.push('Establish resident feedback mechanisms');
  } else if (level === 'medium') {
    recommendations.push('Strengthen audit systems and consistency');
    recommendations.push('Enhance communication with residents about cleaning standards');
    recommendations.push('Implement continuous improvement processes');
  } else {
    recommendations.push('Maintain current standards through regular reviews');
    recommendations.push('Introduce innovation and continuous improvement');
    recommendations.push('Align cleaning with wider resident experience goals');
  }
  
  return recommendations;
}

function getPriorityActions(securityLevel: 'low' | 'medium' | 'high', cleaningLevel: 'low' | 'medium' | 'high', categoryBreakdown: any): string[] {
  const priorities: string[] = [];
  
  // Determine most urgent areas
  if (securityLevel === 'low') {
    priorities.push('URGENT: Address critical security vulnerabilities immediately');
    priorities.push('Deploy professional security assessment and implementation');
  }
  
  if (cleaningLevel === 'low') {
    priorities.push('Implement structured cleaning and maintenance programs');
  }
  
  // Add category-specific priorities based on lowest scores
  const sortedCategories = Object.entries(categoryBreakdown)
    .sort(([,a], [,b]) => a.percentage - b.percentage);
  
  sortedCategories.slice(0, 2).forEach(([categoryId, data]: [string, any]) => {
    if (data.level === 'low') {
      const category = ASSESSMENT_CATEGORIES[categoryId];
      if (category) {
        priorities.push(`High Priority: Improve ${category.name}`);
      }
    }
  });
  
  if (priorities.length === 0) {
    priorities.push('Continue maintaining high standards across all areas');
    priorities.push('Focus on continuous improvement and innovation');
  }
  
  return priorities.slice(0, 5);
}
