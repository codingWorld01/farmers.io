import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageSquare, Send, X, Loader2, Globe } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { getChatResponse } from '../api/gemini';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
}

export function ChatBot() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const languageOptions: LanguageOption[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
    { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: t('chat.welcome', 'Welcome to the Farming Assistant! How can I help you with your agricultural queries today? You Can Change Language by Clicking on Language icon.')
        }
      ]);
    }
  }, [isOpen, messages.length, t]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await getChatResponse([...messages, { role: 'user', content: userMessage }], i18n.language);
      setMessages(prev => [...prev, { role: 'assistant', content: response || t('chat.error') }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: t('chat.error', 'Sorry, I encountered an error. Please try again later.')
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const changeLanguage = (languageCode: string) => {
    i18n.changeLanguage(languageCode);
    setShowLanguageSelector(false);
    setMessages(prev => [
      ...prev,
      {
        role: 'assistant',
        content: t('chat.languageChanged', 'Language changed successfully. How can I help you?')
      }
    ]);
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <button
          className="fixed bottom-4 right-4 bg-green-600 text-white p-3 sm:p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-50"
          aria-label="Open chat"
        >
          <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6" />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed bottom-0 right-0 w-full max-w-md sm:bottom-4 sm:right-4 h-[90vh] sm:h-auto bg-white rounded-t-2xl sm:rounded-lg shadow-xl z-50">
          <div className="flex items-center justify-between p-4 border-b">
            <Dialog.Title className="text-base sm:text-lg font-semibold">
              {t('chat.title', 'Farming Assistant')}
            </Dialog.Title>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowLanguageSelector(!showLanguageSelector)}
                className="text-gray-500 hover:text-gray-700 transition-colors p-1"
                title={t('chat.changeLanguage', 'Change Language')}
              >
                <Globe className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <Dialog.Close className="text-gray-400 hover:text-gray-500 p-1">
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Dialog.Close>
            </div>
          </div>

          {showLanguageSelector && (
            <div className="max-h-48 overflow-y-auto p-3 border-b bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`text-left px-2 py-1 sm:px-3 sm:py-2 rounded-md transition-colors text-sm ${i18n.language === lang.code
                        ? 'bg-green-100 text-green-800'
                        : 'hover:bg-gray-100'
                      }`}
                  >
                    <div className="font-medium">{lang.name}</div>
                    <div className="text-xs text-gray-600">{lang.nativeName}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex-1 h-[calc(90vh-170px)] sm:h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[80%] rounded-lg p-3 text-sm sm:text-base ${message.role === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                    }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder', 'Type your farming question...')}
                className="flex-1 border rounded-lg px-3 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </form>
          </div>



        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}