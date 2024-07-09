import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import RegisterForm from './register-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Register = async () => {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex items-center justify-center mt-20">
      <Card className="w-full max-w-md bg-black p-6 rounded-lg border-2 border-primary">
        <CardHeader>
          <CardTitle className="text-center text-primary font-bold text-3xl">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
