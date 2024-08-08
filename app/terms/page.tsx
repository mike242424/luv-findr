import { Card, CardContent, CardTitle } from '@/components/ui/card';

const TermsOfServicePage = () => {
  return (
    <Card className="bg-black text-white p-4 md:p-8 md:mx-20 mx-8 mt-28 border-2 border-primary">
      <CardTitle className="text-center text-primary font-bold text-3xl m-4">
        Terms of Service
      </CardTitle>
      <CardContent className="mt-10">
        <h2 className="text-2xl text-primary font-semibold mb-4">
          Introduction
        </h2>
        <p className="mb-4">
          Welcome to Luv Findr. These Terms of Service govern your use of our
          website and services. By accessing or using our services, you agree to
          be bound by these terms.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          Acceptance of Terms
        </h2>
        <p className="mb-4">
          By using our services, you agree to these Terms of Service. If you do
          not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          Changes to Terms
        </h2>
        <p className="mb-4">
          We reserve the right to change these Terms of Service at any time. We
          will notify you of any changes by posting the new Terms of Service on
          our website. You are advised to review these terms periodically for
          any changes.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          User Responsibilities
        </h2>
        <p className="mb-4">
          As a user, you agree to use our services in a lawful manner and to
          respect the rights of others. You are responsible for your own conduct
          and the content you submit.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          Limitation of Liability
        </h2>
        <p className="mb-4">
          Our liability is limited to the fullest extent permitted by law. We
          are not liable for any indirect, incidental, or consequential damages
          arising from your use of our services.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          Governing Law
        </h2>
        <p className="mb-4">
          These Terms of Service are governed by and construed in accordance
          with the laws of the jurisdiction in which our company is based.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          Contact Information
        </h2>
        <p className="mb-4">
          If you have any questions about these Terms of Service, please contact
          us at support@luvfindr.com.
        </p>
      </CardContent>
    </Card>
  );
};

export default TermsOfServicePage;
