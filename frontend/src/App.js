// src/App.js
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import AddAgents from './components/AddAgents';
import AgentTasks from './components/AgentTasks';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-agent" element={<AddAgents />} />
        <Route path="/agent-tasks/:agentId" element={<AgentTasks />} />
      </Routes>
    </Router>
  );
}

export default App;