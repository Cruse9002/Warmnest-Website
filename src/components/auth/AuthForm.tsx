
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import Link from "next/link";
import { useLanguage } from "@/hooks/useLanguage";
import { useAuth } from "@/contexts/AuthContext";
import { Chrome } from "lucide-react"; // Google icon

interface AuthFormProps {
  isRegister?: boolean;
}

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function AuthForm({ isRegister = false }: AuthFormProps) {
  const { t } = useLanguage();
  const { login, register: registerUser, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (isRegister) {
      await registerUser(values.email); // Simplified: using email also for password for mock
    } else {
      await login(values.email); // Simplified: using email also for password for mock
    }
  }
  
  const handleGoogleSignIn = async () => {
    // Mock Google Sign-In: For demo, let's just log in with a predefined Google user.
    // In a real app, this would use Firebase's GoogleAuthProvider.
    await login("googleuser@example.com");
  };


  return (
    <Card className="w-full shadow-xl">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center text-primary">
          {isRegister ? t('register') : t('login')}
        </CardTitle>
        <CardDescription className="text-center">
          {isRegister ? "Create your WarmNest account." : "Access your WarmNest space."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Processing..." : (isRegister ? t('register') : t('login'))}
            </Button>
          </form>
        </Form>
        <div className="mt-6 relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-6" onClick={handleGoogleSignIn} disabled={loading}>
          <Chrome className="mr-2 h-4 w-4" /> {t('signInWithGoogle')}
        </Button>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-muted-foreground">
          {isRegister ? t('alreadyHaveAccount') : t('dontHaveAccount')}{' '}
          <Link href={isRegister ? "/auth/login" : "/auth/register"} className="font-medium text-primary hover:underline">
            {isRegister ? t('login') : t('register')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
