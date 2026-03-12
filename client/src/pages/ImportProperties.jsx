import React, { useState } from 'react';
import api from '../api/axios';

const ImportProperties = () => {
  const [jsonData, setJsonData] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImport = async () => {
    setLoading(true);
    setError('');
    setResults(null);

    try {
      let properties;
      
      try {
        properties = JSON.parse(jsonData);
        if (!Array.isArray(properties)) {
          properties = [properties];
        }
      } catch (e) {
        setError('Invalid JSON format. Please check your JSON data.');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const response = await api.post('/properties/bulk-import', { properties }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResults(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const sampleData = [
    {
      title: "Sugar Shack | Private | Kayaks | Bikes | MP7.5",
      name: "Sugar Shack",
      address: "Kill Devil Hills, NC 27948",
      type: "Private guest suite",
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      guestCapacity: 2,
      checkInTime: "4:00 PM",
      checkOutTime: "10:00 AM",
      petsAllowed: true,
      maxPets: 2,
      petFee: 10,
      wifiName: "ABNB 5G",
      wifiPassword: "5StarStay",
      entryMethod: "Key under shell / Lockbox",
      parkingInstructions: "1 vehicle - grass area by green electrical box",
      houseRules: "No smoking, no towels to beach, quiet hours 11pm-7am",
      airbnbUrl: "https://www.airbnb.com/rooms/4937374",
      amenities: ["Air Conditioning", "Kitchen", "Parking", "TV", "Kayaks", "Bikes", "Beach Access"],
      pricePerNight: 149
    }
  ];

  const loadSample = () => {
    setJsonData(JSON.stringify(sampleData, null, 2));
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Import Properties</h1>
        <p className="text-gray-600">
          Import properties from JSON data (e.g., from Airbnb listings or CSV conversions)
        </p>
      </div>

      <div className="mb-4">
        <button
          onClick={loadSample}
          className="text-blue-600 hover:underline mr-4"
        >
          Load Sample Data
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Property Data (JSON array or single object)
        </label>
        <textarea
          value={jsonData}
          onChange={(e) => setJsonData(e.target.value)}
          className="w-full h-64 p-3 border rounded-md font-mono text-sm"
          placeholder='[{"title": "Property Name", "address": "123 Main St", "bedrooms": 2, ...}]'
        />
      </div>

      <button
        onClick={handleImport}
        disabled={loading || !jsonData}
        className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Importing...' : 'Import Properties'}
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {results && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-semibold mb-2">Import Results:</h3>
          <p className="text-green-700">Created: {results.created?.length || 0} properties</p>
          <p className="text-green-700">Updated: {results.updated?.length || 0} properties</p>
          {results.errors?.length > 0 && (
            <div className="mt-2">
              <p className="text-red-600 font-semibold">Errors:</p>
              {results.errors.map((err, i) => (
                <p key={i} className="text-red-600 text-sm">{err.property}: {err.error}</p>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-50 rounded-md">
        <h3 className="font-semibold mb-2">Supported Fields:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          <div>• title / name</div>
          <div>• address / location</div>
          <div>• unit</div>
          <div>• type</div>
          <div>• bedrooms</div>
          <div>• bathrooms</div>
          <div>• beds</div>
          <div>• guestCapacity</div>
          <div>• checkInTime</div>
          <div>• checkOutTime</div>
          <div>• petsAllowed</div>
          <div>• maxPets</div>
          <div>• petFee</div>
          <div>• wifiName</div>
          <div>• wifiPassword</div>
          <div>• entryMethod</div>
          <div>• lockboxLocation</div>
          <div>• lockboxCode</div>
          <div>• parkingInstructions</div>
          <div>• maxVehicles</div>
          <div>• houseRules</div>
          <div>• description</div>
          <div>• amenities (array)</div>
          <div>• images (array)</div>
          <div>• airbnbUrl</div>
          <div>• vrboUrl</div>
          <div>• pricePerNight</div>
        </div>
      </div>
    </div>
  );
};

export default ImportProperties;
