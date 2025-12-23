'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
// import { ProfileDataProvider } from '@/src/Context/ProfileContext';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

export default function ClientProviders({ children }) {
  // create QueryClient on the client only and persist it across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ProfileDataProvider> */}
          {children}
          <Toaster position="top-right" />
      {/* </ProfileDataProvider> */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
