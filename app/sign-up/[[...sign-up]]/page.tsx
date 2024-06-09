import Header from '@/components/home/Header';
import { NavBarLogin } from '@/components/navbar/navbar_login';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <div className="mt-5">
      {/* <Header /> */}
      <NavBarLogin/>
      <div className="flex mx-auto justify-center items-center mt-10">
        <SignUp
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-black hover:bg-gray-700 transition text-sm normal-case',
            },
          }}
          afterSignUpUrl="/home"
        />
      </div>
    </div>
  );
}

// "use client"
// import { useEffect } from 'react';
// import Header from '@/components/home/Header';
// import { SignUp, useClerk } from '@clerk/nextjs';
// import { createClient } from '@supabase/supabase-js';

// // Initialize Supabase client
// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
// const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// export default function Page() {
//   const { addListener, user } = useClerk();

//   useEffect(() => {
//     const unsubscribe = addListener((event: any) => { // Cast to 'any' temporarily
//       if (event.signUpAttempt && event.signUpAttempt.status === 'complete') {
//         // The sign-up was successful, user is now available
//         const clerkUserId = user!.id;
//         const email = user!.emailAddresses[0]?.emailAddress || '';
//         const name = user!.firstName || ''; // Adjust based on available data and your needs

//         // Upsert user information into Supabase
//         upsertUser(clerkUserId, email, name).then(() => {
//           console.log('User upserted successfully');
//           // Redirect or perform other actions as needed
//         }).catch((error) => {
//           console.error('Error upserting user:', error);
//         });
//       }
//     });

//     // Cleanup listener when component unmounts
//     return unsubscribe;
//   }, [addListener, user]);

//   // Reuse the upsertUser function from the sign-in page or define it here if not already imported
//   const upsertUser = async (clerkUserId: string, email: string, name: string) => {
//     const { data, error } = await supabase
//       .from('users')
//       .upsert({
//         id: clerkUserId,
//         email: email,
//         name: name,
//       }, { onConflict: 'id' });

//     if (error) {
//       throw new Error('Error upserting user: ' + error.message);
//     }

//     return data;
//   };

//   return (
//     <div className="mt-5">
//       <Header />
//       <div className="flex mx-auto justify-center items-center mt-10">
//         <SignUp
//           appearance={{
//             elements: {
//               formButtonPrimary:
//                 'bg-black hover:bg-gray-700 transition text-sm normal-case',
//             },
//           }}
//           afterSignUpUrl="/dashboard"
//         />
//       </div>
//     </div>
//   );
// }