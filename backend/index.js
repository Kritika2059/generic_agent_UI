const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Signup
app.post('/signup', async (req, res) => {
    console.log('=== SIGNUP ROUTE HIT ===');
    console.log('Request body:', req.body);
    const { name, email, password } = req.body;
    console.log('Signup received:', { name, email, password }); 
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === 'chadgigaa404@gmail.com' ? 'admin' : 'user';
        const result = await pool.query(
            'INSERT INTO users_auth (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, hashedPassword, role]
        );
        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            res.status(400).json({ success: false, error: 'Email already in use' });
        } else {
            res.status(500).json({ success: false, error: 'Server error' });
        }
    }
});

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users_auth WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ success: false, error: 'Invalid email or password' });
    }

    // Optionally generate JWT token
    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Add this updated platform setup route to your index.js file
app.post('/setup-platforms', async (req, res) => {
  console.log('Platform setup received:', req.body);
  const { userId, platformData } = req.body;
  
  try {
    // Validate userId
    if (!userId) {
      return res.status(400).json({ success: false, error: 'User ID is required' });
    }

    // Check if user exists
    const userCheck = await pool.query('SELECT id FROM users_auth WHERE id = $1', [userId]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    // Build dynamic update query
    const platformColumns = ['whatsapp', 'linkedin_post', 'discord', 'slack', 'facebook', 'instagram', 'twitter', 'pdf'];
    const updateParts = [];
    const values = [userId];
    let paramCount = 2;

    // Add each platform to the update query
    platformColumns.forEach(platform => {
      if (platformData && platformData.hasOwnProperty(platform)) {
        updateParts.push(`${platform} = $${paramCount}`);
        values.push(platformData[platform] || null);
        paramCount++;
      }
    });

    // Add timestamp
    updateParts.push(`platforms_setup_at = CURRENT_TIMESTAMP`);

    if (updateParts.length === 1) { // Only timestamp was added
      return res.status(400).json({ success: false, error: 'No platform data provided' });
    }

    const updateQuery = `
      UPDATE users_auth 
      SET ${updateParts.join(', ')} 
      WHERE id = $1 
      RETURNING id, name, email, role, ${platformColumns.join(', ')}, platforms_setup_at
    `;

    console.log('Update query:', updateQuery);
    console.log('Values:', values);

    const result = await pool.query(updateQuery, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Platform setup completed successfully',
      user: result.rows[0]
    });

  } catch (err) {
    console.error('Platform setup error:', err);
    res.status(500).json({ success: false, error: 'Server error during platform setup' });
  }
});

// Also add this route to get user platforms
app.get('/user-platforms/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const result = await pool.query(
      'SELECT whatsapp, linkedin_post, discord, slack, facebook, instagram, twitter, pdf, platforms_setup_at FROM users_auth WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const platforms = result.rows[0];
    // Filter out null values
    const activePlatforms = {};
    Object.keys(platforms).forEach(key => {
      if (platforms[key] && key !== 'platforms_setup_at') {
        activePlatforms[key] = platforms[key];
      }
    });

    res.json({
      success: true,
      platforms: activePlatforms,
      setupAt: platforms.platforms_setup_at
    });

  } catch (err) {
    console.error('Get platforms error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
