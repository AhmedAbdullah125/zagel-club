import '@/src/app/globals.css';
import '@/src/style/main.css';
import Header from '@/components/Header/Header';
import ClientProviders from '@/src/utils/providers/ClientProviders';
import Footer from '@/components/Footer/Footer';
// import logo from '@/src/assets/images/blue-logo.svg';


export async function generateMetadata() {
  return {
    title: 'TheCarrierPigeon',
    description: 'TheCarrierPigeon',
    keywords: 'TheCarrierPigeon',
    openGraph: {
      title: 'TheCarrierPigeon',
      description: 'TheCarrierPigeon',
      url: 'TheCarrierPigeon-rose.vercel.com',
      siteName: 'TheCarrierPigeon',
      images: [
        {
          url: 'https://i.pinimg.com/736x/19/ca/c6/19cac615a37cf98dac18e21293e38e68.jpg',
          width: 1200,
          height: 630,
          alt: 'TheCarrierPigeon',
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
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
