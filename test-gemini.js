// Quick test script to check which Gemini models are available with your API key
const API_KEY = 'AIzaSyAFWo4G2pvvWQOdHKn0_hncrfjP340SZe0';

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Error listing models:', error);
      return;
    }
    
    const data = await response.json();
    console.log('Available models:');
    data.models?.forEach(model => {
      console.log(`- ${model.name} (supports: ${model.supportedGenerationMethods?.join(', ')})`);
    });
  } catch (error) {
    console.error('Failed to list models:', error.message);
  }
}

listModels();
