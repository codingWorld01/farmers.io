import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

// Initialize the Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function getChatResponse(messages: { role: 'user' | 'assistant'; content: string }[], language: string) {
  try {
    // Create a model instance
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
    
    // Safety settings
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    
    // Prepare conversation history for Gemini
    const history = [];
    
    // Add all previous messages except the last one
    for (let i = 0; i < messages.length - 1; i++) {
      const msg = messages[i];
      history.push({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      });
    }
    
    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }
    
    // Start chat session
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      safetySettings,
      history: history.length > 0 ? history : undefined,
    });
    
    // Get language name based on language code
    const languageMap: {[key: string]: string} = {
      'en': 'English',
      'hi': 'Hindi',
      'mr': 'Marathi',
      'ta': 'Tamil',
      'te': 'Telugu',
      'kn': 'Kannada',
      'ml': 'Malayalam',
      'pa': 'Punjabi',
      'bn': 'Bengali',
      'gu': 'Gujarati'
    };
    
    const languageName = languageMap[language] || 'English';
    
    // Prepare system prompt with language instruction
    const systemPrompt = `You are a helpful farming assistant that provides advice about agriculture, crop management, and farming best practices. Your responses should be culturally relevant to Indian farmers. Respond in ${languageName}.`;
    
    // Combine system instructions with user message
    const userMessageWithContext = `${systemPrompt}\n\nUser query: ${lastUserMessage.content}`;
    
    // Send message and get response
    const result = await chat.sendMessage(userMessageWithContext);
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI API Error:', error);
    throw error;
  }
}