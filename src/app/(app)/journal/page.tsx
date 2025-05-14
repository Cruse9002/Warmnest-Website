
"use client";

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoodSelector } from '@/components/journal/MoodSelector';
import { JournalForm } from '@/components/journal/JournalForm';
import { EntryListItem } from '@/components/journal/EntryListItem';
import type { MoodLog, JournalEntry } from '@/types';
import { useLanguage } from '@/hooks/useLanguage';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ta } from 'date-fns/locale/ta';
import { enUS } from 'date-fns/locale/en-US';


const JOURNAL_LS_KEY = 'warmnest-journal';
const MOODLOG_LS_KEY = 'warmnest-moodlog';

export default function JournalPage() {
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]);
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const locale = language === 'ta' ? ta : enUS;

  // Load from localStorage on mount
  useEffect(() => {
    const storedMoods = localStorage.getItem(MOODLOG_LS_KEY);
    if (storedMoods) {
      setMoodLogs(JSON.parse(storedMoods).map((log: any) => ({...log, timestamp: new Date(log.timestamp)})));
    }
    const storedEntries = localStorage.getItem(JOURNAL_LS_KEY);
    if (storedEntries) {
      setJournalEntries(JSON.parse(storedEntries).map((entry: any) => ({...entry, timestamp: new Date(entry.timestamp)})));
    }
  }, []);

  const handleSaveMood = (newMoodLog: Omit<MoodLog, 'id' | 'timestamp'>) => {
    const moodLogWithTimestamp: MoodLog = { 
      ...newMoodLog, 
      id: Date.now().toString(), 
      timestamp: new Date() 
    };
    const updatedMoodLogs = [moodLogWithTimestamp, ...moodLogs];
    setMoodLogs(updatedMoodLogs);
    localStorage.setItem(MOODLOG_LS_KEY, JSON.stringify(updatedMoodLogs));
    toast({ title: "Mood Saved", description: `You're feeling ${t(newMoodLog.mood as any)}.` });
  };

  const handleSaveEntry = (newEntry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    const entryWithTimestamp: JournalEntry = { 
      ...newEntry, 
      id: Date.now().toString(), 
      timestamp: new Date() 
    };
    const updatedEntries = [entryWithTimestamp, ...journalEntries];
    setJournalEntries(updatedEntries);
    localStorage.setItem(JOURNAL_LS_KEY, JSON.stringify(updatedEntries));
    toast({ title: "Journal Entry Saved", description: "Your thoughts have been recorded." });
  };

  return (
    <Tabs defaultValue="mood" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="mood">{t('moodLog')}</TabsTrigger>
        <TabsTrigger value="journal">{t('journalEntries')}</TabsTrigger>
      </TabsList>
      
      <TabsContent value="mood" className="space-y-6">
        <MoodSelector onSaveMood={handleSaveMood} />
        <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">Recent Moods</h3>
        {moodLogs.length > 0 ? (
          <ScrollArea className="h-[400px] pr-4">
            {moodLogs.map(log => (
              <EntryListItem key={log.id} item={log} type="mood" locale={locale} />
            ))}
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-4">{t('howAreYouFeeling')}</p>
        )}
      </TabsContent>
      
      <TabsContent value="journal" className="space-y-6">
        <JournalForm onSaveEntry={handleSaveEntry} />
        <h3 className="text-xl font-semibold mt-8 mb-4 text-primary">Past Entries</h3>
        {journalEntries.length > 0 ? (
           <ScrollArea className="h-[400px] pr-4">
            {journalEntries.map(entry => (
              <EntryListItem key={entry.id} item={entry} type="journal" locale={locale} />
            ))}
          </ScrollArea>
        ) : (
          <p className="text-muted-foreground text-center py-4">{t('noEntriesYet')}</p>
        )}
      </TabsContent>
    </Tabs>
  );
}
