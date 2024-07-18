'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Gender } from '@prisma/client';
import { updateUserSchema } from '@/validation/updateUserSchema';

type UserDetailsFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  usersGender: Gender;
  interestedInGender: Gender;
  about: string;
};

const UserDetailsForm = () => {
  const [error, setError] = useState<string | null>(null);
  const [isGenderSelected, setIsGenderSelected] = useState(false);
  const [isInterestedInGenderSelected, setIsInterestedInGenderSelected] =
    useState(false);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
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
    mutationFn: updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      router.push('/dashboard');
    },
  });

  async function updateUser(values: UserDetailsFormData) {
    const response = await axios.put('/api/auth/users/register', values);
    return response.data;
  }

  function onSubmit(values: UserDetailsFormData) {
    setError(null);
    mutation.mutate(values);
  }

  return (
    <>
      {mutation.isPending ? (
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
                      Date Of Birth (DD/MM/YYYY):
                    </FormLabel>
                    <FormControl>
                      <Input {...field} type="text" placeholder="11/02/1977" />
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
                        onValueChange={(value) => {
                          field.onChange(value as Gender);
                          setIsGenderSelected(true);
                        }}
                      >
                        <SelectTrigger
                          className={
                            isGenderSelected ? 'text-black' : 'text-gray-500'
                          }
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
                        onValueChange={(value) => {
                          field.onChange(value as Gender);
                          setIsInterestedInGenderSelected(true);
                        }}
                      >
                        <SelectTrigger
                          className={
                            isInterestedInGenderSelected
                              ? 'text-black'
                              : 'text-gray-500'
                          }
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
                name="about"
                control={form.control}
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel className="font-bold text-lg text-primary">
                      About Me:
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={10}
                        placeholder="About me..."
                      />
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
      )}
    </>
  );
};

export default UserDetailsForm;
