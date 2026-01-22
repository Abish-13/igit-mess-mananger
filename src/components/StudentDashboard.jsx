import React, { useState, useEffect } from 'react';

const StudentDashboard = ({ studentId }) => {
  const [notices, setNotices] = useState([]);
  const [report, setReport] = useState({ type: 'Plumbing', message: '' });

  // Fetch Notices on Load
  useEffect(() => {
    fetch('https://igit-mess-mananger.onrender.com/api/notices/all')
      .then(res => res.json())
      .then(data => setNotices(data));
  }, []);

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('https://igit-mess-mananger.onrender.com/api/reports/submit', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(report)
      });
      if (res.ok) {
        alert("Report Submitted!");
        setReport({ type: 'Plumbing', message: '' });
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to submit report'}`);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      
      {/* SECTION 1: Notice Board */}
      <div className="bg-white p-6 rounded-xl shadow h-96 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-blue-600 flex items-center">
          📢 Notice Board
        </h2>
        {notices.length === 0 ? <p className="text-gray-500">No notices yet.</p> : (
          <div className="space-y-4">
            {notices.map((notice) => (
              <div key={notice._id} className="border-b pb-3">
                <h3 className="font-semibold text-lg">{notice.title}</h3>
                <p className="text-gray-600 text-sm mt-1">{notice.content}</p>
                <span className="text-xs text-gray-400">
                  {new Date(notice.datePosted).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: Report a Problem */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4 text-red-600 flex items-center">
          🛠 Report a Problem
        </h2>
        <form onSubmit={handleReportSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Issue Type</label>
            <select 
              className="w-full border p-2 rounded bg-gray-50"
              value={report.type}
              onChange={(e) => setReport({ ...report, type: e.target.value })}
            >
              <option value="Plumbing">Plumbing</option>
              <option value="Electrical">Electrical</option>
              <option value="Cleaning">Cleaning</option>
              <option value="Furniture">Furniture</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              rows="4" 
              className="w-full border p-2 rounded bg-gray-50"
              placeholder="Describe the issue in detail..."
              value={report.message}
              onChange={(e) => setReport({ ...report, message: e.target.value })}
              required
            ></textarea>
          </div>

          <button className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentDashboard;