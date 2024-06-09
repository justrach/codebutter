


import Header from '@/components/home/Header';
import { NavBarNew } from '@/components/nav-bar-new';
import { NavBar } from '@/components/navbar/navbar';
import { NavBarLogin } from '@/components/navbar/navbar_login';
import { SignIn } from '@clerk/nextjs';
export default function Page() {
  return (
    <div className="mt-5">
      {/* <Header /> */}
      <NavBarLogin/>
      <div className="flex mx-auto justify-center items-center mt-10">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-black hover:bg-gray-700 transition text-sm normal-case',
            },
          }}
          afterSignInUrl="/home"
        />
      </div>
    </div>
  );
}