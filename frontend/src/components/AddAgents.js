// src/components/AddAgents.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddAgents = () => {
  const [agent, setAgent]         = useState({ name: '', email: '', mobileNumber: '', password: '' });
  const [message, setMessage]     = useState('');
  const [file, setFile]           = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const navigate                = useNavigate();

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('http://localhost:5003/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage('Agent added successfully!');
        setAgent({ name: '', email: '', mobileNumber: '', password: '' });
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedExtensions = ['csv', 'xlsx', 'xls'];
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        setUploadMessage('Invalid file format. Please upload a CSV, XLSX, or XLS file.');
        setFile(null);
      } else {
        setUploadMessage('');
        setFile(selectedFile);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!file) {
      setUploadMessage('Please select a valid file.');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5003/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setUploadMessage('File uploaded and tasks distributed successfully!');
      } else {
        setUploadMessage(data.error);
      }
    } catch (error) {
      setUploadMessage('An error occurred while uploading the file.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6 space-y-8">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Agent</h2>
        {message && <p className="text-center text-green-600 mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={agent.name}
            onChange={handleChange}
            placeholder="Name"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            value={agent.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="text"
            name="mobileNumber"
            value={agent.mobileNumber}
            onChange={handleChange}
            placeholder="Mobile Number with country code"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <input
            type="password"
            name="password"
            value={agent.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-3 py-2 border rounded"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
          >
            Add Agent
          </button>
        </form>
      </div>

      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload CSV & Distribute</h2>
        {uploadMessage && <p className="text-center text-red-500 mb-4">{uploadMessage}</p>}
        <input
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={handleFileUpload}
          className="w-full bg-green-500 text-white py-2 mt-4 rounded hover:bg-green-600 transition"
        >
          Upload & Distribute
        </button>
      </div>

      <div className="w-full max-w-md">
        <button
          onClick={() => navigate("/dashboard")}
          className="w-full bg-gray-700 text-white py-2 rounded hover:bg-gray-800 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AddAgents;