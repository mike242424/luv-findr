'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';

const NavbarLogoutButton = () => {
  return <Button onClick={() => signOut({ callbackUrl: '/' })}>Logout</Button>;
};

export default NavbarLogoutButton;
