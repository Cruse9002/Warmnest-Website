
"use client";

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/hooks/useLanguage';
import type { MoodLog } from '@/types';
import { Smile, Meh, Frown, Laugh, Annoyed } from 'lucide-react'; // Using different icons for variety
import React, { useState } from 'react';

interface MoodSelectorProps {
  onSaveMood: (moodLog: Omit<MoodLog, 'id' | 'timestamp'>) => void;
}

type MoodOption = {
  name: 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad';
  icon: React.ElementType;
  labelKey: 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad';
  color: string;
  hoverColor: string;
};

const moodOptions: MoodOption[] = [
  { name: 'happy', icon: Laugh, labelKey: 'happy', color: 'bg-yellow-400', hoverColor: 'hover:bg-yellow-500' },
  { name: 'calm', icon: Smile, labelKey: 'calm', color: 'bg-green-400', hoverColor: 'hover:bg-green-500' },
  { name: 'neutral', icon: Meh, labelKey: 'neutral', color: 'bg-blue-400', hoverColor: 'hover:bg-blue-500' },
  { name: 'anxious', icon: Annoyed, labelKey: 'anxious', color: 'bg-orange-400', hoverColor: 'hover:bg-orange-500' },
  { name: 'sad', icon: Frown, labelKey: 'sad', color: 'bg-indigo-400', hoverColor: 'hover:bg-indigo-500' },
];

export function MoodSelector({ onSaveMood }: MoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodOption['name'] | null>(null);
  const [note, setNote] = useState('');
  const { t } = useLanguage();

  const handleSave = () => {
    if (selectedMood) {
      onSaveMood({ mood: selectedMood, note });
      setSelectedMood(null);
      setNote('');
    }
  };

  return (
    <div className="space-y-6 p-6 border rounded-lg shadow-md bg-card">
      <h3 className="text-xl font-semibold text-center text-primary">{t('howAreYouFeeling')}</h3>
      <div className="flex justify-around items-center gap-2 flex-wrap">
        {moodOptions.map(option => (
          <Button
            key={option.name}
            variant="outline"
            size="lg"
            className={`flex flex-col items-center justify-center h-24 w-24 p-2 rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105
              ${selectedMood === option.name ? `${option.color} text-white ring-2 ring-offset-2 ring-primary` : 'bg-muted hover:bg-muted/80'}`}
            onClick={() => setSelectedMood(option.name)}
            aria-label={t(option.labelKey)}
          >
            <option.icon className={`h-10 w-10 mb-1 ${selectedMood === option.name ? 'text-white': 'text-foreground'}`} />
            <span className="text-xs">{t(option.labelKey)}</span>
          </Button>
        ))}
      </div>
      <Textarea
        placeholder={t('addANote')}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="focus:ring-primary"
      />
      <Button onClick={handleSave} disabled={!selectedMood} className="w-full bg-primary hover:bg-primary/90">
        {t('saveMood')}
      </Button>
    </div>
  );
}
