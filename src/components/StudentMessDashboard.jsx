import React, { useState, useEffect } from 'react';

const StudentMessDashboard = ({ studentId }) => {
  const [bill, setBill] = useState({});
  const [stopData, setStopData] = useState({
    fromDate: '', toDate: '',
    mealsToStop: { breakfast: false, lunch: false, dinner: false }
  });

  useEffect(() => {
    // Fetch Bill
    fetch(`http://localhost:5000/api/meals/bill/${studentId}`)
      .then(res => res.json())
      .then(data => setBill(data));
  }, [studentId]);

  const handleStopSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/api/meals/stop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentId, ...stopData })
    });
    if(res.ok) {
      alert("Meals stopped successfully!");
      // Refresh bill
      fetch(`http://localhost:5000/api/meals/bill/${studentId}`)
        .then(res => res.json())
        .then(data => setBill(data));
    } else {
      alert("Error stopping meals");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Bill Section */}
      <div className="bg-blue-600 text-white p-6 rounded-xl shadow-lg flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">Monthly Mess Bill ({bill.month})</h2>
          <p className="opacity-80">Gross: ₹{bill.grossBill} | Deductions: -₹{bill.totalDeduction}</p>
        </div>
        <div className="text-3xl font-bold">₹{bill.netBill}</div>
      </div>

      {/* Stop Meal Form */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Stop Your Meals</h3>
        <form onSubmit={handleStopSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="date" className="border p-2 rounded" onChange={e => setStopData({...stopData, fromDate: e.target.value})} required />
          <input type="date" className="border p-2 rounded" onChange={e => setStopData({...stopData, toDate: e.target.value})} required />
          <div className="flex gap-4 col-span-2">
            {['breakfast', 'lunch', 'dinner'].map(meal => (
              <label key={meal} className="capitalize flex items-center gap-2">
                <input type="checkbox" onChange={e => setStopData({
                  ...stopData, 
                  mealsToStop: { ...stopData.mealsToStop, [meal]: e.target.checked }
                })} /> {meal}
              </label>
            ))}
          </div>
          <button className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 col-span-2">Submit Stop Request</button>
        </form>
      </div>
    </div>
  );
};

export default StudentMessDashboard;