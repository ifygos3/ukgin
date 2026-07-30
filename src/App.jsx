import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Donation from './pages/Donation';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PasswordReset from './pages/PasswordReset';
import Constitution from './pages/Constitution';
import Events from './pages/Events';
import Gallery from './pages/Gallery';
import ExecutiveLeadership from './pages/ExecutiveLeadership';
import DocumentCenter from './pages/DocumentCenter';
import FAQ from './pages/FAQ';
import Volunteer from './pages/Volunteer';
import Partners from './pages/Partners';
import Sponsors from './pages/Sponsors';
import StateChapters from './pages/StateChapters';
import Testimonials from './pages/Testimonials';
import Blog from './pages/Blog';
import ConstitutionReader from './pages/ConstitutionReader';

import AdminLayout from './admin/components/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import UserManagement from './admin/pages/UserManagement';
import DepositManagement from './admin/pages/DepositManagement';
import WithdrawalManagement from './admin/pages/WithdrawalManagement';
import KYCVerification from './admin/pages/KYCVerification';
import NotificationManagement from './admin/pages/NotificationManagement';
import SupportTicketManagement from './admin/pages/SupportTicketManagement';
import WalletManagement from './admin/pages/WalletManagement';
import ReferralManagement from './admin/pages/ReferralManagement';
import ReportsAnalytics from './admin/pages/ReportsAnalytics';
import SystemSettings from './admin/pages/SystemSettings';
import AuditLogs from './admin/pages/AuditLogs';

const App = () => {
  return (
    <div className='bg-gray-950 text-white min-h-screen'>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/donation' element={<Donation />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/reset-password' element={<PasswordReset />} />
        <Route path='/events' element={<Events />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/faq' element={<FAQ />} />
        <Route path='/testimonials' element={<Testimonials />} />
        <Route path='/blog' element={<Blog />} />

        <Route path='/constitution' element={
          <ProtectedRoute>
            <Constitution />
          </ProtectedRoute>
        } />
        <Route path='/constitution/reader' element={
          <ProtectedRoute>
            <ConstitutionReader />
          </ProtectedRoute>
        } />
        <Route path='/executive-leadership' element={
          <ProtectedRoute>
            <ExecutiveLeadership />
          </ProtectedRoute>
        } />
        <Route path='/state-chapters' element={
          <ProtectedRoute>
            <StateChapters />
          </ProtectedRoute>
        } />
        <Route path='/volunteer' element={
          <ProtectedRoute>
            <Volunteer />
          </ProtectedRoute>
        } />
        <Route path='/partners' element={
          <ProtectedRoute>
            <Partners />
          </ProtectedRoute>
        } />
        <Route path='/sponsors' element={
          <ProtectedRoute>
            <Sponsors />
          </ProtectedRoute>
        } />
        <Route path='/documents' element={
          <ProtectedRoute requireAdmin={true}>
            <DocumentCenter />
          </ProtectedRoute>
        } />

        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="deposits" element={<DepositManagement />} />
          <Route path="withdrawals" element={<WithdrawalManagement />} />
          <Route path="donations" element={<Donation />} />
          <Route path="kyc" element={<KYCVerification />} />
          <Route path="wallets" element={<WalletManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="support-tickets" element={<SupportTicketManagement />} />
          <Route path="referrals" element={<ReferralManagement />} />
          <Route path="reports" element={<ReportsAnalytics />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="settings" element={<SystemSettings />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
