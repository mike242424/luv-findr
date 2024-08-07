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
    <>
      {matchedUsers.length > 0 ? (
        matchedUsers.map((user: User) => (
          <div
            key={user.id}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-28 mx-10 gap-6"
          >
            <Card className="max-w-md w-full text-white bg-black border-2 border-primary">
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
          </div>
        ))
      ) : (
        <NoMatchesFoundPage />
      )}
    </>
  );
};

export default MatchesPage;
