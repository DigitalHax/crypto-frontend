import React, { ReactElement, useState } from 'react';
import { QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CryptosWidget } from './components/CryptosWidget';
import { Spinner } from './components/Spinner';
import { queryClient } from './lib/react-query';

function App(): ReactElement {
  const [count, setCount] = useState(0);

  return (
    <React.Suspense
      fallback={
        <div className="h-screen w-screen flex justify-center">
          <Spinner size="xl" variant="primary" />
        </div>
      }
    >
      <QueryClientProvider client={queryClient}>
        {process.env.NODE_ENV !== 'test' && <ReactQueryDevtools />}
        <main className="flex items-center">
          <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-7xl mx-auto">
            <CryptosWidget />
          </div>
        </main>
      </QueryClientProvider>
    </React.Suspense>
  );
}

export default App;
