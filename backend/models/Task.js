const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  phone: { type: String, required: true },
  notes: { type: String },
  agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
});

module.exports = mongoose.model('Task', TaskSchema);