'use client';

type RegisterUserFormData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  usersGender: Gender;
  interestedInGender: Gender;
  about: string;
};

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Gender } from '@prisma/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUserSchema } from '@/validation/registerUserSchema';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const RegisterForm = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      usersGender: Gender.male,
      interestedInGender: Gender.male,
      about: '',
    },
  });

  const genderOptions = [
    { value: Gender.male, label: 'Male' },
    { value: Gender.female, label: 'Female' },
    { value: Gender.nonBinary, label: 'Non-binary' },
    { value: Gender.other, label: 'Other' },
    { value: Gender.preferNotToSay, label: 'Prefer not to say' },
  ];

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/');
    },
  });

  async function registerUser(values: RegisterUserFormData) {
    const response = await axios.post('/api/auth/users/register', values);
    return response.data;
  }

  function onSubmit(values: RegisterUserFormData) {
    const transformedValues: RegisterUserFormData = {
      ...values,
      usersGender: values.usersGender as Gender,
      interestedInGender: values.interestedInGender as Gender,
    };
    mutation.mutate(transformedValues);
  }

  return (
    <>
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
          <FormField
            name="firstName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  First Name:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Last Name:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            name="dateOfBirth"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Date Of Birth (DD/MM/YYYY):
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            name="usersGender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Gender:
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            name="interestedInGender"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Interested In:
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value as Gender)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      {genderOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <FormField
            name="about"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  About Me:
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} />
                </FormControl>
                <FormMessage className="text-primary" />
              </FormItem>
            )}
          />
          <Button type="submit" className="font-bold mt-2">
            Register
          </Button>
        </form>
      </Form>
      <div className="flex items-center gap-1 mt-3">
        <p className="text-primary">Login</p>
        <Link href="/">
          <span className="text-primary font-bold underline">Here</span>
        </Link>
      </div>
    </>
  );
};

export default RegisterForm;
