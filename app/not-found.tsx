import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center mt-16 text-white">
      <Card className="max-w-md w-full my-12 text-white bg-black border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">Head back to your dashboard.</p>
          <div className="flex justify-center my-4">
            <Link href="/">
              <Button>Dashboard</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFoundPage;
