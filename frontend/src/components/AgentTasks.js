// src/components/AgentTasks.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AgentTasks = () => {
  const { agentId } = useParams();
  const [tasks, setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`http://localhost:5003/api/agent-tasks/${agentId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch tasks.");
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (agentId) {
      fetchTasks();
    }
  }, [agentId]);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-center">Assigned Tasks</h2>
      {loading && <p className="text-gray-500 text-center">Loading tasks...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}
      {!loading && !error && tasks.length === 0 && (
        <p className="text-gray-600 text-center">No tasks assigned.</p>
      )}
      {!loading && !error && tasks.length > 0 && (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task._id} className="border p-4 rounded shadow-sm">
              <p><span className="font-semibold">Name:</span> {task.firstName}</p>
              <p><span className="font-semibold">Phone:</span> {task.phone}</p>
              <p><span className="font-semibold">Notes:</span> {task.notes}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AgentTasks;