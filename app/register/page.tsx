import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import RegisterForm from './register-form';
import DateImgOne from '@/public/date_img_1.jpg';
import DateImgTwo from '@/public/date_img_2.jpg';
import DateImgThree from '@/public/date_img_3.jpg';
import DateImgFour from '@/public/date_img_4.jpg';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RegisterPage = async () => {
  const session = await getServerSession();

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 z-0">
        <Image
          src={DateImgOne}
          alt="Date Image One"
          className="object-cover w-full h-full"
          priority
        />
        <Image
          src={DateImgTwo}
          alt="Date Image Two"
          className="object-cover w-full h-full"
          priority
        />
        <Image
          src={DateImgThree}
          alt="Date Image Three"
          className="object-cover w-full h-full"
        />
        <Image
          src={DateImgFour}
          alt="Date Image Four"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="relative z-10 flex items-center justify-center my-28 w-full">
        <Card className="w-full max-w-md p-6 rounded-lg border-2 border-primary bg-black">
          <CardHeader>
            <CardTitle className="text-center text-primary font-bold text-3xl">
              REGISTER
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RegisterForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
