// Debug script to test the analyzePropertyReadiness function
// Run this in browser console to test the analysis

// Test data - simulate 24 questions with sample responses
const testResponses = [
  // Q1-5: Security Staffing (0-3 points each)
  1, 2, 1, 0, 2,
  // Q6-8: Access Control 
  1, 2, 1,
  // Q9-12: Technology & Monitoring
  0, 1, 1, 2,
  // Q13-17: Resident Experience
  1, 2, 1, 2, 1,
  // Q18-21: Cleaning & Facilities
  2, 1, 2, 1,
  // Q22-23: Investment Planning (optional)
  2, 0,
  // Q24: Text question (not scored) - will be skipped
];

console.log('🧪 Testing analyzePropertyReadiness with sample data:');
console.log('Test responses:', testResponses);

try {
  // This should match what happens in the assessment page
  const result = analyzePropertyReadiness(testResponses, "Test challenge text");
  
  console.log('✅ Analysis successful!');
  console.log('Security Score:', result.securityScore);
  console.log('Cleaning Score:', result.cleaningScore);
  console.log('Security Level:', result.securityLevel);
  console.log('Cleaning Level:', result.cleaningLevel);
  console.log('Category Breakdown:', result.categoryBreakdown);
  
} catch (error) {
  console.error('❌ Analysis failed:', error);
  console.error('Stack trace:', error.stack);
}

// Test individual components
console.log('\n🔍 Debugging individual components:');

// Check categories
console.log('Available categories:');
Object.keys(ASSESSMENT_CATEGORIES).forEach(catId => {
  console.log(`- ${catId}: weight=${ASSESSMENT_CATEGORIES[catId].weight}`);
});

// Check question configs
console.log('\nQuestion configs for Q22-24:');
for (let i = 22; i <= 24; i++) {
  const config = QUESTION_CONFIGS[i];
  console.log(`Q${i}:`, config ? `category=${config.category}, weight=${config.weight}` : 'NOT CONFIGURED');
}