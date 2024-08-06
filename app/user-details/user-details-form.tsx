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
import Image from 'next/image';

type UserDetailsFormData = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  city: string;
  state: string;
  usersGender: Gender | string;
  interestedInGender: Gender | string;
  profession: string;
  about: string;
  profilePhoto: string;
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
  const [profilePhotoUrl, setProfilePhotoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<UserDetailsFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      city: '',
      state: '',
      usersGender: '',
      interestedInGender: '',
      profession: '',
      about: '',
      profilePhoto: '',
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
        setProfilePhotoUrl(userDetails.profilePhoto || '');
        setLoading(false);
      } catch (error) {
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

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch(
          `/api/users/user/profile-photo/upload?filename=${file.name}`,
          {
            method: 'POST',
            body: formData,
          },
        );

        if (!response.ok) {
          throw new Error('Failed to upload file.');
        }

        const result = await response.json();
        if (result.url) {
          setProfilePhotoUrl(result.url);
          form.setValue('profilePhoto', result.url);
        } else {
          setError('Failed to upload profile photo.');
        }
      } catch (error) {
        setError('Failed to upload profile photo.');
      }
    }
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
                  <Input {...field} type="text" placeholder="Fabio" />
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
                  <Input {...field} type="text" placeholder="Lanzoni" />
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
                  <Input {...field} type="text" placeholder="03/15/1959" />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="city"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  City:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="Hollywood" />
                </FormControl>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            name="state"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="font-bold text-lg text-primary">
                  State:
                </FormLabel>
                <FormControl>
                  <Input {...field} type="text" placeholder="California" />
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
                  <Input {...field} type="text" placeholder="Actor" />
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
          <FormField
            name="profilePhoto"
            control={form.control}
            render={({ field, fieldState }) => (
              <FormItem>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <FormLabel className="font-bold text-lg text-primary">
                      Profile Photo:
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <label
                          htmlFor="profilePhotoUpload"
                          className="cursor-pointer bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-600 mt-2"
                        >
                          {selectedFile ? 'Change Photo' : 'Upload Photo'}
                        </label>
                        <input
                          id="profilePhotoUpload"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleFileChange(e);
                            setSelectedFile(
                              e.target.files ? e.target.files[0] : null,
                            );
                          }}
                          className="hidden"
                        />
                      </div>
                    </FormControl>
                  </div>
                  {profilePhotoUrl && (
                    <div className="flex-none">
                      <Image
                        src={profilePhotoUrl}
                        alt="Profile Photo"
                        width={75}
                        height={75}
                        className="rounded-full"
                      />
                    </div>
                  )}
                </div>
                <FormMessage className="text-primary">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          {error && <p className="text-primary">{error}</p>}
          <Button type="submit" disabled={mutation.isPending} className="mt-4">
            {mutation.isPending ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UserDetailsForm;
