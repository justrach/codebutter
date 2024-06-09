export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isLoaded, isSignedIn, user } = useUser();

  // if (!isLoaded || !isSignedIn) {
  //   // Handle loading state or unauthenticated user
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="min-h-screen flex flex-col ">
      {/* <NavBarLoggedIn userProfile={user} /> */}
      <div className="flex-grow">{children}</div>
      {/* <div className="sm:p-7 sm:pb-0">
        <Footer />
      </div> */}
    </div>
  );
}
