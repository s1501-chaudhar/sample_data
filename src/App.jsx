import { Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { useApp } from './context/AppContext';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UploadReports from './pages/UploadReports';
import PatientTimeline from './pages/PatientTimeline';

function RequireAuth({ children }) {
  const { role } = useApp();
  const location = useLocation();

  if (!role) return <Navigate to="/login" replace />;

  const isLabUser = role === 'Laboratory Technician' || (role && role.toLowerCase().includes('lab'));

  // If a Lab User tries to access clinical dashboard/timeline, redirect to /upload
  if (isLabUser && location.pathname !== '/upload') {
    return <Navigate to="/upload" replace />;
  }

  return children;
}

// Redirect legacy /patients/:pid/:adm to /dashboard?patientId=:pid&admissionId=:adm
function PatientDetailRedirect() {
  const { patientId, admissionId } = useParams();
  return <Navigate to={`/dashboard?patientId=${patientId}&admissionId=${admissionId}`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Navigate to="/dashboard" replace />} />
        <Route path="/patients/:patientId/:admissionId" element={<PatientDetailRedirect />} />
        <Route path="/upload" element={<UploadReports />} />
        <Route path="/timeline" element={<PatientTimeline />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
