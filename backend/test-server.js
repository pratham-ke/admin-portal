const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Backend test server is running!');
});

app.listen(PORT, () => {
  console.log(`Test server listening on port ${PORT}`);
}); 