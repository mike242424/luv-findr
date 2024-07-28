'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { Gender } from '@prisma/client';
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
import Loading from '@/components/loading';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateUserSchema } from '@/validation/updateUserSchema';

type UserDetailsFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  usersGender: Gender | string;
  interestedInGender: Gender | string;
  profession: string;
  about: string;
};

async function fetchUserDetails() {
  const response = await axios.get('/api/users/user');
  const userDetails = response.data.user;

  if (userDetails.dateOfBirth) {
    const date = new Date(userDetails.dateOfBirth);
    userDetails.dateOfBirth = `${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
  }

  return userDetails;
}

const UserDetailsForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      usersGender: '',
      interestedInGender: '',
      profession: '',
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

  useEffect(() => {
    async function fetchUserDetailsAndSetForm() {
      try {
        const userDetails = await fetchUserDetails();
        form.reset(userDetails);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to load user details.');
        setLoading(false);
      }
    }

    fetchUserDetailsAndSetForm();
  }, [form]);

  const mutation = useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userDetails'] });
      router.push('/dashboard');
    },
  });

  async function updateUser(values: UserDetailsFormData) {
    const response = await axios.put('/api/users', values);
    return response.data;
  }

  function onSubmit(values: UserDetailsFormData) {
    setError(null);
    mutation.mutate(values);
  }

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  First Name:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="First Name" />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Last Name:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Last Name" />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="dateOfBirth"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Date Of Birth (MM/DD/YYYY):
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="MM/DD/YYYY" />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="usersGender"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Gender:
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value as Gender)}
                    value={field.value || ''}
                  >
                    <SelectTrigger
                      className={field.value ? 'text-black' : 'text-gray-500'}
                    >
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
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="interestedInGender"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Interested In:
                </FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => field.onChange(value as Gender)}
                    value={field.value || ''}
                  >
                    <SelectTrigger
                      className={field.value ? 'text-black' : 'text-gray-500'}
                    >
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
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="profession"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  Profession:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Profession" />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="about"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  About Me:
                </FormLabel>
                <FormControl>
                  <Textarea {...field} rows={10} placeholder="About me..." />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="font-bold mt-2"
            disabled={mutation.isPending}
          >
            Update
          </Button>
          {error && <p className="text-primary text-sm">{error}</p>}
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsForm;
