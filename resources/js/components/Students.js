import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCounts } from '../Context/CountContext';
import { Search, Plus, Edit2, Archive, ArchiveRestore } from 'lucide-react';
import '../../sass/students.scss';

export default function Students() {
  const { refreshCounts } = useCounts();
  const [students, setStudents] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showArchive, setShowArchive] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('All');
  const [departments, setDepartments] = useState([]);
  const [courses, setCourses] = useState([]);

  const [form, setForm] = useState({
    student_id: '',
    name: '',
    email: '',
    department: '',
    course: '',
    year_level: '',
    status: 'Active',
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const fetchDepartmentsAndCourses = async () => {
    try {
      console.log('Fetching departments and courses...');
      const [deptRes, courseRes] = await Promise.all([
        axios.get('/api/departments'),
        axios.get('/api/courses')
      ]);
      console.log('Departments response:', deptRes.data);
      console.log('Courses response:', courseRes.data);
      
      const activeDepts = deptRes.data.filter(d => d.status !== 'Archived');
      const activeCourses = courseRes.data.filter(c => c.status !== 'Archived');
      
      console.log('Active departments:', activeDepts);
      console.log('Active courses:', activeCourses);
      
      setDepartments(activeDepts);
      setCourses(activeCourses);
    } catch (err) {
      console.error('Failed to fetch departments/courses:', err);
      console.error('Error response:', err.response);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchDepartmentsAndCourses();
    
    // Listen for data updates from Settings
    const handleDataUpdate = (event) => {
      console.log('Students: Data updated, refetching dropdowns...', event.detail);
      if (event.detail.type === 'departments' || event.detail.type === 'courses') {
        fetchDepartmentsAndCourses();
      }
      // Also refresh students list to show updated counts in dashboard
      fetchStudents();
    };
    
    window.addEventListener('dataUpdated', handleDataUpdate);
    
    return () => {
      window.removeEventListener('dataUpdated', handleDataUpdate);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!form.student_id || !form.name || !form.email || !form.department || !form.course || !form.year_level) {
      alert('⚠️ Please fill in all required fields.');
      return;
    }
    
    console.log('Submitting student form:', form);
    
    try {
      if (editingId) {
        const response = await axios.put(`/api/students/${editingId}`, form);
        console.log('Update response:', response.data);
        alert('✅ Student updated successfully!');
      } else {
        const response = await axios.post('/api/students', form);
        console.log('Create response:', response.data);
        alert('✅ Student added successfully!');
      }
      await fetchStudents();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'students', timestamp: Date.now() } 
      }));
      
      closeForm();
    } catch (error) {
      console.error('Save Student Error:', error);
      console.error('Error response:', error.response);
      
      // Show detailed error message
      let errorMessage = '❌ Failed to save student.';
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

  const openForm = async (student = null) => {
    // Refresh departments and courses when form opens
    await fetchDepartmentsAndCourses();
    
    if (student) {
      setEditingId(student.id);
      setForm({
        student_id: student.student_id,
        name: student.name || '',
        email: student.email,
        department: student.department,
        course: student.course,
        year_level: student.year_level,
        status: student.status,
      });
    } else {
      setEditingId(null);
      setForm({
        student_id: '',
        name: '',
        email: '',
        department: '',
        course: '',
        year_level: '',
        status: 'Active',
      });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
  };

  const handleArchive = async (id) => {
    if (!confirm('Archive this student?')) return;
    try {
      await axios.patch(`/api/students/${id}/archive`);
      await fetchStudents();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'students', timestamp: Date.now() } 
      }));
      
      alert('📦 Student archived successfully!');
    } catch (err) {
      console.error('Archive Student Error:', err);
      alert('❌ Failed to archive student.');
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.patch(`/api/students/${id}/restore`);
      await fetchStudents();
      await refreshCounts();
      
      // Broadcast update event for dashboard to refresh
      window.dispatchEvent(new CustomEvent('dataUpdated', { 
        detail: { type: 'students', timestamp: Date.now() } 
      }));
      
      alert('✅ Student restored successfully!');
    } catch (err) {
      console.error('Restore Student Error:', err);
      alert('❌ Failed to restore student.');
    }
  };

  const courseOptions = ['All', ...new Set(students.map(s => s.course))];

  // Filter students based on search and course (show all including archived)
  const filteredStudents = students.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.student_id || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (s.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === 'All' || s.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <div>
          <h2>Student Management</h2>
          <p className='subtitle'>Manage students and their information</p>
        </div>
      </div>

      <div className='settings-content'>
        <div className='settings-tabs'>
          <button className='tab-button active'>
            Students
          </button>
        </div>

        <div className='settings-body'>
          <div className='table-header'>
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center', flex: 1}}>
              <h3>Students</h3>
              <div className='search-box' style={{maxWidth: '250px'}}>
                <Search size={18} className='search-icon' />
                <input
                  type='text'
                  placeholder='Search Students'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className='department-filter'
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                {courseOptions.map(course => (
                  <option key={course} value={course}>{course === 'All' ? 'All Courses' : course}</option>
                ))}
              </select>
            </div>
            <button className='btn-add-setting' onClick={() => openForm()}>
              + Add Student
            </button>
          </div>

      {showForm && (
        <div className='modal-overlay' onClick={closeForm}>
          <div className='modal-content' onClick={(e) => e.stopPropagation()}>
            <h3 className='modal-title'>
              {editingId ? 'Edit Student' : 'Add New Student'}
            </h3>

            <form onSubmit={handleSubmit} className='modal-form'>
              <div className='form-row'>
                <div className='form-group'>
                  <label>Student ID</label>
                  <input
                    type='text'
                    placeholder='Enter Student ID'
                    value={form.student_id}
                    onChange={(e) => setForm({ ...form, student_id: e.target.value })}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Full Name</label>
                  <input
                    type='text'
                    placeholder='Enter Full Name'
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Email</label>
                  <input
                    type='email'
                    placeholder='Enter Email'
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                  />
                </div>

                <div className='form-group'>
                  <label>Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    required
                  >
                    <option value=''>Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className='form-row'>
                <div className='form-group'>
                  <label>Course</label>
                  <select
                    value={form.course}
                    onChange={(e) => setForm({ ...form, course: e.target.value })}
                    required
                  >
                    <option value=''>Select Course</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.name}>{course.name}</option>
                    ))}
                  </select>
                </div>

                <div className='form-group'>
                  <label>Year Level</label>
                  <select
                    value={form.year_level}
                    onChange={(e) => setForm({ ...form, year_level: e.target.value })}
                    required
                  >
                    <option value=''>Select Year Level</option>
                    <option value='1st Year'>1st Year</option>
                    <option value='2nd Year'>2nd Year</option>
                    <option value='3rd Year'>3rd Year</option>
                    <option value='4th Year'>4th Year</option>
                  </select>
                </div>
              </div>

              <div className='modal-actions'>
                <button
                  type='button'
                  onClick={closeForm}
                  className='btn-cancel'
                >
                  Cancel
                </button>
                <button
                  type='submit'
                  className='btn-submit'
                >
                  {editingId ? 'Update Student' : 'Add Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

          <div className='settings-table-wrapper'>
          <table className='settings-table'>
            <thead>
              <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Course</th>
                <th>Year Level</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => {
                const fullName = s.name || 'N/A';
                  
                return (
                <tr key={s.id} className={s.status === 'Archived' ? 'archived-row' : ''}>
                  <td>{s.student_id}</td>
                  <td>{fullName}</td>
                  <td>{s.email}</td>
                  <td>{s.department}</td>
                  <td>{s.course}</td>
                  <td>{s.year_level}</td>
                  <td>
                    <span className={`status-badge ${s.status.toLowerCase()}`}>
                      {s.status}
                    </span>
                  </td>
                  <td>
                    <div className='action-buttons'>
                      <button
                        onClick={() => openForm(s)}
                        className='btn-icon btn-edit'
                        title='Edit'
                        disabled={s.status === 'Archived'}
                      >
                        <Edit2 size={16} />
                      </button>
                      {s.status !== 'Archived' ? (
                        <button
                          onClick={() => handleArchive(s.id)}
                          className='btn-icon btn-archive'
                          title='Archive'
                        >
                          <Archive size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(s.id)}
                          className='btn-icon btn-restore'
                          title='Unarchive'
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
