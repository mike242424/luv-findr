'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginUserSchema } from '@/validation/loginUserSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Divide } from 'lucide-react';
import Loading from '@/components/loading';

const LoginForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof loginUserSchema>) {
    setIsLoading(true);
    const signInData = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error === 'CredentialsSignin') {
      form.setError('email', {
        type: 'manual',
        message: 'Invalid email or password',
      });
      form.setError('password', {
        type: 'manual',
        message: 'Invalid email or password',
      });
    } else {
      router.push('/dashboard');
      router.refresh();
    }
    setIsLoading(false);
  }

  return (
    <>
      {isLoading ? (
        <div>
          <Loading />
        </div>
      ) : (
        <div>
          <Form {...form}>
            <form
              className="flex flex-col gap-3"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg text-primary">
                      Email:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="text" />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg text-primary">
                      Password:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="font-bold mt-2"
                disabled={isLoading}
              >
                Login
              </Button>
            </form>
          </Form>
          <div className="flex items-center gap-1 mt-3">
            <p className="text-primary">Create account</p>
            <Link href="/register">
              <span className="text-primary font-bold underline">Here</span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default LoginForm;
