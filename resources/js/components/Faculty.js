import React, { useState, useEffect } from "react";
import axios from "axios";
import { useCounts } from "../Context/CountContext";
import { Search, Plus, Edit2, Archive, ArchiveRestore } from "lucide-react";
import "../../sass/faculty.scss";

export default function Faculty() {
  const { refreshCounts } = useCounts();
  const [faculties, setFaculties] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [departmentsList, setDepartmentsList] = useState([]);

  const [form, setForm] = useState({
    faculty_id: "",
    employee_id: "",
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    position: "",
    employment_type: "",
    office_phone: "",
    status: "Active",
  });

  // Fetch data
  const fetchFaculties = async () => {
    try {
      const res = await axios.get("/api/faculties");
      setFaculties(res.data);
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments for Faculty...');
      const res = await axios.get("/api/departments");
      console.log('Departments response:', res.data);
      
      const activeDepts = res.data.filter(d => d.status !== 'Archived');
      console.log('Active departments:', activeDepts);
      
      setDepartmentsList(activeDepts);
    } catch (err) {
      console.error("Failed to fetch departments:", err);
      console.error('Error response:', err.response);
    }
  };

  useEffect(() => {
    fetchFaculties();
    fetchDepartments();
    
    // Listen for data updates from Settings
    const handleDataUpdate = (event) => {
      console.log('Faculty: Data updated, refetching departments...', event.detail);
      if (event.detail.type === 'departments') {
        fetchDepartments();
      }
      // Also refresh faculty list to show updated counts in dashboard
      fetchFaculties();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  // Position and Type options
  const positions = ['Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Instructor', 'Dean', 'Department Head', 'Coordinator'];
  const employmentTypes = ['Full-time', 'Part-time', 'Adjunct', 'Visiting'];
  const degrees = ['Ph.D.', 'M.Sc.', 'M.A.', 'M.B.A.', 'B.Sc.', 'B.A.', 'Ed.D.', 'Other'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!form.first_name || !form.last_name || !form.email || !form.department || !form.position) {
      alert('⚠️ Please fill in all required fields.');
      return;
    }
    
    console.log('Submitting faculty form:', form);
    
    try {
      if (editingId) {
        const response = await axios.put(`/api/faculties/${editingId}`, form);
        console.log('Update response:', response.data);
        alert("✅ Faculty updated successfully!");
      } else {
        const response = await axios.post("/api/faculties", form);
        console.log('Create response:', response.data);
        alert("✅ Faculty added successfully!");
      }

      await fetchFaculties();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'faculties', timestamp: Date.now() } 
      }));
      
      closeForm();
    } catch (error) {
      console.error("Save Faculty Error:", error);
      console.error('Error response:', error.response);
      
      // Show detailed error message
      let errorMessage = '❌ Failed to save faculty.';
      if (error.response?.data?.message) {
        errorMessage += '\n' + error.response.data.message;
      }
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage += '\n' + errors.join('\n');
      }
      alert(errorMessage);
    }
  };

  const openForm = async (faculty = null) => {
    // Refresh departments when form opens
    await fetchDepartments();
    
    if (faculty) {
      setEditingId(faculty.id);
      setForm({
        faculty_id: faculty.faculty_id || "",
        employee_id: faculty.employee_id || "",
        first_name: faculty.first_name || "",
        last_name: faculty.last_name || "",
        email: faculty.email || "",
        department: faculty.department || "",
        position: faculty.position || "",
        employment_type: faculty.employment_type || "",
        office_phone: faculty.office_phone || "",
        status: faculty.status || "Active",
      });
    } else {
      setEditingId(null);
      setForm({
        faculty_id: "",
        employee_id: "",
        first_name: "",
        last_name: "",
        email: "",
        department: "",
        position: "",
        employment_type: "",
        office_phone: "",
        status: "Active",
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleArchive = async (id) => {
    if (!confirm("Archive this faculty?")) return;
    try {
      await axios.patch(`/api/faculties/${id}/archive`);
      await fetchFaculties();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'faculties', timestamp: Date.now() } 
      }));
      
      alert("📦 Faculty archived successfully!");
    } catch (err) {
      console.error("Archive Faculty Error:", err);
      alert("❌ Failed to archive faculty.");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`/api/faculties/${id}/restore`);
      await fetchFaculties();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'faculties', timestamp: Date.now() } 
      }));
      
      alert("✅ Faculty restored successfully!");
    } catch (err) {
      console.error("Restore Faculty Error:", err);
      alert("❌ Failed to restore faculty.");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('⚠️ PERMANENT DELETE: This will completely remove the faculty from the database. This action cannot be undone. Are you sure?')) return;
    
    try {
      await axios.delete(`/api/faculties/${id}`);
      await fetchFaculties();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'faculties', timestamp: Date.now() } 
      }));
      
      closeForm();
      alert('🗑️ Faculty permanently deleted from database!');
    } catch (err) {
      console.error('Delete Faculty Error:', err);
      alert('❌ Failed to delete faculty.');
    }
  };

  // Get unique departments for filter
  const departments = ["All", ...new Set(faculties.map(f => f.department))];

  // Filter faculties based on search, department, and archive view
  const filteredFaculties = faculties.filter(f => {
    const matchesSearch = (f.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (f.faculty_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (f.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = departmentFilter === "All" || f.department === departmentFilter;
    const matchesArchive = showArchive ? f.status === 'Archived' : f.status !== 'Archived';
    return matchesSearch && matchesDepartment && matchesArchive;
  });

  return (
    <div className="settings-container">
      <div className="settings-header">
        <div>
          <h2>Faculty Management</h2>
          <p className="subtitle">Manage faculty members and their information</p>
        </div>
      </div>

      <div className="settings-content">
        <div className="settings-tabs">
          <button 
            className={`tab-button ${!showArchive ? 'active' : ''}`}
            onClick={() => setShowArchive(false)}
          >
            Faculty Members
          </button>
          <button 
            className={`tab-button ${showArchive ? 'active' : ''}`}
            onClick={() => setShowArchive(true)}
          >
            📦 Archived
          </button>
        </div>

        <div className="settings-body">
          <div className="table-header">
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flex: 1}}>
              <h3>{showArchive ? 'Archived Faculty' : 'Faculty Members'}</h3>
              <div className="search-box" style={{maxWidth: '250px'}}>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search Faculty"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="department-filter"
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept === "All" ? "Departments" : dept}</option>
                ))}
              </select>
            </div>
            {!showArchive && (
              <button className="btn-add-setting" onClick={() => openForm()}>
                + Add Faculty
              </button>
            )}
          </div>

      {/* ✅ Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">
              {editingId ? "Edit Faculty" : "Add New Faculty"}
            </h3>

            <form onSubmit={handleSubmit} className="modal-form">
              <h4 style={{marginTop: 0, color: '#1e3a8a'}}>📋 Faculty Information</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name *</label>
                  <input
                    type="text"
                    placeholder="First Name"
                    value={form.first_name}
                    onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={form.last_name}
                    onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    placeholder="Employee ID (optional)"
                    value={form.employee_id}
                    onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Department *</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    required
                  >
                    <option value="">Select Department</option>
                    {departmentsList.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Position *</label>
                  <select
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    required
                  >
                    <option value="">Select Position</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Employment Type</label>
                  <select
                    value={form.employment_type}
                    onChange={(e) => setForm({ ...form, employment_type: e.target.value })}
                  >
                    <option value="">Select Type</option>
                    {employmentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Office Phone</label>
                  <input
                    type="tel"
                    placeholder="Office Phone Number"
                    value={form.office_phone}
                    onChange={(e) => setForm({ ...form, office_phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-actions" style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #ddd', display: 'flex', justifyContent: 'space-between'}}>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  {editingId && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleArchive(editingId)}
                        className="btn-icon"
                        style={{padding: '0.5rem 1rem', background: '#f59e0b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                        title="Archive Faculty"
                      >
                        📦 Archive
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(editingId)}
                        className="btn-icon"
                        style={{padding: '0.5rem 1rem', background: '#dc2626', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'}}
                        title="Permanently Delete"
                      >
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
                <div style={{display: 'flex', gap: '0.5rem'}}>
                  <button
                    type="button"
                    onClick={closeForm}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-submit"
                  >
                    {editingId ? "Update Faculty" : "Add Faculty"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

          <div className="settings-table-wrapper">
          <table className="settings-table">
            <thead>
              <tr>
                <th>Faculty ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Position</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFaculties.map((f) => {
                const fullName = f.name || 'N/A';
                
                return (
                <tr key={f.id} className={f.status === "Archived" ? "archived-row" : ""}>
                  <td>{f.faculty_id}</td>
                  <td>{fullName}</td>
                  <td>{f.email}</td>
                  <td>{f.department}</td>
                  <td>{f.position}</td>
                  <td>
                    <span className={`status-badge ${f.status.toLowerCase()}`}>
                      {f.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => openForm(f)}
                        className="btn-icon btn-edit"
                        title="Edit"
                        disabled={f.status === "Archived"}
                      >
                        <Edit2 size={16} />
                      </button>
                      {f.status !== "Archived" ? (
                        <button
                          onClick={() => handleArchive(f.id)}
                          className="btn-icon btn-archive"
                          title="Archive"
                        >
                          <Archive size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(f.id)}
                          className="btn-icon btn-restore"
                          title="Unarchive"
                        >
                          <ArchiveRestore size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
        </div>
      </div>
    </div>
  );
}
