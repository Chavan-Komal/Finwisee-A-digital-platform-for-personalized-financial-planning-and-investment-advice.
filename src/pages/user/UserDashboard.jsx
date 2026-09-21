import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../api/client';
import { useNotice } from '../../hooks/useNotice';
import DashboardLayout from '../../components/Dashboard/DashboardLayout';
import { Loading, Notice } from '../../components/Dashboard/ui';
import OverviewTab from './tabs/OverviewTab';
import ProfileTab from './tabs/ProfileTab';
import GoalsTab from './tabs/GoalsTab';
import AppointmentsTab from './tabs/AppointmentsTab';
import MessagesTab from './tabs/MessagesTab';
import DocumentsTab from './tabs/DocumentsTab';
import OrdersTab from './tabs/OrdersTab';

const LOADERS = {
  profile: () => api.get('/user-profile/my-profile'),
  plans: () => api.get('/financial-plans/my-plans'),
  appointments: () => api.get('/appointments/my-appointments'),
  inbox: () => api.get('/messages/my-messages'),
  sent: () => api.get('/messages/sent-messages'),
  documents: () => api.get('/documents/my-documents'),
  orders: () => api.get('/orders/my-orders'),
};

const EMPTY = { profile: null, plans: [], appointments: [], inbox: [], sent: [], documents: [], orders: [] };

const TITLES = {
  overview: ['Overview', 'Your financial planning at a glance'],
  profile: ['My Profile', 'Personal and financial details that shape your advice'],
  goals: ['Financial Goals', 'Track progress towards what matters to you'],
  appointments: ['Appointments', 'Consultations with Finwise advisors'],
  messages: ['Messages', 'Conversations with your advisors'],
  documents: ['Documents', 'Securely share statements and records'],
  orders: ['Purchases', 'Services you have bought'],
};

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [intent, setIntent] = useState(null);
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const { user, logout } = useAuth();
  const { notice, notify } = useNotice();
  const navigate = useNavigate();

  const reload = useCallback(async (...keys) => {
    const names = keys.length ? keys : Object.keys(LOADERS);
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

  const goTo = (tab, action = null) => {
    setActiveTab(tab);
    setIntent(action);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const unread = data.inbox.filter((m) => !m.isRead).length;
  const tabProps = { data, reload, notify, goTo, intent, clearIntent: () => setIntent(null) };

  const navItems = [
    { key: 'overview', label: 'Overview', icon: 'fa-th-large' },
    { key: 'profile', label: 'Profile', icon: 'fa-user' },
    { key: 'goals', label: 'Goals', icon: 'fa-bullseye' },
    { key: 'appointments', label: 'Appointments', icon: 'fa-calendar-alt' },
    { key: 'messages', label: 'Messages', icon: 'fa-envelope', badge: unread },
    { key: 'documents', label: 'Documents', icon: 'fa-file-alt' },
    { key: 'orders', label: 'Purchases', icon: 'fa-receipt' },
  ];

  const [title, subtitle] = TITLES[activeTab];

  return (
    <DashboardLayout
      roleLabel="Client portal"
      navItems={navItems}
      activeTab={activeTab}
      onTabChange={(tab) => goTo(tab)}
      title={title}
      subtitle={subtitle}
      user={user}
      onLogout={handleLogout}
    >
      {loading ? (
        <Loading text="Loading your dashboard..." />
      ) : (
        <>
          {activeTab === 'overview' && <OverviewTab {...tabProps} />}
          {activeTab === 'profile' && <ProfileTab {...tabProps} />}
          {activeTab === 'goals' && <GoalsTab {...tabProps} />}
          {activeTab === 'appointments' && <AppointmentsTab {...tabProps} />}
          {activeTab === 'messages' && <MessagesTab {...tabProps} />}
          {activeTab === 'documents' && <DocumentsTab {...tabProps} />}
          {activeTab === 'orders' && <OrdersTab {...tabProps} />}
        </>
      )}
      <Notice notice={notice} />
    </DashboardLayout>
  );
};

export default UserDashboard;
