const express = require('express');
const cors = require('cors');
const path = require('path');
const { spawn } = require('child_process');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Configuration variables
const config = {
  training_mode: false,
  actions_list: ['up', 'left', 'right'],
  action_mappings: {
    0: { up: true },
    1: { up: true, left: true },
    2: { up: true, right: true }
  },
  state_space: 11,
  action_space: 3,
  path_to_tfjs_actor_beginner: '/tfjs_models/actor_episodes_501',
  path_to_tfjs_critic_beginner: '/tfjs_models/critic_episodes_501',
  path_to_tfjs_actor_intermediate: '/tfjs_models/actor_episodes_921',
  path_to_tfjs_critic_intermediate: '/tfjs_models/critic_episodes_921',
  path_to_tfjs_actor_advanced: '/tfjs_models/actor_episodes_4521',
  path_to_tfjs_critic_advanced: '/tfjs_models/critic_episodes_4521'
};

// Store agent data
const agentData = {};

// Serve static files from ui/dist
app.use(express.static(path.join(__dirname, 'ui', 'dist')));

// Serve static files from ui/static
app.use(express.static(path.join(__dirname, 'ui', 'static')));

// Serve config
app.get('/common-with-flask-config.json', (req, res) => {
  res.json(config);
});

// Get action endpoint
app.post('/get_action', (req, res) => {
  const { agent_id, observation, done, win } = req.body;

  // Initialize agent data if not exists
  if (!agentData[agent_id]) {
    agentData[agent_id] = {
      lastState: null,
      lastAction: null,
      paused: false
    };
  }

  // Handle game completion
  if (done) {
    agentData[agent_id].lastState = null;
    agentData[agent_id].lastAction = null;
    agentData[agent_id].paused = true;
    return res.json({ action: {}, pause: true });
  }

  // Get action from model
  const actionIndex = Math.floor(Math.random() * 3); // Placeholder for model inference
  const action = config.action_mappings[actionIndex];

  res.json({ action, pause: false });
});

// Check unpause endpoint
app.get('/check_unpause', (req, res) => {
  const { agent_id } = req.query;

  const allAgentsPaused = Object.values(agentData).every(data => data.paused);
  
  if (allAgentsPaused) {
    Object.values(agentData).forEach(data => {
      data.paused = false;
    });
    return res.json({ unpause: true });
  }

  if (agentData[agent_id] && !agentData[agent_id].paused) {
    return res.json({ unpause: true });
  }

  res.json({ unpause: false });
});

// Catch-all route to serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui', 'dist', 'index.html'));
});

// Start UI development server
function startUiServer() {
  return spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, 'ui'),
    shell: true
  });
}

// Handle production build
function createProductionBuild() {
  return spawn('npm', ['run', 'build'], {
    cwd: path.join(__dirname, 'ui'),
    shell: true
  });
}

// Start the server
if (process.argv.includes('--build')) {
  createProductionBuild()
    .on('close', (code) => {
      console.log(`Build completed with code ${code}`);
      process.exit(code);
    });
} else {
  const uiProcess = startUiServer();
  
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    uiProcess.kill();
    process.exit(0);
  });
}