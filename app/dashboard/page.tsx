'use client';

import { useState } from 'react';
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

const Dashboard = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers,
  });

  const [currentIndex, setCurrentIndex] = useState(0);

  async function getUsers() {
    const response = await axios.get('/api/users');
    console.log(response.data);
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

  if (isLoading) {
    return <Loading />;
  }

  const currentUser = data?.allUsers[currentIndex];

  return (
    <div className="flex flex-col items-center mt-10">
      {currentUser ? (
        <Card className="max-w-md w-full mb-4 text-white bg-black">
          <CardHeader>
            <CardTitle>
              <strong>
                {currentUser.firstName} {currentUser.lastName}
              </strong>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <strong>Age:</strong> {calculateAge(currentUser.dateOfBirth)}
            <p>
              <strong>About {currentUser.firstName}:</strong>{' '}
              {currentUser.about}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={() => handleMatch(currentUser.id)}>Match</Button>
            <Button onClick={handleNext}>Skip</Button>
          </CardFooter>
        </Card>
      ) : (
        <p className="text-white">No Users Found</p>
      )}
    </div>
  );
};

export default Dashboard;
