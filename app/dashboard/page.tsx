'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { getUserDetails, getUsers } from '@/lib/userApi';
import { calculateAge } from '@/lib/dateUtils';
import LoadingSpinner from '@/components/loading';
import NoUsersFound from './no-users-found';
import ProfileIncompletePage from './profile-incomplete';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

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
    return <LoadingSpinner />;
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
    return <ProfileIncompletePage />;
  }

  const currentMatch = usersData?.allUsers[currentIndex];

  return (
    <div className="flex flex-col items-center">
      {currentMatch ? (
        <Card className="max-w-md w-full my-28 text-white bg-black border-2 border-primary">
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
                className="rounded"
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
