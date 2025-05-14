
"use client";

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PomodoroTimer } from "@/components/focus/PomodoroTimer";
import { TwoMinuteRule } from "@/components/focus/TwoMinuteRule";
import { useLanguage } from "@/hooks/useLanguage";
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FocusModePage() {
  const { t } = useLanguage();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">{t('focusModeTitle')}</h1>
        <p className="text-muted-foreground">{t('focusModeDescription')}</p>
      </section>

      <Tabs defaultValue="pomodoro" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="pomodoro">{t('pomodoroTechnique')}</TabsTrigger>
          <TabsTrigger value="2minrule">{t('twoMinuteRule')}</TabsTrigger>
        </TabsList>

        <TabsContent value="pomodoro">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{t('pomodoroTechnique')}</CardTitle>
              <CardDescription>{t('pomodoroDescription')}</CardDescription>
            </CardHeader>
            <PomodoroTimer />
          </Card>
        </TabsContent>

        <TabsContent value="2minrule">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl text-primary">{t('twoMinuteRule')}</CardTitle>
              <CardDescription>{t('twoMinuteRuleDescription')}</CardDescription>
            </CardHeader>
            <TwoMinuteRule />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

    