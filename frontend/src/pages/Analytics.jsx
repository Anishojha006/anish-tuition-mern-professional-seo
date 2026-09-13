import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const Analytics = () => {
  const [overview, setOverview] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/admin/analytics/overview");
        setOverview(data.data || {});
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="admin-loading">Loading analytics...</div>;

  return (
    <div className="admin-page-card">
      <h2>Visitor Analytics</h2>
      <div className="stat-grid compact-grid">
        <div className="stat-card"><div className="stat-head"><span>Total Visitors</span></div><h3>{overview.totalVisitors || 0}</h3></div>
        <div className="stat-card"><div className="stat-head"><span>Visitors Today</span></div><h3>{overview.visitorsToday || 0}</h3></div>
        <div className="stat-card"><div className="stat-head"><span>Page Views</span></div><h3>{overview.totalPageViews || 0}</h3></div>
        <div className="stat-card"><div className="stat-head"><span>Online Now</span></div><h3>{overview.visitorsCurrentlyOnline || 0}</h3></div>
      </div>
    </div>
  );
};

export default Analytics;
