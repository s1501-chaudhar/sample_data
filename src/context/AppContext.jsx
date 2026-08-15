import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { fetchLabObservations } from '../services/excelService';
import patientsMeta from '../patientsMeta.json';
import { authService, patientService } from '../api';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [role, setRole] = useState(() => sessionStorage.getItem('pn_role') || null);
  const [userName, setUserName] = useState(() => sessionStorage.getItem('pn_user') || '');
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionUploads, setSessionUploads] = useState([]); // demo-only, in-memory uploads
  const [isBackendOnline, setIsBackendOnline] = useState(false);

  // Global patient selection & time window for Dashboard
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAdmissionId, setSelectedAdmissionId] = useState('');
  const [timeWindow, setTimeWindow] = useState('24h');
  const [patientList, setPatientList] = useState([]);

  // Check backend connectivity and fetch patient list
  useEffect(() => {
    async function initPatients() {
      try {
        const livePatients = await patientService.getPatients();
        if (Array.isArray(livePatients) && livePatients.length > 0) {
          setIsBackendOnline(true);
          setPatientList(livePatients);
        } else {
          // Fallback to local metadata
          setPatientList(Object.keys(patientsMeta));
        }
      } catch {
        // Backend offline: use bundled patient metadata
        setIsBackendOnline(false);
        setPatientList(Object.keys(patientsMeta));
      }
    }
    initPatients();
  }, []);

  const login = useCallback(async (selectedRole, name, password) => {
    setRole(selectedRole);
    setUserName(name || selectedRole);
    sessionStorage.setItem('pn_role', selectedRole);
    sessionStorage.setItem('pn_user', name || selectedRole);

    // If password provided and backend online, authenticate with POST /auth/login
    if (password) {
      try {
        const authData = await authService.login(name || selectedRole, password);
        if (authData?.access_token) {
          setIsBackendOnline(true);
        }
      } catch (e) {
        console.warn('API login skipped or failed (running in local mode):', e.message);
      }
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setRole(null);
    setUserName('');
  }, []);

  const loadData = useCallback(async () => {
    if (observations.length) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchLabObservations();
      setObservations(data);
    } catch (e) {
      setError(e.message || 'Failed to load lab data');
    } finally {
      setLoading(false);
    }
  }, [observations.length]);

  const addUpload = useCallback((entry) => {
    setSessionUploads((prev) => [entry, ...prev]);
  }, []);

  const patients = useMemo(() => Object.values(patientsMeta), []);

  const value = useMemo(
    () => ({
      role, userName, login, logout,
      observations, loading, error, loadData,
      patients, patientsMeta, patientList,
      sessionUploads, addUpload,
      selectedPatientId, setSelectedPatientId,
      selectedAdmissionId, setSelectedAdmissionId,
      timeWindow, setTimeWindow,
      isBackendOnline,
    }),
    [
      role, userName, login, logout,
      observations, loading, error, loadData,
      patients, patientList, sessionUploads, addUpload,
      selectedPatientId, selectedAdmissionId, timeWindow,
      isBackendOnline,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
