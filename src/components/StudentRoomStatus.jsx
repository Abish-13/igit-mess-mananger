import React, { useState, useEffect } from 'react';

const StudentRoomStatus = ({ user }) => {
  const [cgpa, setCgpa] = useState('');
  const [status, setStatus] = useState(0);

  useEffect(() => {
    // Fetch current room status
    fetch(`http://localhost:5000/api/auth/user/${user._id}`)
      .then(res => res.json())
      .then(data => setStatus(data.roomNumber));
  }, [user._id]);

  const handleApply = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/applications/apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId: user._id, cgpa: parseFloat(cgpa) })
    });
    if (res.ok) alert("Application submitted successfully!");
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Room Allocation</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
        <p className="text-sm text-gray-500 uppercase font-semibold">Your Room Status</p>
        <h1 className="text-3xl font-bold text-blue-600">
          {status === 0 || !status ? "Not Allocated" : `Room ${status}`}
        </h1>
      </div>

      {(status === 0 || !status) && (
        <form onSubmit={handleApply} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Confirm CGPA</label>
            <input 
              type="number" step="0.01" 
              className="w-full border p-2 rounded" 
              value={cgpa} onChange={(e) => setCgpa(e.target.value)} 
              required 
            />
          </div>
          <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
            Apply for Allocation
          </button>
        </form>
      )}
    </div>
  );
};

export default StudentRoomStatus;