import React, { useState, useEffect } from 'react';

const StudentSignup = () => {
  const [hostels, setHostels] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    userId: '', // This serves as the User ID / Roll No
    password: '',
    hostelId: '',
    roomNumber: ''
  });

  // Fetch Hostels for Dropdown on Component Mount
  useEffect(() => {
    const fetchHostels = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/hostels');
        const data = await res.json();
        setHostels(data);
      } catch (err) {
        console.error("Failed to load hostels", err);
      }
    };
    fetchHostels();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Numerical Validation for Room Number
    if (name === 'roomNumber') {
      // Regex to allow only numbers
      if (!/^\d*$/.test(value)) return; 
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // API Call logic here (using fetch or axios)
    console.log("Submitting:", formData);
    
    const response = await fetch('http://localhost:5000/api/auth/register-student', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    });
    const result = await response.json();
    alert(result.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Student Registration</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* User ID */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">User ID / Roll No</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Hostel Dropdown */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Select Hostel</label>
            <select
              name="hostelId"
              value={formData.hostelId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              required
            >
              <option value="">-- Choose a Hostel --</option>
              {hostels.map((hostel) => (
                <option key={hostel._id} value={hostel._id}>
                  {hostel.hostelName}
                </option>
              ))}
            </select>
          </div>

          {/* Room Number - Numerical Only */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Room Number</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              placeholder="e.g. 101"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Numeric values only.</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentSignup;