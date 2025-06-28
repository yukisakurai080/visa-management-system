import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import TokuteiGinouDashboard from './pages/TokuteiGinouDashboard'
import TokuteiGinouWorkerList from './pages/TokuteiGinouWorkerList'
import ForeignerList from './pages/ForeignerList'
import ForeignerDetail from './pages/ForeignerDetail'
import ForeignerRegistration from './pages/ForeignerRegistration'
import VisaStatusList from './pages/VisaStatusList'
import ApplicationList from './pages/ApplicationList'
import CertificateApplication from './pages/CertificateApplication'
import ChangeApplication from './pages/ChangeApplication'
import RenewalApplication from './pages/RenewalApplication'
import AcquisitionApplication from './pages/AcquisitionApplication'
import InquiryForm from './pages/InquiryForm'
import CustomerForm from './pages/CustomerForm'
import ShortStayForm from './pages/ShortStayForm'
import ShortStayCustomerForm from './pages/ShortStayCustomerForm'
import CompletedForms from './pages/CompletedForms'
import Login from './pages/Login'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/inquiry" element={<InquiryForm />} />
      <Route path="/form/:formId" element={<CustomerForm />} />
      <Route path="/short-stay/:type" element={<ShortStayForm />} />
      <Route path="/short-stay-form/:type/:formId" element={<ShortStayCustomerForm />} />
      <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="tokutei-ginou" element={<TokuteiGinouDashboard />} />
        <Route path="tokutei-ginou/workers" element={<TokuteiGinouWorkerList />} />
        <Route path="certificate/:category" element={<CertificateApplication />} />
        <Route path="change/:category" element={<ChangeApplication />} />
        <Route path="renewal/:category" element={<RenewalApplication />} />
        <Route path="acquisition/:category" element={<AcquisitionApplication />} />
        <Route path="foreigners" element={<ForeignerList />} />
        <Route path="foreigners/:id" element={<ForeignerDetail />} />
        <Route path="foreigners/new" element={<ForeignerRegistration />} />
        <Route path="visa-statuses" element={<VisaStatusList />} />
        <Route path="applications" element={<ApplicationList />} />
        <Route path="completed-forms" element={<CompletedForms />} />
      </Route>
    </Routes>
  )
}

export default App