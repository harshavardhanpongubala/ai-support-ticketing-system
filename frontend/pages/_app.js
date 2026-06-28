// Main App File - Wraps all pages
import "@/styles/globals.css";
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  return (
    <>
      {/* This component shows success/error notifications */}
      <Toaster position="top-right" />
      
      {/* Show the current page */}
      <Component {...pageProps} />
    </>
  );
}