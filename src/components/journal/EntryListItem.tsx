
"use client";

import React from 'react';
import type { JournalEntry, MoodLog } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { useLanguage } from '@/hooks/useLanguage';
import { Smile, Meh, Frown, Laugh, Annoyed, Edit3 } from 'lucide-react';
import { ta } from 'date-fns/locale/ta';
import { enUS } from 'date-fns/locale/en-US';

interface EntryListItemProps {
  item: JournalEntry | MoodLog;
  type: 'journal' | 'mood';
}

const moodIcons = {
  happy: Laugh,
  calm: Smile,
  neutral: Meh,
  anxious: Annoyed,
  sad: Frown,
};

export function EntryListItem({ item, type }: EntryListItemProps) {
  const { t, language } = useLanguage();
  const locale = language === 'ta' ? ta : enUS;

  return (
    <Card className="mb-4 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          {type === 'mood' && (item as MoodLog).mood && (
            React.createElement(moodIcons[(item as MoodLog).mood] || Edit3, { className: "h-6 w-6 text-primary mr-2" })
          )}
          <CardTitle className="text-lg text-primary">
            {type === 'mood' ? t((item as MoodLog).mood as any) : t('journalEntry')} 
          </CardTitle>
          <CardDescription className="text-xs">
            {/* Ensure item.timestamp is a valid Date object before formatting */}
            {item.timestamp instanceof Date && !isNaN(item.timestamp.valueOf()) 
              ? format(item.timestamp, 'PPpp', { locale })
              : "Invalid date"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {type === 'journal' && (
          <p className="text-sm whitespace-pre-wrap">{ (item as JournalEntry).content.substring(0,200) }{(item as JournalEntry).content.length > 200 ? '...' : ''}</p>
        )}
        {type === 'mood' && (item as MoodLog).note && (
          <p className="text-sm italic text-muted-foreground">Note: {(item as MoodLog).note}</p>
        )}
         {type === 'mood' && !(item as MoodLog).note && (
          <p className="text-sm italic text-muted-foreground">No additional note.</p>
        )}
      </CardContent>
    </Card>
  );
}

// Helper translation for mood, as it's a dynamic key
const tMood = (moodKey: string, tFunc: (key: any) => string) => {
    const key = moodKey as 'happy' | 'calm' | 'neutral' | 'anxious' | 'sad';
    return tFunc(key);
}
