
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { BookOpen, MessageCircle, Wind, Edit3 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  // Mock data - replace with actual data fetching
  const lastMood = { mood: "Calm", timestamp: new Date(Date.now() - 3600 * 1000 * 5) }; // 5 hours ago
  const recentEntry = { title: "Thoughts on today", timestamp: new Date(Date.now() - 3600 * 1000 * 26) }; // 26 hours ago

  const quickActions = [
    { titleKey: "startBreathingExercise", href: "/breathing", icon: Wind, color: "text-teal-500", bgColor: "bg-teal-50" },
    { titleKey: "chatWithBot", href: "/chatbot", icon: MessageCircle, color: "text-blue-500", bgColor: "bg-blue-50" },
    { titleKey: "logYourMood", href: "/journal", icon: Edit3, color: "text-amber-500", bgColor: "bg-amber-50" },
    { titleKey: "writeInJournal", href: "/journal", icon: BookOpen, color: "text-purple-500", bgColor: "bg-purple-50" },
  ];


  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-3xl font-bold text-foreground">
          {t('welcomeUser')}, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground">
          {t('howAreYouFeeling')}
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map(action => (
            <Card key={action.titleKey} className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${action.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm font-medium ${action.color}`}>{t(action.titleKey)}</CardTitle>
                <action.icon className={`h-6 w-6 ${action.color}`} />
              </CardHeader>
              <CardContent>
                <Button asChild variant="link" className={`p-0 h-auto ${action.color}`}>
                  <Link href={action.href}>{t('appName')}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('lastLoggedMood')}</CardTitle>
          </CardHeader>
          <CardContent>
            {lastMood ? (
              <p className="text-lg">You felt <span className="font-semibold text-primary">{lastMood.mood}</span> {formatTimeAgo(lastMood.timestamp, t('english') as 'en' | 'ta')}.</p>
            ) : (
              <p className="text-muted-foreground">No mood logged recently.</p>
            )}
            <Button asChild variant="outline" className="mt-4">
              <Link href="/journal">{t('logYourMood')}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>{t('recentJournalEntry')}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentEntry ? (
               <p className="text-lg">"<span className="italic text-primary">{recentEntry.title}</span>" written {formatTimeAgo(recentEntry.timestamp, t('english') as 'en' | 'ta')}.</p>
            ) : (
              <p className="text-muted-foreground">{t('noEntriesYet')}</p>
            )}
             <Button asChild variant="outline" className="mt-4">
              <Link href="/journal">{t('writeInJournal')}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

    </div>
  );
}

// Helper function (ideally in utils, but here for simplicity)
function formatTimeAgo(date: Date, lang: 'en' | 'ta'): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? " years ago" : " ஆண்டுகளுக்கு முன்பு");
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? " months ago" : " மாதங்களுக்கு முன்பு");
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? " days ago" : " நாட்களுக்கு முன்பு");
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? " hours ago" : " மணிநேரங்களுக்கு முன்பு");
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? " minutes ago" : " நிமிடங்களுக்கு முன்பு");
  return Math.floor(seconds) + (lang === 'en' ? " seconds ago" : " விநாடிகளுக்கு முன்பு");
}

