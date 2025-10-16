import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSignIn = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Sign in failed');
      }

      toast({
        title: 'Success',
        description: 'Signed in successfully!',
      });

      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign in. Please check your credentials.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Sign up failed');
      }

      toast({
        title: 'Success',
        description: 'Account created successfully! You can now sign in.',
      });

      // Switch to sign in tab after successful registration
      (document.querySelector('[data-tab="signin"]') as HTMLElement | null)?.click();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[400px]">
        <Tabs defaultValue="signin" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" data-tab="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <CardHeader>
              <CardTitle>Welcome back!</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signInForm.handleSubmit(onSignIn)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    {...signInForm.register('email')}
                  />
                  {signInForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{signInForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    {...signInForm.register('password')}
                  />
                  {signInForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{signInForm.formState.errors.password.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
          
          <TabsContent value="signup">
            <CardHeader>
              <CardTitle>Create Account</CardTitle>
              <CardDescription>Sign up for a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={signUpForm.handleSubmit(onSignUp)} className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Full Name"
                    {...signUpForm.register('name')}
                  />
                  {signUpForm.formState.errors.name && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.name.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Email"
                    {...signUpForm.register('email')}
                  />
                  {signUpForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Password"
                    {...signUpForm.register('password')}
                  />
                  {signUpForm.formState.errors.password && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.password.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    {...signUpForm.register('confirmPassword')}
                  />
                  {signUpForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{signUpForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </CardContent>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}