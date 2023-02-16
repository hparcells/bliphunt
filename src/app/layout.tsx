import '../styles/globals.scss';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head />
      <body>{children}</body>
    </html>
  );
}

export default Layout;
