import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import MailingListManager from './layouts/MailingList'


const App: React.FC = () => {

  return (
    <>
      <div>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </div>
      <div>
        <MailingListManager />
      </div>
    </>
  );
}

export default App;
