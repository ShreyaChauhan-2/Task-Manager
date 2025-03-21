// src/components/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AgentTasks from "./AgentTasks";

const Dashboard = () => {
  const [message, setMessage]   = useState("Loading...");
  const [agentId, setAgentId]   = useState(null);
  const navigate              = useNavigate();
  const userEmail             = localStorage.getItem("userEmail");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedAgentId = localStorage.getItem("agentId");

    if (!token) {
      navigate("/"); // Redirect to login if no token
      return;
    }

    if (storedAgentId) {
      setAgentId(storedAgentId);
    }

    fetch("http://localhost:5003/api/dashboard", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setMessage(data.message || "Welcome!"))
      .catch(() => {
        setMessage("Error loading dashboard.");
        localStorage.removeItem("token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("agentId");
        navigate("/");
      });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-beige flex flex-col items-center p-6">
      {/* Welcome message at the top with margin from top */}
      <div className="text-center mb-8 mt-20">
        <h1 className="text-5xl font-bold text-black-600">Welcome to the Dashboard</h1>
        {userEmail && (
          <p className="text-2xl text-green-700 mt-8 font-bold mb-10">
            Logged in as: <span className="font-semibold">{userEmail}</span>
          </p>
        )}
      </div>
  
      {/* Inner Box with Dashboard Content */}
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8 text-center">
        <div className="space-y-4">
          <button
            onClick={() => navigate("/add-agent")}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-900 transition"
          >
            Add Agent & Upload CSV
          </button>
          {/* Uncomment below if you implement a "View Agents" page */}
          {/* <button
            onClick={() => navigate("/view-agents")}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
          >
            View Agents
          </button> */}
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userEmail");
              localStorage.removeItem("agentId");
              navigate("/");
            }}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-800 transition"
          >
            Logout
          </button>
        </div>
      </div>
  
      {/* For agent users, display assigned tasks */}
      {agentId && (
        <div className="max-w-xl mx-auto mt-8">
          <AgentTasks agentId={agentId} />
        </div>
      )}
    </div>
  );
  
  
};  

export default Dashboard;