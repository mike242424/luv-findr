'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUserSchema } from '@/validation/registerUserSchema';
import { registerUser } from '@/lib/authApi';
import { RegisterUserFormData } from '@/types/registerUserFormData';
import LoadingSpinner from '@/components/loading';
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

const RegisterForm = () => {
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/');
    },
    onError: (error: any) => {
      if (error.response?.status === 409) {
        setError('Email already in use. Please try a different one.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    },
  });

  function onSubmit(values: RegisterUserFormData) {
    setError(null);
    mutation.mutate(values);
  }

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'email' && error) {
        setError(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form, error]);

  return (
    <>
      {mutation.isPending ? (
        <div>
          <LoadingSpinner />
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
                      <Input
                        {...field}
                        type="text"
                        placeholder="fabio@luvfindr.com"
                      />
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
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg text-primary">
                      Confirm Password:
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="******" />
                    </FormControl>
                    <FormMessage className="text-primary" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="font-bold mt-2"
                disabled={mutation.isPending}
              >
                Register
              </Button>
              {error && <p className="text-primary text-sm">{error}</p>}
            </form>
          </Form>
          <div className="flex items-center gap-1 mt-3">
            <p className="text-white">Already have an account?</p>
            <Link href="/">
              <span className="text-primary font-bold hover:underline">
                Login Here
              </span>
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterForm;
