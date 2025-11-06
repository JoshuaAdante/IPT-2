import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Download, FileText } from 'lucide-react';
import '../../sass/settings.scss';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('students');
  const [students, setStudents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const [studentRes, facultyRes] = await Promise.all([
        axios.get('/api/students'),
        axios.get('/api/faculties'),
      ]);
      setStudents(studentRes.data.filter(s => s.status !== 'Archived'));
      setFaculties(facultyRes.data.filter(f => f.status !== 'Archived'));
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    }
  };

  const filteredStudents = students.filter(s => {
    const fullName = `${s.firstname || ''} ${s.middlename || ''} ${s.lastname || ''} ${s.name || ''}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (s.student_id || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredFaculties = faculties.filter(f => {
    const fullName = `${f.firstname || ''} ${f.middlename || ''} ${f.lastname || ''} ${f.name || ''}`;
    return fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (f.faculty_id || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleExport = () => {
    alert('Export functionality will be implemented with backend support');
  };

  const totalReports = students.length + faculties.length;

  return (
    <div className='settings-container'>
      <div className='settings-header'>
        <div>
          <h2>Reports</h2>
          <p className='subtitle'>Generate and download reports for students and faculty</p>
        </div>
        <div className='settings-info'>
          <div className='info-badge'>
            <span className='info-label'>Total Students:</span>
            <span className='info-value'>{students.length}</span>
          </div>
          <div className='info-badge'>
            <span className='info-label'>Total Faculty:</span>
            <span className='info-value'>{faculties.length}</span>
          </div>
          <div className='info-badge'>
            <span className='info-label'>Total Reports:</span>
            <span className='info-value'>{totalReports}</span>
          </div>
        </div>
      </div>

      <div className='settings-content'>
        <div className='settings-tabs'>
          <button
            className={`tab-button ${activeTab === 'students' ? 'active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`tab-button ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            Faculty
          </button>
        </div>

        <div className='settings-body'>
          <div className='table-header'>
            <h3>
              {activeTab === 'students' ? `Student Report (${filteredStudents.length} records)` : `Faculty Report (${filteredFaculties.length} records)`}
            </h3>
            <div className='search-box' style={{maxWidth: '250px'}}>
              <input
                type='text'
                placeholder='Search...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='settings-table-wrapper'>
          {activeTab === 'students' ? (
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
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => {
                  const fullName = s.firstname && s.lastname
                    ? `${s.firstname} ${s.middlename ? s.middlename + ' ' : ''}${s.lastname}`.trim()
                    : s.name || 'N/A';
                  return (
                  <tr key={s.id}>
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
                  </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className='settings-table'>
              <thead>
                <tr>
                  <th>Faculty ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredFaculties.map((f) => {
                  const fullName = f.firstname && f.lastname
                    ? `${f.firstname} ${f.middlename ? f.middlename + ' ' : ''}${f.lastname}`.trim()
                    : f.name || 'N/A';
                  return (
                  <tr key={f.id}>
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
                  </tr>
                );
                })}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
