import Link from 'next/link';
import { Heart } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-primary p-4">
      <Link href="/" className="font-bold text-4xl text-primary-foreground">
        <div className="flex items-center gap-2">
          <Heart size={35} />
          <h1>Luv Findr</h1>
        </div>
      </Link>
    </nav>
  );
};

export default Navbar;
