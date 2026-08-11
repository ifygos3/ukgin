import { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import { ProtectedRoute } from './components/ProtectedRoute';
import { NotificationProvider, useNotification } from './contexts/NotificationContext';
import { useEffect } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Donation = lazy(() => import('./pages/Donation'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const PasswordReset = lazy(() => import('./pages/PasswordReset'));
const Constitution = lazy(() => import('./pages/Constitution'));
const Events = lazy(() => import('./pages/Events'));
const Gallery = lazy(() => import('./pages/Gallery'));
const ExecutiveLeadership = lazy(() => import('./pages/ExecutiveLeadership'));
const DocumentCenter = lazy(() => import('./pages/DocumentCenter'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Volunteer = lazy(() => import('./pages/Volunteer'));
const Partners = lazy(() => import('./pages/Partners'));
const Sponsors = lazy(() => import('./pages/Sponsors'));
const StateChapters = lazy(() => import('./pages/StateChapters'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/BlogDetail'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Announcement = lazy(() => import('./pages/Announcement'));
const Projects = lazy(() => import('./pages/Projects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const ConstitutionReader = lazy(() => import('./pages/ConstitutionReader'));
const PaymentEvidence = lazy(() => import('./pages/PaymentEvidence'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const MissionVision = lazy(() => import('./pages/MissionVision'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const DeleteAccount = lazy(() => import('./pages/DeleteAccount'));

const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const UserManagement = lazy(() => import('./admin/pages/UserManagement'));
const DepositManagement = lazy(() => import('./admin/pages/DepositManagement'));
const WithdrawalManagement = lazy(() => import('./admin/pages/WithdrawalManagement'));
const DonationManagement = lazy(() => import('./admin/pages/DonationManagement'));
const KYCVerification = lazy(() => import('./admin/pages/KYCVerification'));
const NotificationManagement = lazy(() => import('./admin/pages/NotificationManagement'));
const SupportTicketManagement = lazy(() => import('./admin/pages/SupportTicketManagement'));
const WalletManagement = lazy(() => import('./admin/pages/WalletManagement'));
const ReferralManagement = lazy(() => import('./admin/pages/ReferralManagement'));
const ReportsAnalytics = lazy(() => import('./admin/pages/ReportsAnalytics'));
const SystemSettings = lazy(() => import('./admin/pages/SystemSettings'));
const AuditLogs = lazy(() => import('./admin/pages/AuditLogs'));
const AdminEvents = lazy(() => import('./admin/pages/AdminEvents'));
const AnnouncementManagement = lazy(() => import('./admin/pages/AnnouncementManagement'));
const VolunteerManagement = lazy(() => import('./admin/pages/VolunteerManagement'));
const GalleryManagement = lazy(() => import('./admin/pages/GalleryManagement'));
const NewsletterManagement = lazy(() => import('./admin/pages/NewsletterManagement'));
const ContactMessageManagement = lazy(() => import('./admin/pages/ContactMessageManagement'));
const PageContentManagement = lazy(() => import('./admin/pages/PageContentManagement'));
const PostManagement = lazy(() => import('./admin/pages/PostManagement'));
const ProjectManagement = lazy(() => import('./admin/pages/ProjectManagement'));
const ConstitutionManagement = lazy(() => import('./admin/pages/ConstitutionManagement'));
const SocialMediaLinkManagement = lazy(() => import('./admin/pages/SocialMediaLinkManagement'));
const ExecutiveLeaderManagement = lazy(() => import('./admin/pages/ExecutiveLeaderManagement'));
const StateChapterManagement = lazy(() => import('./admin/pages/StateChapterManagement'));
const DocumentManagement = lazy(() => import('./admin/pages/DocumentManagement'));
const PartnersSponsorsManagement = lazy(() => import('./admin/pages/PartnersSponsorsManagement'));
const LoginHistory = lazy(() => import('./admin/pages/LoginHistory'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const { showNotification, notification, clearNotification } = useNotification();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className='bg-gray-950 text-white min-h-screen'>
      <NotificationToast notification={notification} onClose={clearNotification} />
      {!isAdminRoute && <Navbar showNotification={showNotification} />}
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/donation' element={<Donation />} />
          <Route path='/payment-evidence' element={<PaymentEvidence />} />
          <Route path='/signup' element={<Signup showNotification={showNotification} />} />
          <Route path='/login' element={<Login showNotification={showNotification} />} />
          <Route path='/reset-password' element={<PasswordReset />} />
          <Route path='/events' element={<Events />} />
          <Route path='/gallery' element={<Gallery />} />
          <Route path='/faq' element={<FAQ />} />
          <Route path='/testimonials' element={<Testimonials />} />
           <Route path='/blog' element={<Blog />} />
           <Route path='/blog/:slug' element={<BlogDetail />} />
           <Route path='/news' element={<News />} />
           <Route path='/news/:slug' element={<NewsDetail />} />
           <Route path='/announcements/:id' element={<Announcement />} />
           <Route path='/projects' element={<Projects />} />
           <Route path='/projects/:slug' element={<ProjectDetail />} />
           <Route path='/privacy' element={<PrivacyPolicy />} />
           <Route path='/terms' element={<PrivacyPolicy.TermsConditions />} />
           <Route path='/cookies' element={<PrivacyPolicy.CookiePolicy />} />
           <Route path='/refunds' element={<PrivacyPolicy.RefundPolicy />} />
          <Route path='/mission-vision' element={<MissionVision />} />
          <Route path='/verify-email' element={<VerifyEmail />} />
          <Route path='/delete-account' element={<DeleteAccount />} />

          <Route path='/constitution' element={<Constitution />} />
          <Route path='/constitution/reader' element={<ConstitutionReader />} />
          <Route path='/executive-leadership' element={<ExecutiveLeadership />} />
          <Route path='/state-chapters' element={<StateChapters />} />
          <Route path='/volunteer' element={<Volunteer />} />
          <Route path='/partners' element={<Partners />} />
          <Route path='/sponsors' element={<Sponsors />} />
          <Route path='/documents' element={<DocumentCenter />} />

          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="deposits" element={<DepositManagement />} />
            <Route path="withdrawals" element={<WithdrawalManagement />} />
            <Route path="donations" element={<DonationManagement />} />
            <Route path="kyc" element={<KYCVerification />} />
            <Route path="wallets" element={<WalletManagement />} />
            <Route path="notifications" element={<NotificationManagement />} />
            <Route path="support-tickets" element={<SupportTicketManagement />} />
            <Route path="referrals" element={<ReferralManagement />} />
            <Route path="reports" element={<ReportsAnalytics />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="settings" element={<SystemSettings />} />
            <Route path="events" element={<Events />} />
            <Route path="event-management" element={<AdminEvents />} />
            <Route path="announcements" element={<AnnouncementManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="newsletters" element={<NewsletterManagement />} />
            <Route path="documents" element={<DocumentManagement />} />
            <Route path="volunteers" element={<VolunteerManagement />} />
            <Route path="contact-messages" element={<ContactMessageManagement />} />
            <Route path="page-content" element={<PageContentManagement />} />
            <Route path="posts" element={<PostManagement />} />
            <Route path="projects" element={<ProjectManagement />} />
            <Route path="constitution" element={<ConstitutionManagement />} />
            <Route path="social-media" element={<SocialMediaLinkManagement />} />
            <Route path="executive-leaders" element={<ExecutiveLeaderManagement />} />
            <Route path="state-chapters" element={<StateChapterManagement />} />
            <Route path="partners-sponsors" element={<PartnersSponsorsManagement />} />
            <Route path="login-history" element={<LoginHistory />} />
          </Route>
        </Routes>
      </Suspense>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
};

export default App;
