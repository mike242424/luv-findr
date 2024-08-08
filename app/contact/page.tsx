import { Twitter, Facebook, Instagram } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

const ContactPage = () => {
  return (
    <Card className="bg-black text-white p-4 md:p-8 md:mx-20 mx-7 mt-28 border-2 border-primary">
      <CardTitle className="text-center text-primary font-bold text-3xl mb-4">
        Contact Us
      </CardTitle>
      <CardContent>
        <h2 className="text-2xl text-primary font-semibold mb-4">
          Get in Touch
        </h2>
        <p className="mb-4">
          We’d love to hear from you! Whether you have a question, feedback, or
          just want to say hi, feel free to reach out.
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">
          Contact Information
        </h2>
        <p className="mb-4">
          <strong>Email:</strong>{' '}
          <a href="mailto:support@luvfindr.com" className="hover:underline">
            support@luvfindr.com
          </a>
        </p>
        <p className="mb-4">
          <strong>Phone:</strong>{' '}
          <a href="tel:+1234567890" className="hover:underline">
            +1 (111) 111-1111
          </a>
        </p>

        <h2 className="text-2xl text-primary font-semibold mb-4">Follow Us</h2>
        <p className="mb-4">
          Stay connected with us on social media for updates and news.
        </p>
        <div className="flex gap-4">
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <Twitter />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <Facebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            <Instagram />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactPage;
