import './globals.css';
import AuthProvider from '../components/AuthProvider';

export const metadata = {
  title: 'Solango',
  description: 'Your AI Assistant Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}