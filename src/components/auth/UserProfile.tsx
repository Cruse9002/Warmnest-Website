
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import type { Language } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function UserProfile() {
  const { user, updateUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { toast } = useToast();

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
    if (user) {
      updateUser({ ...user, language: newLang });
    }
  };

  const handleSave = () => {
    // In a real app, this would persist to backend if necessary
    // For now, language is updated in AuthContext and LanguageContext state
    toast({
      title: "Settings Saved",
      description: `Language set to ${language === 'en' ? 'English' : 'Tamil'}.`,
    });
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <Card className="w-full max-w-lg mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{t('profile')}</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-base">{t('email')}</Label>
          <p id="email" className="text-sm text-muted-foreground p-2 border rounded-md bg-secondary/50">{user.email}</p>
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">{t('languageSettings')}</Label>
          <RadioGroup
            defaultValue={language}
            onValueChange={(value: string) => handleLanguageChange(value as Language)}
            className="flex flex-col space-y-2 pt-2"
          >
            <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="en" id="lang-en" />
              <Label htmlFor="lang-en" className="cursor-pointer flex-1">{t('english')}</Label>
            </div>
            <div className="flex items-center space-x-2 p-3 border rounded-md hover:bg-muted/50 transition-colors">
              <RadioGroupItem value="ta" id="lang-ta" />
              <Label htmlFor="lang-ta" className="cursor-pointer flex-1">{t('tamil')}</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button onClick={handleSave} className="w-full bg-primary hover:bg-primary/90">
          {t('saveSettings')}
        </Button>
      </CardContent>
    </Card>
  );
}
