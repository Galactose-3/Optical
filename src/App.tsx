import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from '@/context/language-context';
import { CurrencyProvider } from '@/context/currency-context';
import { AppLayout } from '@/components/app-layout';
import { BodyInjector } from '@/components/body-injector';
import { Toaster } from "@/components/ui/toaster";
import LoginPage from './app/login/page';
import UnifiedDashboard from './app/dashboard/page';

function App() {
  return (
    <Router>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange
      >
        <BodyInjector>
          <LanguageProvider>
            <CurrencyProvider>
              <AppLayout>
                <Routes>
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/dashboard" element={<UnifiedDashboard />} />
                </Routes>
              </AppLayout>
              <Toaster />
            </CurrencyProvider>
          </LanguageProvider>
        </BodyInjector>
      </ThemeProvider>
    </Router>
  );
}

export default App;