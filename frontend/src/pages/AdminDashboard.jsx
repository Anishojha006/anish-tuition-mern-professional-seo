import React, { useEffect, useState } from "react";
import { BarChart3, CircleDollarSign, LayoutDashboard, LogOut, Menu, MonitorSmartphone, TrendingUp, Users, FileText, BarChartHorizontalBig } from "lucide-react";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { API_URL, apiFetch } from "../services/api";
import { useAdminAuth } from "../context/AdminAuthContext";
import { Navigate, useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Analytics", icon: BarChart3, key: "analytics" },
  { label: "Visitors", icon: Users, key: "visitors" },
  { label: "Enquiries", icon: FileText, key: "enquiries" },
  { label: "Settings", icon: MonitorSmartphone, key: "settings" },
];

const defaultFees = [
  { range: "Class 1 to 5", price: 3000, note: "Focused foundational learning and concept clarity" },
  { range: "Class 6 to 8", price: 4500, note: "Strengthened syllabus support and regular revision" },
];

const COLORS = ["#1d4ed8", "#22c55e", "#f59e0b", "#8b5cf6", "#ef4444"]; 

const cardConfig = [
  { label: "Total Visitors", key: "totalVisitors", icon: Users },
  { label: "Visitors Today", key: "visitorsToday", icon: TrendingUp },
  { label: "This Month", key: "visitorsThisMonth", icon: BarChartHorizontalBig },
  { label: "Tuition Enquiries", key: "totalEnquiries", icon: CircleDollarSign },
];

const formatNumber = (value) => new Intl.NumberFormat("en-IN").format(value || 0);

