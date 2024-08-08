import { Card, CardContent, CardTitle } from '@/components/ui/card';

const PrivacyPolicyPage = () => {
  return (
    <>
      <Card className="bg-black text-white p-4 md:p-8 md:mx-20 m-16 mt-28 border-2 border-primary">
        <CardTitle className="text-center text-primary font-bold text-3xl m-4">
          Privacy Policy
        </CardTitle>
        <CardContent className="mt-10">
          <h2 className="text-2xl text-primary font-semibold mb-4">
            Introduction
          </h2>
          <p className="mb-4">
            Welcome to Luv Findr. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our
            services. By using our services, you agree to the collection and use
            of information in accordance with this policy.
          </p>

          <h2 className="text-2xl text-primary font-semibold mb-4">
            Information Collection
          </h2>
          <p className="mb-4">
            We collect information that you provide directly to us, such as when
            you create an account, send messages, or interact with our services.
            This may include personal information such as your name, email
            address, and other contact details.
          </p>

          <h2 className="text-2xl text-primary font-semibold mb-4">
            Use of Information
          </h2>
          <p className="mb-4">
            We use the information we collect to provide and improve our
            services, communicate with you, and personalize your experience. We
            may also use your information for analytical purposes and to detect
            and prevent fraudulent activities.
          </p>

          <h2 className="text-2xl text-primary font-semibold mb-4">
            Information Sharing
          </h2>
          <p className="mb-4">
            We do not share your personal information with third parties, except
            as necessary to provide our services, comply with legal obligations,
            or protect the rights and safety of our users.
          </p>

          <h2 className="text-2xl text-primary font-semibold mb-4">
            Data Security
          </h2>
          <p className="mb-4">
            We implement reasonable security measures to protect your
            information from unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the internet or
            electronic storage is completely secure.
          </p>

          <h2 className="text-2xl text-primary font-semibold mb-4">
            Changes to Privacy Policy
          </h2>
          <p className="mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on our website.
            You are advised to review this policy periodically for any changes.
          </p>

          <h2 className="text-2xl text-primary font-semibold mb-4">
            Contact Information
          </h2>
          <p className="mb-4">
            If you have any questions about this Privacy Policy, please contact
            us at support@luvfindr.com.
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default PrivacyPolicyPage;
