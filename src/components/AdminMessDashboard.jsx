import React, { useState, useEffect } from 'react';

const AdminMessDashboard = ({ hostelId }) => {
  const [stats, setStats] = useState({ studentsOff: [] });
  const [prices, setPrices] = useState({ breakfast: 0, lunch: 0, dinner: 0 });
  const [usualPlatesCount, setUsualPlatesCount] = useState({ breakfast: 0, lunch: 0, dinner: 0 });

  useEffect(() => {
    fetch(`http://localhost:5000/api/meals/admin-stats/${hostelId}`)
      .then(res => res.json()).then(data => {
        setStats(data);
        setPrices(data.messPrices || { breakfast: 0, lunch: 0, dinner: 0 });
        setUsualPlatesCount(data.usualPlates || { breakfast: 0, lunch: 0, dinner: 0 });
      });
  }, [hostelId]);

  const updateHostel = async () => {
    const res = await fetch(`http://localhost:5000/api/meals/update-settings/${hostelId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messPrices: prices, usualPlatesCount })
    });
    if (res.ok) alert("Mess settings updated!");
  };

  const downloadCSV = () => {
    window.open(`http://localhost:5000/api/meals/download-bills/${hostelId}`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Breakfast Plates</p>
          <h2 className="text-2xl font-bold">{stats.finalPlatesNeeded?.breakfast || 0} / {stats.usualPlates?.breakfast || 0}</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Lunch Plates</p>
          <h2 className="text-2xl font-bold">{stats.finalPlatesNeeded?.lunch || 0} / {stats.usualPlates?.lunch || 0}</h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Dinner Plates</p>
          <h2 className="text-2xl font-bold">{stats.finalPlatesNeeded?.dinner || 0} / {stats.usualPlates?.dinner || 0}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Mess Settings</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm">Usual BF Plates</label>
                <input type="number" value={usualPlatesCount.breakfast} onChange={e => setUsualPlatesCount({...usualPlatesCount, breakfast: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-sm">Usual Lunch Plates</label>
                <input type="number" value={usualPlatesCount.lunch} onChange={e => setUsualPlatesCount({...usualPlatesCount, lunch: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-sm">Usual Dinner Plates</label>
                <input type="number" value={usualPlatesCount.dinner} onChange={e => setUsualPlatesCount({...usualPlatesCount, dinner: e.target.value})} className="w-full border p-2 rounded" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-sm">BF Price</label>
                <input type="number" value={prices.breakfast} onChange={e => setPrices({...prices, breakfast: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-sm">Lunch Price</label>
                <input type="number" value={prices.lunch} onChange={e => setPrices({...prices, lunch: e.target.value})} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="text-sm">Dinner Price</label>
                <input type="number" value={prices.dinner} onChange={e => setPrices({...prices, dinner: e.target.value})} className="w-full border p-2 rounded" />
              </div>
            </div>
            <button onClick={updateHostel} className="w-full bg-blue-600 text-white py-2 rounded">Update Settings</button>
          </div>
        </div>

        {/* Stopped Meals List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Students Not Eating Today</h3>
          <div className="max-h-60 overflow-y-auto">
            {stats.studentsOff.map((s, i) => (
              <div key={i} className="flex justify-between py-2 border-b">
                <span>{s.name}</span>
                <span className="text-gray-500 font-mono text-sm">Room {s.room}</span>
              </div>
            ))}
          </div>
          <button onClick={downloadCSV} className="mt-4 w-full border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50">
            Download Monthly Bills (CSV)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminMessDashboard;