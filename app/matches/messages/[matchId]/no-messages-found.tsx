import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NoMessagesFoundPage = () => {
  return (
    <div className="flex flex-col items-center mt-10 text-white">
      <Card className="max-w-md w-full my-12 text-white bg-black  p-6 border-0">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            No Messages Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <p className="text-center">
              There are no messages to show yet. Start a conversation with your
              match or check back later.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoMessagesFoundPage;
