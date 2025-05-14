
"use client";

import React, { useEffect, useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/contexts/ThemeContext";
import type { Language } from "@/types";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from 'lucide-react';

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmNewPassword: z.string().optional(),
}).refine(data => {
  if (data.newPassword && !data.currentPassword) {
    return false; 
  }
  return true;
}, {
  message: "Current password is required to change password.",
  path: ["currentPassword"],
}).refine(data => {
  if (data.newPassword && data.newPassword.length < 6) {
    return false;
  }
  return true;
}, {
  message: "New password must be at least 6 characters.",
  path: ["newPassword"],
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
});


export function UserProfile() {
  const { user, updateUser, deleteAccount } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    }
  }, [user, form]);

  const handleLanguageChange = (newLang: Language) => {
    setLanguage(newLang);
  };

  const onSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (user) {
      updateUser({ ...user, name: values.name });
      if (values.newPassword) {
        toast({
          title: "Password Change (Mocked)",
          description: t('passwordChangeMockMessage'),
        });
      }
      toast({
        title: "Profile Updated",
        description: "Your profile settings have been saved.",
      });
    }
    form.reset({ 
        ...form.getValues(),
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
  };

  const handleDeleteAccountConfirm = async () => {
    await deleteAccount();
    setIsDeleteDialogOpen(false);
    toast({
      title: "Account Deleted",
      description: "Your account and all data have been removed.",
      variant: "destructive",
    });
    // AuthContext's logout (called by deleteAccount) will handle redirection
  };

  if (!user) {
    return <p>Loading profile...</p>;
  }

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-2xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">{t('profile')}</CardTitle>
          <CardDescription>Manage your account settings and preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Email (read-only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">{t('email')}</Label>
                <p id="email" className="text-sm text-muted-foreground p-3 border rounded-md bg-secondary/30">{user.email}</p>
              </div>

              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">{t('name')}</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Separator />

              {/* Language Settings */}
              <div className="space-y-3">
                <Label className="text-base font-medium">{t('languageSettings')}</Label>
                <RadioGroup
                  value={language}
                  onValueChange={(value: string) => handleLanguageChange(value as Language)}
                  className="space-y-2 pt-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="en" id="lang-en" />
                    </FormControl>
                    <Label htmlFor="lang-en" className="font-normal cursor-pointer flex-1">{t('english')}</Label>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0 p-3 border rounded-md hover:bg-muted/50 transition-colors cursor-pointer">
                    <FormControl>
                      <RadioGroupItem value="ta" id="lang-ta" />
                    </FormControl>
                    <Label htmlFor="lang-ta" className="font-normal cursor-pointer flex-1">{t('tamil')}</Label>
                  </FormItem>
                </RadioGroup>
              </div>

              <Separator />

              {/* Theme Settings */}
              <div className="space-y-3">
                  <Label className="text-base font-medium">{t('themeSettings')}</Label>
                  <div className="flex items-center justify-between p-3 border rounded-md">
                      <Label htmlFor="dark-mode-switch" className="font-normal">
                      {theme === 'dark' ? t('darkMode') : t('lightMode')}
                      </Label>
                      <Switch
                      id="dark-mode-switch"
                      checked={theme === 'dark'}
                      onCheckedChange={toggleTheme}
                      />
                  </div>
              </div>

              <Separator />

              {/* Change Password (Mock) */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">{t('changePassword')}</h3>
                 <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('currentPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('newPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('confirmNewPassword')}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {t('saveSettings')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delete Account Section */}
      <Card className="w-full max-w-2xl mx-auto shadow-lg border-destructive">
        <CardHeader>
          <CardTitle className="text-xl text-destructive flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            {t('deleteAccountWarning')}
          </CardTitle>
          <CardDescription>{t('deleteAccountDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                {t('deleteAccount')}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>{t('deleteAccountConfirmationTitle')}</AlertDialogTitle>
                <AlertDialogDescription>
                  {t('deleteAccountConfirmationMessage')}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>{t('cancel')}</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleDeleteAccountConfirm}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                >
                  {t('confirmDelete')}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
