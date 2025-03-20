import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [distributions, setDistributions] = useState([]);
  const [message, setMessage] = useState('');

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setMessage('Uploading and processing...');
      const res = await axios.post('http://localhost:5000/api/upload', formData);
      setMessage(res.data.message);
      setDistributions(res.data.distributions);
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Error uploading file');
    }
  };

  // Optionally fetch distributions from the backend
  const fetchDistributions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/distributions');
      setDistributions(res.data.distributions);
    } catch (error) {
      console.error(error);
      setMessage('Error fetching distributions');
    }
  };

  return (
    <div>
      <h2>Upload CSV and Distribute Lists</h2>
      <input type="file" accept=".csv, .xlsx, .axls" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <p>{message}</p>

      {distributions.length > 0 && (
        <div>
          <h3>Distributions:</h3>
          {distributions.map((dist) => (
            <div key={dist._id} style={{ border: '1px solid #ccc', marginBottom: '1rem', padding: '1rem' }}>
              <h4>Agent {dist.agentId}</h4>
              <ul>
                {dist.items.map((item, index) => (
                  <li key={index}>
                    {item.firstName} - {item.phone} - {item.notes}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;