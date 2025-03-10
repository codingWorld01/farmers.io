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
    
    // Get the last user message
    const lastUserMessage = messages[messages.length - 1];
    if (lastUserMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }
    
    // Combine system instructions with user message for the most recent query
    const enhancedUserMessage = `${systemPrompt}\n\nUser query: ${lastUserMessage.content}`;
    
    // Properly format chat history for Gemini
    // Important: We'll use a different approach that doesn't rely on the history parameter
    // since that's causing the validation error
    
    // Create a new chat instance (without history in constructor)
    const chat = model.startChat({
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      },
      safetySettings,
    });
    
    // For all previous messages (except the last one), send them one by one to build up history
    if (messages.length > 1) {
      for (let i = 0; i < messages.length - 1; i += 2) {
        // We need to process messages in user-assistant pairs
        if (i + 1 < messages.length - 1) {
          const userMsg = messages[i].role === 'user' ? messages[i] : messages[i + 1];
          
          // Skip if we don't have a proper user message
          if (userMsg.role !== 'user') continue;
          
          // Send previous messages to build history (but don't use the responses)
          await chat.sendMessage(userMsg.content);
        }
      }
    }
    
    // Finally, send the enhanced user message and return the response
    const result = await chat.sendMessage(enhancedUserMessage);
    return result.response.text();
  } catch (error) {
    console.error('Gemini AI API Error:', error);
    throw error;
  }
}