import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminProtected } from '@/components/admin-protected';
import { AdminShell } from '@/components/admin-shell';
import { SiteShell } from '@/components/site-shell';
import { HomePage } from '@/pages/home-page';
import { UploadPage } from '@/pages/upload-page';
import { PublicationDetailPage } from '@/pages/publication-detail-page';
import { AdminLoginPage } from '@/pages/admin-login-page';
import { AdminHistoryPage } from '@/pages/admin-history-page';
import { AdminPublicationsPage } from '@/pages/admin-publications-page';
import { AboutPage } from '@/pages/about-page';
import { ContactPage } from '@/pages/contact-page';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<SiteShell />}>
            <Route index element={<HomePage />} />
            <Route path="gioi-thieu" element={<AboutPage />} />
            <Route path="lien-he" element={<ContactPage />} />
            <Route path="upload" element={<UploadPage />} />
            <Route path="publications/:id" element={<PublicationDetailPage />} />
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route element={<AdminProtected />}>
              <Route path="admin" element={<AdminShell />}>
                <Route index element={<Navigate to="publications" replace />} />
                <Route path="publications" element={<AdminPublicationsPage />} />
                <Route path="history" element={<AdminHistoryPage />} />
              </Route>
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
