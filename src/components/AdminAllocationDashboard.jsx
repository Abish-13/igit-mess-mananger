import React, { useState, useEffect } from 'react';

const AdminAllocationDashboard = ({ hostelId }) => {
  const [config, setConfig] = useState({ totalRooms: '', bedPerRoom: '' });
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, [hostelId]);

  const fetchStudents = () => {
    fetch(`https://igit-mess-mananger.onrender.com/api/auth/students/${hostelId}`)
      .then(res => res.json())
      .then(data => setStudents(data));
  };

  const triggerAction = async (endpoint, body = {}) => {
    const res = await fetch(`https://igit-mess-mananger.onrender.com/api/rooms/${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hostelId, ...body })
    });
    const data = await res.json();
    alert(data.message);
  };

  const deleteStudent = async (id) => {
    if (window.confirm("Delete this student?")) {
      await fetch(`https://igit-mess-mananger.onrender.com/api/auth/user/${id}`, { method: 'DELETE' });
      fetchStudents();
    }
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold">Room Allocation Control Center</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Setup Capacity */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">1. Configure Capacity</h3>
          <div className="flex gap-4 mb-4">
            <input type="number" placeholder="Total Rooms" className="border p-2 rounded w-1/2" 
              onChange={e => setConfig({...config, totalRooms: e.target.value})} />
            <input type="number" placeholder="Beds Per Room" className="border p-2 rounded w-1/2" 
              onChange={e => setConfig({...config, bedPerRoom: e.target.value})} />
          </div>
          <button onClick={() => triggerAction('generate', config)} 
            className="w-full bg-green-600 text-white py-2 rounded font-semibold">Update Capacity</button>
        </div>

        {/* Allocation Logic */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">2. Execution</h3>
          <div className="space-y-4">
            <button onClick={() => {if(window.confirm("Reset all rooms?")) triggerAction('reset')}} 
              className="w-full border border-red-600 text-red-600 py-2 rounded hover:bg-red-50">
              Reset Current Session
            </button>
            <button onClick={() => triggerAction('allocate')} 
              className="w-full bg-indigo-600 text-white py-2 rounded font-bold text-lg shadow-lg">
              RUN ALLOCATION ENGINE
            </button>
          </div>
        </div>
      </div>

      {/* Student Management */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="font-bold mb-4">Student Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">User ID</th>
                <th className="p-2 text-left">Room</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id} className="border-b">
                  <td className="p-2">{student.name}</td>
                  <td className="p-2">{student.userId}</td>
                  <td className="p-2">{student.roomNumber || 'Not Allocated'}</td>
                  <td className="p-2">
                    <button onClick={() => deleteStudent(student._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminAllocationDashboard;