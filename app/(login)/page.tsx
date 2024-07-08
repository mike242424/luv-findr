import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import LoginForm from './login-form';

const Login = async () => {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="flex flex-col items-center w-full mt-6">
      <h1 className="text-primary font-bold text-3xl">Login</h1>
      <LoginForm />
    </div>
  );
};

export default Login;
