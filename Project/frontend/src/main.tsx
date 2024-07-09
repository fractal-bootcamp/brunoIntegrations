import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import RootLayout from './layouts/root-layout.tsx'
import ProtectedRoute from '../src/components/ProtectedRoute.tsx'
import Home from "./components/Home"
import SignIn from './routes/sign-in.tsx'
import SignUp from './routes/sign-up.tsx'
import MailingListManager from './layouts/MailingList.tsx'
//import MailingListManager
//import ToolkitEditor


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/sign-in/*", element: <SignIn /> },
      { path: "/sign-up/*", element: <SignUp /> },
      {
        path: "/Mailing-list-manager",
        element: (
          <ProtectedRoute>
            <MailingListManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Editor",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/Editor",
        element: (
          <ProtectedRoute>
            <MailingListManager />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);



// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>,
)
