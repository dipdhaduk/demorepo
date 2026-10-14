import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Secret key used to sign and verify JWT tokens (keep this secure in environment variables in production)
const JWT_SECRET = 'your_jwt_secret_key_12345';

// Middlewares
app.use(cors());
app.use(express.json());

// In-memory array to store users for simple demonstration
const users = [];

/* ==========================================================================
   JWT AUTHENTICATION MIDDLEWARE
   ========================================================================== */
function authenticateToken(req, res, next) {
  // Extract the token from the "Authorization" header (format: "Bearer <token>")
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  /**
   * jwt.verify(token, secretOrPublicKey, [options], callback)
   * - Validates the authenticity and expiration of the token using the secret key.
   * - If the token has been tampered with or is expired, it returns an error (err).
   * - If valid, it decodes the payload stored inside the token (user data).
   */
  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token.' });
    }

    // Attach decoded user payload to request object for downstream route handlers
    req.user = decodedUser;
    next();
  });
}

/* ==========================================================================
   1. REGISTER ENDPOINT
   ========================================================================== */
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Check if user already exists
    const existingUser = users.find((u) => u.username === username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    /**
     * bcrypt.hash(data, saltRounds)
     * - 'saltRounds' (10): Determines how computationally intensive the hashing is (prevents brute-force attacks).
     * - Automatically generates a random salt and securely hashes the plain-text password.
     * - Returns the resulting hash string containing algorithm, cost, salt, and hash.
     */
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save the new user with hashed password
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
    };
    users.push(newUser);

    res.status(201).json({
      message: 'User registered successfully!',
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

/* ==========================================================================
   2. LOGIN ENDPOINT
   ========================================================================== */
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Basic input validation
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find user by username
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    /**
     * bcrypt.compare(plainPassword, hashedPassword)
     * - Compares the provided plain-text password with the stored encrypted hash.
     * - Extracts the salt from the stored hash, hashes the plain password with it, and compares.
     * - Returns true if they match, false otherwise.
     */
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid username or password.' });
    }

    /**
     * jwt.sign(payload, secretOrPrivateKey, [options])
     * - 'payload': Data you want to store in the token (e.g., user id and username).
     * - 'JWT_SECRET': Secret key used to sign the token with HMAC SHA256.
     * - 'options': Settings like expiration time ({ expiresIn: '1h' }).
     * - Returns a signed JWT string in format: header.payload.signature
     */
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error.' });
  }
});

/* ==========================================================================
   3. HOME ENDPOINT (Protected Route)
   ========================================================================== */
app.get('/home', authenticateToken, (req, res) => {
  res.status(200).json({
    message: `Welcome to the Home dashboard, ${req.user.username}!`,
    user: req.user,
  });
});

/* ==========================================================================
   START SERVER
   ========================================================================== */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
