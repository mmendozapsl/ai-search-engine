const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

// Initialize OpenAI client
let openaiClient = null;

const initOpenAI = () => {
  if (!openaiClient && process.env.OPENAI_API_KEY) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
};

// Read and process the search prompt template
const getSearchPrompt = async (query, jsonData) => {
  try {
    const promptPath = path.join(__dirname, '../config/search-prompt.md');
    let promptTemplate = await fs.readFile(promptPath, 'utf8');
    
    // Replace placeholders with actual values
    promptTemplate = promptTemplate.replace('{{QUERY}}', query);
    promptTemplate = promptTemplate.replace('{{JSON_DATA}}', JSON.stringify(jsonData, null, 2));
    
    return promptTemplate;
  } catch (error) {
    console.error('Error reading search prompt template:', error);
    throw new Error('Failed to load search prompt template');
  }
};

// Perform AI search using OpenAI
const performAISearch = async (query, contextData) => {
  try {
    const client = initOpenAI();
    
    if (!client) {
      throw new Error('OpenAI API key not configured');
    }
    
    // Parse context data if it's a string
    let parsedContext;
    try {
      parsedContext = typeof contextData === 'string' ? JSON.parse(contextData) : contextData;
    } catch (parseError) {
      console.error('Error parsing context data:', parseError);
      // If context is not valid JSON, use empty array
      parsedContext = [];
    }
    
    // Validate that parsedContext is an array
    if (!Array.isArray(parsedContext)) {
      console.warn('Context data is not an array, using empty array');
      parsedContext = [];
    }
    
    // Get the search prompt
    const prompt = await getSearchPrompt(query, parsedContext);
    
    // Call OpenAI API
    const completion = await client.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a precise search engine that returns only JSON arrays. Follow the instructions exactly and return only valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });
    
    const response = completion.choices[0].message.content.trim();
    
    // Parse the JSON response
    let searchResults;
    try {
      // Remove any markdown code block formatting if present
      const cleanResponse = response.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      searchResults = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Raw response:', response);
      throw new Error('Invalid JSON response from AI search');
    }
    
    // Validate that the response is an array
    if (!Array.isArray(searchResults)) {
      console.error('AI response is not an array:', searchResults);
      throw new Error('AI search returned invalid format');
    }
    
    return searchResults;
    
  } catch (error) {
    console.error('Error performing AI search:', error);
    throw error;
  }
};

module.exports = {
  initOpenAI,
  performAISearch,
  getSearchPrompt
};
