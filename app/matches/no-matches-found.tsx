import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const NoMatchesFoundPage = () => {
  return (
    <div className="flex flex-col justify-center items-center mt-16 text-white">
      <Card className="max-w-md w-full text-white bg-black border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            No Matches Found
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            There are no matches to display. Check back later or match with more
            people to see new matches.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoMatchesFoundPage;
