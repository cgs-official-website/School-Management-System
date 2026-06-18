import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import StatCard from '../../components/common/StatCard';
import Icon from '../../components/common/Icon';

export default function SuperAdminDashboard() {
  const [schoolsCount, setSchoolsCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatformStats = async () => {
      try {
        const schoolsSnap = await getDocs(collection(db, 'schools'));
        setSchoolsCount(schoolsSnap.size);

        const usersSnap = await getDocs(collection(db, 'users'));
        setTotalUsers(usersSnap.size);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlatformStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="page-header">Platform Overview</h1>
        <p className="page-subtitle">Welcome back, Team Carrezza. Monitor your SaaS metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Active Schools"
          value={String(schoolsCount)}
          subtitle="Vendors hosted on platform"
          icon="business"
          color="primary"
        />
        <StatCard
          title="Total Users"
          value={String(totalUsers)}
          subtitle="Across all schools"
          icon="group"
          color="success"
        />
        <StatCard
          title="Platform Revenue"
          value="$--"
          subtitle="Coming soon"
          icon="payments"
          color="tertiary"
        />
      </div>

      <div className="card p-6 mt-6">
        <h3 className="text-title-lg font-semibold mb-4">Quick Start</h3>
        <p className="text-body-md text-gray-600 mb-4">
          To onboard a new school, go to the <strong>Manage Schools</strong> page and click "Add New School". 
          This will generate a unique School ID and automatically provision an Admin account for that school's principal.
        </p>
      </div>
    </div>
  );
}
