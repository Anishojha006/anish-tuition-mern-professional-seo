import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch("/admin/analytics/enquiries");
        setEnquiries(data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="admin-loading">Loading enquiries...</div>;

  return (
    <div className="admin-page-card">
      <h2>Tuition Enquiries</h2>
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
            {enquiries.length ? enquiries.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.phone}</td>
                <td>{item.className}</td>
                <td>{item.address || "—"}</td>
                <td>{item.message || "—"}</td>
                <td>{new Date(item.createdAt).toLocaleDateString("en-IN")}</td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="empty-state">No enquiries available.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enquiries;
