import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from '@/features/auth/hooks/useAuth';
import { Toaster } from '@/shared/components/ui/sonner';
import { AppRouter } from '@/app/router';
import { queryClient } from '@/lib/react-query';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </Router>
      {/* React Query Devtools - uniquement en dev */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
