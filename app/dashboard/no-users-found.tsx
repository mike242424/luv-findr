import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const NoUsersFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-16 text-white">
      <Card className="max-w-md w-full my-12 text-white bg-black border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            No Users Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            There are no users to display. Check back later or update your
            profile to see new users.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoUsersFoundPage;
