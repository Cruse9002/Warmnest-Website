
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { BookOpen, MessageCircle, Wind, Edit3, Smile, CalendarDays, TrendingUp, UserCircle } from "lucide-react";
import Link from "next/link";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"


// Mock data - replace with actual data fetching
const lastMood = { mood: "Calm", timestamp: new Date(Date.now() - 3600 * 1000 * 5) }; // 5 hours ago
const recentEntry = { title: "Thoughts on today", timestamp: new Date(Date.now() - 3600 * 1000 * 26) }; // 26 hours ago

const quickActions = [
  { titleKey: "startBreathingExercise", href: "/breathing", icon: Wind, color: "text-teal-500 dark:text-teal-400", bgColor: "bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-100 dark:hover:bg-teal-800/50" },
  { titleKey: "chatWithBot", href: "/chatbot", icon: MessageCircle, color: "text-blue-500 dark:text-blue-400", bgColor: "bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-800/50" },
  { titleKey: "logYourMood", href: "/journal", icon: Edit3, color: "text-amber-500 dark:text-amber-400", bgColor: "bg-amber-50 dark:bg-amber-900/30 hover:bg-amber-100 dark:hover:bg-amber-800/50" },
  { titleKey: "writeInJournal", href: "/journal", icon: BookOpen, color: "text-purple-500 dark:text-purple-400", bgColor: "bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-800/50" },
];

// Mock mood data for chart
const moodChartData = [
  { date: "Mon", moodScore: 3 }, // 1: Sad, 2: Anxious, 3: Neutral, 4: Calm, 5: Happy
  { date: "Tue", moodScore: 4 },
  { date: "Wed", moodScore: 2 },
  { date: "Thu", moodScore: 5 },
  { date: "Fri", moodScore: 3 },
  { date: "Sat", moodScore: 4 },
  { date: "Sun", moodScore: 5 },
];

const chartConfig = {
  moodScore: {
    label: "Mood Score",
    color: "hsl(var(--primary))",
  },
} satisfies import("@/components/ui/chart").ChartConfig;


export default function DashboardPage() {
  const { user } = useAuth();
  const { t, language } = useLanguage(); // Destructure language here

  return (
    <div className="space-y-8">
      <section className="p-6 rounded-lg shadow-md bg-card">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {t('welcomeUser')}, {user?.name || 'User'}!
        </h1>
        <p className="text-muted-foreground text-lg">
          {t('howAreYouFeeling')}
        </p>
         <Button asChild className="mt-4">
            <Link href="/journal">
                <Smile className="mr-2 h-5 w-5" /> {t('logYourMood')}
            </Link>
         </Button>
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-foreground mb-4">{t('quickActions')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {quickActions.map(action => (
            <Card key={action.titleKey} className={`shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 ${action.bgColor}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4">
                <CardTitle className={`text-base font-semibold ${action.color}`}>{t(action.titleKey)}</CardTitle>
                <action.icon className={`h-7 w-7 ${action.color}`} />
              </CardHeader>
              <CardContent className="pb-4">
                 {/* Using a div styled as a button or a simpler text link */}
                 <Link href={action.href} className={`text-sm font-medium ${action.color} hover:underline`}>
                    Go to {t(action.titleKey).toLowerCase()}
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"> <TrendingUp className="h-5 w-5 text-primary" /> {t('lastLoggedMood')}</CardTitle>
            <CardDescription>Your recent emotional state.</CardDescription>
          </CardHeader>
          <CardContent>
            {lastMood ? (
              <p className="text-lg">You felt <span className="font-semibold text-primary">{lastMood.mood}</span> {formatTimeAgo(lastMood.timestamp, language)}.</p>
            ) : (
              <p className="text-muted-foreground">No mood logged recently.</p>
            )}
            <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
              <Link href="/journal">{t('logYourMood')}</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> {t('recentJournalEntry')}</CardTitle>
            <CardDescription>Your latest thoughts and reflections.</CardDescription>
          </CardHeader>
          <CardContent>
            {recentEntry ? (
               <p className="text-lg">"<span className="italic text-primary">{recentEntry.title}</span>" written {formatTimeAgo(recentEntry.timestamp, language)}.</p>
            ) : (
              <p className="text-muted-foreground">{t('noEntriesYet')}</p>
            )}
             <Button asChild variant="outline" className="mt-4 w-full sm:w-auto">
              <Link href="/journal">{t('writeInJournal')}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle>Weekly Mood Overview</CardTitle>
                <CardDescription>See your mood trends from the past week.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <BarChart accessibilityLayer data={moodChartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date" 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis 
                            tickLine={false} 
                            axisLine={false} 
                            tickMargin={8}
                            domain={[0, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            tickFormatter={(value) => ['Sad', 'Anxious', 'Neutral', 'Calm', 'Happy'][value-1]}
                        />
                        <ChartTooltip content={<ChartTooltipContent hideIndicator />} />
                        <Bar dataKey="moodScore" fill="var(--color-moodScore)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
      </section>

    </div>
  );
}

// Helper function (ideally in utils, but here for simplicity)
function formatTimeAgo(date: Date, lang: 'en' | 'ta'): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000; // years
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? ` year${Math.floor(interval) > 1 ? 's' : ''} ago` : " ஆண்டுகளுக்கு முன்பு");
  interval = seconds / 2592000; // months
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? ` month${Math.floor(interval) > 1 ? 's' : ''} ago` : " மாதங்களுக்கு முன்பு");
  interval = seconds / 86400; // days
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? ` day${Math.floor(interval) > 1 ? 's' : ''} ago` : " நாட்களுக்கு முன்பு");
  interval = seconds / 3600; // hours
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? ` hour${Math.floor(interval) > 1 ? 's' : ''} ago` : " மணிநேரங்களுக்கு முன்பு");
  interval = seconds / 60; // minutes
  if (interval > 1) return Math.floor(interval) + (lang === 'en' ? ` minute${Math.floor(interval) > 1 ? 's' : ''} ago` : " நிமிடங்களுக்கு முன்பு");
  return Math.floor(seconds) + (lang === 'en' ? ` second${Math.floor(seconds) > 1 ? 's' : ''} ago` : " விநாடிகளுக்கு முன்பு");
}
