import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { Heart } from 'lucide-react';
import NavbarLogoutButton from '@/components/navbar-logout-button';

const Navbar = async () => {
  const session = await getServerSession();

  return (
    <nav className="flex justify-between bg-primary p-4">
      <Link href="/" className="font-bold text-3xl text-primary-foreground">
        <div className="flex items-center gap-2 hover:text-black">
          <Heart size={35} />
          <h1>Luv Findr</h1>
        </div>
      </Link>
      {session && (
        <div className="flex text-white justify-center items-center">
          <Link href="/matches" className="mr-4 hover:text-black">
            My Matches
          </Link>
          <Link className="hover:text-black" href="/user-details">
            My Details
          </Link>
          <NavbarLogoutButton />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
