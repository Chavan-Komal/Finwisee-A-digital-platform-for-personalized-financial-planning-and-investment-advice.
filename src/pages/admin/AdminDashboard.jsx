import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { useNotice } from '../../hooks/useNotice';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { Loading, Notice } from '../../components/Dashboard/ui';
import AdminOverviewTab from './tabs/AdminOverviewTab';
import UsersTab from './tabs/UsersTab';
import AdminAppointmentsTab from './tabs/AdminAppointmentsTab';
import AdminMessagesTab from './tabs/AdminMessagesTab';
import AdminDocumentsTab from './tabs/AdminDocumentsTab';
import AdminOrdersTab from './tabs/AdminOrdersTab';

const LOADERS = {
  stats: () => api.get('/admin/dashboard'),
  users: () => api.get('/admin/users'),
  appointments: () => api.get('/appointments'),
  messages: () => api.get('/messages'),
  documents: () => api.get('/documents'),
  orders: () => api.get('/orders'),
};

const EMPTY = { stats: null, users: [], appointments: [], messages: [], documents: [], orders: [] };

const TITLES = {
  overview: ['Admin Overview', 'Platform activity at a glance'],
  users: ['Users', 'Manage client and admin accounts'],
  appointments: ['Appointments', 'Confirm consultations and assign advisors'],
  messages: ['Messages', 'Client conversations'],
  documents: ['Documents', 'Review documents shared by clients'],
  orders: ['Orders', 'Purchases and revenue'],
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { notice, notify } = useNotice();
  const navigate = useNavigate();

  const reload = useCallback(async (...keys) => {
    const names = keys.length ? keys : Object.keys(LOADERS);
    // Stats depend on everything else, so refresh them with any change
    if (keys.length && !names.includes('stats')) names.push('stats');
    const results = await Promise.allSettled(names.map((name) => LOADERS[name]()));
    const next = {};
    let failure = null;
    results.forEach((result, i) => {
      if (result.status === 'fulfilled') next[names[i]] = result.value;
      else failure = result.reason;
    });
    setData((prev) => ({ ...prev, ...next }));
    if (failure) notify(failure.message, 'error');
  }, [notify]);

  useEffect(() => {
    reload().finally(() => setLoading(false));
  }, [reload]);

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const stats = data.stats;
  const navItems = [
    { key: 'overview', label: 'Overview', icon: 'fa-th-large' },
    { key: 'users', label: 'Users', icon: 'fa-users' },
    { key: 'appointments', label: 'Appointments', icon: 'fa-calendar-alt', badge: stats?.appointments?.pending },
    { key: 'messages', label: 'Messages', icon: 'fa-envelope', badge: stats?.messages?.unread },
    { key: 'documents', label: 'Documents', icon: 'fa-file-alt', badge: stats?.documents?.pending },
    { key: 'orders', label: 'Orders', icon: 'fa-receipt' },
  ];
  const tabProps = { data, reload, notify, goTo: setActiveTab, currentUser: user };
  const [title, subtitle] = TITLES[activeTab];

  return (
    <DashboardLayout
      roleLabel="Administrator"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      title={title}
      subtitle={subtitle}
      user={user}
      onLogout={handleLogout}
    >
      {loading ? (
        <Loading text="Loading admin dashboard..." />
      ) : (
        <>
          {activeTab === 'overview' && <AdminOverviewTab {...tabProps} />}
          {activeTab === 'users' && <UsersTab {...tabProps} />}
          {activeTab === 'appointments' && <AdminAppointmentsTab {...tabProps} />}
          {activeTab === 'messages' && <AdminMessagesTab {...tabProps} />}
          {activeTab === 'documents' && <AdminDocumentsTab {...tabProps} />}
          {activeTab === 'orders' && <AdminOrdersTab {...tabProps} />}
        </>
      )}
      <Notice notice={notice} />
    </DashboardLayout>
  );
};

export default AdminDashboard;
