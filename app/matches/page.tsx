'use client';

import Image from 'next/image';
import Link from 'next/link';
import { User } from '@prisma/client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getMatches, unmatchUser } from '@/lib/matchesApi';
import { calculateAge } from '@/lib/dateUtils';
import LoadingSpinner from '@/components/loading';
import NoMatchesFoundPage from './no-matches-found';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';

const MatchesPage = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: getMatches,
  });

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
    return <LoadingSpinner />;
  }

  const matchedUsers = data?.matchedUsers || [];

  return (
    <div className="mt-28 mx-10">
      {matchedUsers.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 justify-items-center">
          {matchedUsers.map((user: User) => (
            <Card
              key={user.id}
              className="flex flex-col max-w-md w-full text-white bg-black border-2 border-primary h-[500px]"
            >
              <CardTitle className="text-center text-primary font-bold text-3xl mb-4 p-4 border-b-2 border-primary">
                {user.firstName} {user.lastName}
              </CardTitle>
              <div className="overflow-y-auto">
                <div className="flex justify-center py-4">
                  <Image
                    src={user.profilePhoto!}
                    alt={`${user.firstName} profile photo`}
                    width={300}
                    height={300}
                    className="rounded"
                  />
                </div>
                <CardContent className="mx-6">
                  <p className="my-4 text-xl">
                    {user.profession},{' '}
                    {calculateAge(user.dateOfBirth?.toString() || null)}
                  </p>
                  <hr className="border-[1px] border-primary" />
                  <p className="my-4 text-md">{user.about}</p>
                  <hr className="border-[1px] border-primary mb-2" />
                </CardContent>
              </div>
              <CardFooter className="flex justify-between items-center mt-auto p-4">
                <Link href={`/matches/messages/${user.id}`}>
                  <Button>Message</Button>
                </Link>
                <Button
                  onClick={() => unmatchMutation.mutate(user.id)}
                  disabled={unmatchMutation.isPending}
                >
                  {unmatchMutation.isPending ? 'Unmatching...' : 'Unmatch'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <NoMatchesFoundPage />
      )}
    </div>
  );
};

export default MatchesPage;
