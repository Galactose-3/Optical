import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LanguageProvider } from '@/context/language-context';
import { CurrencyProvider } from '@/context/currency-context';
import { AppLayout } from '@/components/app-layout';
import { BodyInjector } from '@/components/body-injector';
import { Toaster } from "@/components/ui/toaster";
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import HomePage from './pages/Home';

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
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/home" element={<HomePage />} />
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
