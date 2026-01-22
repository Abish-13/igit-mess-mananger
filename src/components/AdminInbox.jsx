import React, { useState, useEffect } from 'react';

const AdminInbox = () => {
  const [reports, setReports] = useState([]);
  const [notice, setNotice] = useState({ title: '', content: '' });

  // Fetch Reports
  const fetchReports = async () => {
    try {
      const res = await fetch('https://igit-mess-mananger.onrender.com/api/reports/all', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        const data = await res.json();
        console.log('Reports fetched:', data);
        setReports(data);
      } else {
        const errorData = await res.json();
        console.error('Failed to fetch reports:', errorData);
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    }
  };

  useEffect(() => { fetchReports(); }, []);

  // Mark as Resolved
  const resolveIssue = async (id) => {
    try {
      const res = await fetch(`https://igit-mess-mananger.onrender.com/api/reports/resolve/${id}`, { 
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (res.ok) {
        fetchReports(); // Refresh list
      } else {
        console.error('Failed to resolve report');
      }
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  // Post Notice
  const handlePostNotice = async (e) => {
    e.preventDefault();
    await fetch('https://igit-mess-mananger.onrender.com/api/notices/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(notice)
    });
    alert("Notice Posted Successfully");
    setNotice({ title: '', content: '' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      
      {/* SECTION 1: Create Notice */}
      <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">📢 Create Announcement</h2>
        <form onSubmit={handlePostNotice} className="flex flex-col gap-4">
          <input 
            type="text" placeholder="Notice Title" 
            className="p-2 rounded text-black"
            value={notice.title} onChange={e => setNotice({...notice, title: e.target.value})} 
            required 
          />
          <textarea 
            placeholder="Notice Content" rows="2" 
            className="p-2 rounded text-black"
            value={notice.content} onChange={e => setNotice({...notice, content: e.target.value})} 
            required 
          ></textarea>
          <button className="bg-white text-indigo-600 font-bold py-2 rounded hover:bg-gray-100">
            Post Notice
          </button>
        </form>
      </div>

      {/* SECTION 2: Maintenance Inbox */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Maintenance Inbox</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((item) => (
            <div key={item._id} className={`p-4 rounded-lg shadow border-l-4 ${item.status === 'Resolved' ? 'border-green-500 bg-gray-100' : 'border-red-500 bg-white'}`}>
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-gray-700">{item.type}</span>
                <span className={`text-xs px-2 py-1 rounded ${item.status === 'Resolved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                  {item.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{item.message}</p>
              
              <div className="text-xs text-gray-400 mb-4">
                Reported by: <span className="font-medium text-gray-600">{item.studentId?.name || 'Unknown'}</span> <br/>
                Room: <span className="font-medium text-gray-600">{item.roomNumber}</span>
              </div>

              {item.status === 'Pending' && (
                <button 
                  onClick={() => resolveIssue(item._id)}
                  className="w-full py-1 text-sm border border-green-600 text-green-600 rounded hover:bg-green-50"
                >
                  Mark as Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AdminInbox;