const AdminDashboard = () => {
  const { admin, logout, token } = useAdminAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState({});
  const [dailyData, setDailyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [deviceData, setDeviceData] = useState([]);
  const [pageData, setPageData] = useState([]);
  const [recentEnquiries, setRecentEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingFees, setSavingFees] = useState(false);
  const [fees, setFees] = useState(defaultFees);
  const [selectedTab, setSelectedTab] = useState("dashboard");
  const [range, setRange] = useState(30);
  const [monthRange, setMonthRange] = useState(6);

  useEffect(() => {
    if (!token) return;

    const loadDashboard = async () => {
      try {
        const [overviewRes, dailyRes, monthlyRes, deviceRes, pageRes, enquiriesRes, feesRes] = await Promise.all([
          apiFetch("/admin/analytics/overview"),
          apiFetch(`/admin/analytics/daily?days=${range}`),
          apiFetch(`/admin/analytics/monthly?months=${monthRange}`),
          apiFetch("/admin/analytics/devices"),
          apiFetch("/admin/analytics/pages"),
          apiFetch("/admin/analytics/enquiries"),
          fetch(`${API_URL}/admin/settings/fees`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setOverview(overviewRes.data || {});
        setDailyData(dailyRes.data || []);
        setMonthlyData(monthlyRes.data || []);
        setDeviceData(deviceRes.data || []);
        setPageData(pageRes.data || []);
        setRecentEnquiries(enquiriesRes.data || []);

        const feeData = await feesRes.json();
        if (feeData?.success && Array.isArray(feeData.data) && feeData.data.length) {
          setFees(feeData.data.map((plan) => ({ ...plan, price: Number(plan.price) })));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [token, range, monthRange]);

  if (!token && !admin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const updateFeeField = (index, field, value) => {
    setFees((currentFees) => currentFees.map((fee, feeIndex) => {
      if (feeIndex !== index) return fee;
      return { ...fee, [field]: field === "price" ? Number(value || 0) : value };
    }));
  };

  const saveFees = async () => {
    setSavingFees(true);

    try {
      const response = await fetch(`${API_URL}/admin/settings/fees`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fees }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Unable to update fees.");

      setFees(result.data || fees);
      alert("Fee plans updated successfully.");
    } catch (error) {
      alert(error.message || "Unable to update fees.");
    } finally {
      setSavingFees(false);
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-logo">AO</div>
          <div>
            <b>Anish Ojha</b>
            <small>Admin</small>
          </div>
        </div>

        <nav className="admin-nav">
          {NAV_ITEMS.map(({ label, icon: Icon, key }) => (
            <button
              key={key}
              type="button"
              className={`nav-item ${selectedTab === key ? "active" : ""}`}
              onClick={() => setSelectedTab(key)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button type="button" className="nav-item logout-item" onClick={handleLogout}>
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Dashboard Overview</p>
            <h2>Welcome back, {admin?.name || "Admin"}</h2>
          </div>
          <button type="button" className="icon-button" aria-label="Mobile menu">
            <Menu size={18} />
          </button>
        </header>

        {loading ? (
          <div className="admin-loading">Loading dashboard analytics...</div>
        ) : selectedTab === "settings" ? (
          <section className="panel-card enquiry-panel">
            <div className="panel-header">
              <h3>Fee Management</h3>
            </div>

            <div className="fee-settings-grid">
              {fees.map((fee, index) => (
                <div key={fee.range} className="fee-setting-card">
                  <h4>{fee.range}</h4>

                  <label>
                    Monthly Fee (₹)
                    <input
                      type="number"
                      min="0"
                      value={fee.price}
                      onChange={(event) => updateFeeField(index, "price", event.target.value)}
                    />
                  </label>

                  <label>
                    Short Note
                    <textarea
                      value={fee.note}
                      onChange={(event) => updateFeeField(index, "note", event.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>

            <div className="settings-actions">
              <button type="button" className="btn primary" onClick={saveFees} disabled={savingFees}>
                {savingFees ? "Saving fees..." : "Save fee plans"}
              </button>
            </div>
          </section>
        ) : (
          <>
            <section className="stat-grid">
              {cardConfig.map(({ label, key, icon: Icon }) => (
                <article key={key} className="stat-card">
                  <div className="stat-head">
                    <span>{label}</span>
                    <Icon size={18} />
                  </div>
                  <h3>{formatNumber(overview[key] ?? 0)}</h3>
                  <small className="trend">Updated live</small>
                </article>
              ))}
            </section>

            <section className="panel-grid top-grid">
              <article className="panel-card chart-panel">
                <div className="panel-header">
                  <h3>Daily Visitors</h3>
                  <select value={range} onChange={(event) => setRange(Number(event.target.value))}>
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                  </select>
                </div>

                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={dailyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dfe8f7" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="visitors" stroke="#1d4ed8" strokeWidth={3} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </article>

              <article className="panel-card chart-panel">
                <div className="panel-header">
                  <h3>Monthly Visitors</h3>
                  <select value={monthRange} onChange={(event) => setMonthRange(Number(event.target.value))}>
                    <option value={6}>Last 6 months</option>
                    <option value={12}>Last 12 months</option>
                  </select>
                </div>

                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dfe8f7" />
                      <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="visitors" fill="#0f172a" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

            <section className="panel-grid bottom-grid">
              <article className="panel-card chart-panel">
                <div className="panel-header">
                  <h3>Device Distribution</h3>
                </div>
                <div className="chart-wrap pie-wrap">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie data={deviceData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={82} paddingAngle={4}>
                        {deviceData.map((entry, index) => (
                          <Cell key={`${entry.name}-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="legend-list">
                  {deviceData.map((item, index) => (
                    <div key={item.name} className="legend-item">
                      <span className="legend-dot" style={{ background: COLORS[index % COLORS.length] }} />
                      <span>{item.name}</span>
                      <strong>{item.value}%</strong>
                    </div>
                  ))}
                </div>
              </article>

              <article className="panel-card chart-panel">
                <div className="panel-header">
                  <h3>Page Views</h3>
                </div>
                <div className="chart-wrap">
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={pageData} layout="vertical" margin={{ left: 16 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#dfe8f7" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                      <YAxis type="category" dataKey="page" width={120} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="views" fill="#2563eb" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </article>
            </section>

            <section className="panel-card enquiry-panel">
              <div className="panel-header">
                <h3>Recent Enquiries</h3>
              </div>

              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Phone</th>
                      <th>Class</th>
                      <th>Address</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEnquiries.length ? (
                      recentEnquiries.map((item) => (
                        <tr key={item._id}>
                          <td>{item.name}</td>
                          <td>{item.phone}</td>
                          <td>{item.className}</td>
                          <td>{item.address || "—"}</td>
                          <td>{item.message || "—"}</td>
                          <td>{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="empty-state">No enquiries yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
