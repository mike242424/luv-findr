'use client';

import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import Image from 'next/image';
import Loading from '@/components/loading';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { User } from '@prisma/client';
import NoUsersFound from '../../components/no-users-found';
import { calculateAge } from '@/lib/utils';

async function getMatches() {
  const response = await axios.get('/api/users/user/matches');
  return response.data;
}

const MatchesPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
  });

  async function unmatchUser(matchUserId: string) {
    try {
      const response = await axios.delete('/api/users/user', {
        data: { matchUserId },
      });
      return response.data;
    } catch (error) {
      console.error('Error unmatching user:', error);
      throw error;
    }
  }

  const unmatchMutation = useMutation({
    mutationFn: (userId: string) => unmatchUser(userId),
    onSuccess: () => {
      refetch();
    },
    onError: (error: any) => {
      console.error('Error unmatching user:', error);
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  const matchedUsers = data?.matchedUsers || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-28 mx-10 gap-6">
      {matchedUsers.length > 0 ? (
        matchedUsers.map((user: User) => (
          <Card
            key={user.id}
            className="max-w-md w-full text-white bg-black border-2 border-primary"
          >
            <CardHeader>
              <div className="flex justify-center py-10">
                <Image
                  src={user.profilePhoto!}
                  alt={`${user.firstName} profile photo`}
                  width={300}
                  height={300}
                  className="rounded-full"
                />
              </div>
              <CardTitle>
                <strong>
                  {user.firstName} {user.lastName},{' '}
                  {calculateAge(user.dateOfBirth?.toString() || null)}
                </strong>
              </CardTitle>
              <p className="text-md pt-3">{user.profession}</p>
            </CardHeader>
            <CardContent>
              <hr className="border-[1px] border-primary" />
              <p className="my-4 text-md">{user.about}</p>
              <hr className="border-[1px] border-primary mb-2" />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button>Message</Button>
              <Button
                onClick={() => unmatchMutation.mutate(user.id)}
                disabled={unmatchMutation.isPending}
              >
                {unmatchMutation.isPending ? 'Unmatching...' : 'Unmatch'}
              </Button>
            </CardFooter>
          </Card>
        ))
      ) : (
        <NoUsersFound />
      )}
    </div>
  );
};

export default MatchesPage;
