import '@/src/app/globals.css';
import '@/src/style/main.css';
import ClientProviders from '@/src/utils/providers/ClientProviders';
import NotificationListener from '@/components/Notifications/NotificationListener';


export async function generateMetadata() {
  return {
    title: 'Zagel',
    description: 'Zagel',
    keywords: 'Zagel',
    openGraph: {
      title: 'Zagel',
      description: 'Zagel',
      url: 'Zagel-rose.vercel.com',
      siteName: 'Zagel',
      images: [
        {
          url: 'https://i.pinimg.com/736x/19/ca/c6/19cac615a37cf98dac18e21293e38e68.jpg',
          width: 1200,
          height: 630,
          alt: 'Zagel',
        },
      ],
      type: 'website',
      locale: 'ar_SA',
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body suppressHydrationWarning={true}>
        <ClientProviders>
          <NotificationListener />
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
