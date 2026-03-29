import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthCallbackPage } from './pages/AuthCallbackPage';
import { LandingPage } from './pages/LandingPage';
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout';
import { HomePage } from './pages/HomePage';
import { DashboardAnalyticsPage } from './pages/DashboardPage';
import { AllLinksPage } from './pages/AllLinksPage';
import { LinkAnalyticsPage } from './pages/LinkAnalyticsPage';
import { ProfilePage } from './pages/ProfilePage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route element={<AuthenticatedLayout />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardAnalyticsPage />} />
        <Route path="/links" element={<AllLinksPage />} />
        <Route path="/links/:shortCode/analytics" element={<LinkAnalyticsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
