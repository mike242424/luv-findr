import UserDetailsForm from './user-details-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const UserDetailsPage = () => {
  return (
    <div className="relative z-10 flex items-center justify-center mt-28 w-full">
      <Card className="w-full max-w-md p-6 rounded-lg border-2 border-primary bg-black">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            MY DETAILS
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UserDetailsForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailsPage;
