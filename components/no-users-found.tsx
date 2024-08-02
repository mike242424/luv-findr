import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const NoUsersFound = () => {
  return (
    <div className="flex flex-col items-center mt-10 text-white">
      <Card className="max-w-md w-full my-12 text-white bg-black border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            No Users Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            There are no more users to show. Check back later or update your
            profile to see new matches.
          </p>
          <div className="flex justify-center my-4">
            <Link href="/user-details">
              <Button>Update Profile</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoUsersFound;
