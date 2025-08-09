#!/usr/bin/env node

// Load environment variables
require('dotenv').config();

// Test script for AI search functionality
const { performAISearch } = require('./src/utils/openai');

// Sample context data for testing
const sampleContext = [
  {
    "title": "Advanced Cancer Treatment Options",
    "description": "Comprehensive guide to modern cancer treatment approaches including immunotherapy, targeted therapy, and precision medicine",
    "url": "https://medical-education.com/cancer-treatment-guide",
    "tags": ["cancer", "treatment", "immunotherapy", "oncology", "precision-medicine"]
  },
  {
    "title": "CME: Cardiovascular Disease Prevention",
    "description": "Continuing Medical Education course covering prevention strategies for cardiovascular disease in primary care",
    "url": "https://cme-provider.com/cardio-prevention",
    "tags": ["cardiovascular", "prevention", "cme", "primary-care", "heart-disease"]
  },
  {
    "title": "Diabetes Management in Clinical Practice",
    "description": "Evidence-based approaches to diabetes management including medication selection and lifestyle interventions",
    "url": "https://medical-education.com/diabetes-management",
    "tags": ["diabetes", "management", "clinical-practice", "medication", "lifestyle"]
  }
];

async function testAISearch() {
  try {
    console.log('Testing AI search functionality...\n');
    
    const query = "cancer treatment";
    console.log(`Query: "${query}"`);
    console.log('Context data:', JSON.stringify(sampleContext, null, 2));
    
    const results = await performAISearch(query, sampleContext);
    
    console.log('\n=== AI Search Results ===');
    console.log(JSON.stringify(results, null, 2));
    
  } catch (error) {
    console.error('Error testing AI search:', error.message);
    console.error('This is expected if OPENAI_API_KEY is not set in .env file');
    
    if (error.message.includes('OpenAI API key')) {
      console.log('\n📋 To fix this:');
      console.log('1. Get an OpenAI API key from https://platform.openai.com/api-keys');
      console.log('2. Add it to backend/.env file:');
      console.log('   OPENAI_API_KEY=your_actual_api_key_here');
      console.log('3. Restart the server');
    }
  }
}

// Only run if called directly
if (require.main === module) {
  testAISearch();
}

module.exports = { testAISearch };
