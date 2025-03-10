import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' }
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-100">
        <Globe className="w-5 h-5" />
        <span>{languages.find(lang => lang.code === i18n.language)?.name || 'Language'}</span>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-2 min-w-[150px]">
          {languages.map((language) => (
            <DropdownMenu.Item
              key={language.code}
              className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
              onClick={() => i18n.changeLanguage(language.code)}
            >
              {language.name}
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}