import express from 'express';

const router = express.Router();

// Simple logout flag
let lastLogoutSignal = { source: null, timestamp: 0 };

// POST endpoint to signal logout
router.post('/logout-signal', (req, res) => {
  const { source } = req.body;
  lastLogoutSignal = { source, timestamp: Date.now() };
  
  console.log(`✅ Logout signal received from ${source} at ${new Date().toISOString()}`);
  res.json({ success: true, timestamp: lastLogoutSignal.timestamp });
});

// GET endpoint to check for logout signals
router.get('/logout-signal', (req, res) => {
  const { after } = req.query;
  const afterTime = parseInt(after) || 0;
  
  const hasNewLogout = lastLogoutSignal.timestamp > afterTime;
  
  console.log(`📡 Polling from PC - After: ${afterTime}, Last: ${lastLogoutSignal.timestamp}, HasNew: ${hasNewLogout}`);
  
  res.json({ 
    logout: hasNewLogout,
    source: hasNewLogout ? lastLogoutSignal.source : null,
    timestamp: lastLogoutSignal.timestamp
  });
});

export default router;