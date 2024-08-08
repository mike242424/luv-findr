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
import { Card, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

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
        <Card className="max-w-md w-full my-28 text-white bg-black border-2 border-primary h-[500px] flex flex-col">
          <CardTitle className="text-center text-primary font-bold text-3xl mb-4 p-4 border-b-2 border-primary">
            FIND YOUR MATCH
          </CardTitle>
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-center p-4">
              <Image
                src={currentMatch.profilePhoto}
                alt={`${currentMatch.firstName} profile photo`}
                width={300}
                height={300}
                className="rounded"
              />
            </div>
            <div className="ms-6 m-4">
              <CardTitle>
                <strong>
                  {currentMatch.firstName},{' '}
                  {calculateAge(currentMatch.dateOfBirth)}
                </strong>
              </CardTitle>
              <p className="text-md pt-3">{currentMatch.profession}</p>
            </div>
            <CardContent>
              <hr className="border-[1px] border-primary" />
              <p className="my-4 text-md">{currentMatch.about}</p>
              <hr className="border-[1px] border-primary mb-2" />
            </CardContent>
          </div>
          <CardFooter className="flex justify-between p-4 mt-4 border-t-2 border-primary bg-black rounded-b-md">
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
