
"use client";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';
import type { JournalEntry } from '@/types';
import React, { useState } from 'react';

interface JournalFormProps {
  onSaveEntry: (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => void;
}

export function JournalForm({ onSaveEntry }: JournalFormProps) {
  const [content, setContent] = useState('');
  const { t } = useLanguage();

  const handleSave = () => {
    if (content.trim()) {
      onSaveEntry({ content });
      setContent('');
    }
  };

  return (
    <div className="space-y-4 p-6 border rounded-lg shadow-md bg-card">
      <h3 className="text-xl font-semibold text-primary">{t('writeYourThoughts')}</h3>
      <Textarea
        placeholder="What's on your mind?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={8}
        className="min-h-[200px] focus:ring-primary"
      />
      <Button onClick={handleSave} disabled={!content.trim()} className="w-full bg-primary hover:bg-primary/90">
        {t('saveEntry')}
      </Button>
    </div>
  );
}
