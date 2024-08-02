'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { calculateAge } from '@/lib/utils';
import NoUsersFound from '../../components/no-users-found';
import ProfileIncomplete from './profile-incomplete';

const Dashboard = () => {
  const { data: usersData, isLoading: isLoadingUsers } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const { data: userDetailsData, isLoading: isLoadingUserDetailsData } =
    useQuery({
      queryKey: ['userDetails'],
      queryFn: getUserDetails,
    });

  const [currentIndex, setCurrentIndex] = useState(0);

  async function getUsers() {
    const response = await axios.get('/api/users');
    return response.data;
  }

  async function getUserDetails() {
    const response = await axios.get('/api/users/user');
    return response.data;
  }

  const addMatchMutation = useMutation({
    mutationFn: async (matchUserId: string) => {
      const response = await axios.patch('/api/users/user', { matchUserId });
      return response.data;
    },
    onSuccess: () => {
      handleNext();
    },
    onError: (error: any) => {
      console.error('Error adding match:', error);
    },
  });

  function handleNext() {
    setCurrentIndex((prevIndex) => prevIndex + 1);
  }

  function handleMatch(personId: string) {
    addMatchMutation.mutate(personId);
  }

  if (isLoadingUsers || isLoadingUserDetailsData) {
    return <Loading />;
  }

  const profileIncomplete =
    !userDetailsData.user.firstName ||
    !userDetailsData.user.lastName ||
    !userDetailsData.user.dateOfBirth ||
    !userDetailsData.user.usersGender ||
    !userDetailsData.user.interestedInGender ||
    !userDetailsData.user.profession ||
    !userDetailsData.user.about ||
    !userDetailsData.user.profilePhoto;

  if (profileIncomplete) {
    return (
      <div className="flex flex-col items-center mt-10">
        <ProfileIncomplete />
      </div>
    );
  }

  const currentMatch = usersData?.allUsers[currentIndex];

  return (
    <div className="flex flex-col items-center mt-10">
      {currentMatch ? (
        <Card className="max-w-md w-full my-12 text-white bg-black border-2 border-primary">
          <CardHeader>
            <CardTitle className="text-center text-primary font-bold text-3xl">
              FIND YOUR MATCH
            </CardTitle>
            <div className="flex justify-center py-10">
              <Image
                src={currentMatch.profilePhoto}
                alt={`${currentMatch.firstName} profile photo`}
                width={300}
                height={300}
                className="rounded-full"
              />
            </div>
            <CardTitle>
              <strong>
                {currentMatch.firstName},{' '}
                {calculateAge(currentMatch.dateOfBirth)}
              </strong>
            </CardTitle>
            <p className="text-md pt-3">{currentMatch.profession}</p>
          </CardHeader>
          <CardContent>
            <hr className="border-[1px] border-primary" />
            <p className="my-4 text-md">{currentMatch.about}</p>
            <hr className="border-[1px] border-primary mb-2" />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => handleMatch(currentMatch.id)}>Match</Button>
            <Button onClick={handleNext}>Skip</Button>
          </CardFooter>
        </Card>
      ) : (
        <NoUsersFound />
      )}
    </div>
  );
};

export default Dashboard;
