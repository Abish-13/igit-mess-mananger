import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    userId: '',
    password: '',
    hostelName: '',
    totalRooms: '',
    bedPerRoom: '',
    breakfastPrice: '',
    lunchPrice: '',
    dinnerPrice: '',
    usualBreakfastPlates: '',
    usualLunchPlates: '',
    usualDinnerPlates: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, userId, password, hostelName, totalRooms, bedPerRoom, breakfastPrice, lunchPrice, dinnerPrice, usualBreakfastPlates, usualLunchPlates, usualDinnerPlates } = formData;

    const response = await fetch('https://igit-mess-mananger.onrender.com/api/auth/register-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        userId,
        password,
        hostelName,
        totalRooms: parseInt(totalRooms),
        bedPerRoom: parseInt(bedPerRoom),
        messPrices: {
          breakfast: parseFloat(breakfastPrice),
          lunch: parseFloat(lunchPrice),
          dinner: parseFloat(dinnerPrice)
        },
        usualPlatesCount: {
          breakfast: parseInt(usualBreakfastPlates),
          lunch: parseInt(usualLunchPlates),
          dinner: parseInt(usualDinnerPlates)
        }
      })
    });
    const result = await response.json();
    alert(result.message);
    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(result));
      localStorage.setItem('token', result.token);
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Admin Registration & Hostel Creation</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Admin Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Admin User ID</label>
            <input
              type="text"
              name="userId"
              value={formData.userId}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
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
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hostel Name</label>
            <input
              type="text"
              name="hostelName"
              value={formData.hostelName}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Total Rooms</label>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Beds Per Room</label>
              <input
                type="number"
                name="bedPerRoom"
                value={formData.bedPerRoom}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Breakfast Price</label>
              <input
                type="number"
                step="0.01"
                name="breakfastPrice"
                value={formData.breakfastPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Lunch Price</label>
              <input
                type="number"
                step="0.01"
                name="lunchPrice"
                value={formData.lunchPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Dinner Price</label>
              <input
                type="number"
                step="0.01"
                name="dinnerPrice"
                value={formData.dinnerPrice}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">Usual BF Plates</label>
              <input
                type="number"
                name="usualBreakfastPlates"
                value={formData.usualBreakfastPlates}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Usual Lunch Plates</label>
              <input
                type="number"
                name="usualLunchPlates"
                value={formData.usualLunchPlates}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">Usual Dinner Plates</label>
              <input
                type="number"
                name="usualDinnerPlates"
                value={formData.usualDinnerPlates}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
          >
            Create Hostel & Register Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;