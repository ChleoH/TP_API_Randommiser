import jwt from 'jsonwebtoken';
import UserModel from '../models/user.mjs';
import validator from 'better-validator'; 

export default class Auth {
  constructor(app) {
    this.app = app;
    this.run();
  }

  signup() {
    this.app.post('/signup', async (req, res) => {
      const validate = validator(req.body);

      validate.isObject((item) => {
        item('name').isString().minLength(3).required();
        item('password').isString().minLength(6).required();
        item('role').optional().isString();
        item().strict(); 
      });

      if (!validate.isValid()) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: validate.getErrors()
        });
      }

      const { name, password, role } = req.body;

      try {
        const exists = await UserModel.findOne({ name });
        if (exists) {
          return res.status(409).json({ message: 'User already exists' });
        }

        const newUser = new UserModel({ name, password, role });
        await newUser.save();

        res.status(201).json({ message: 'User created successfully' });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  login() {
    this.app.post('/login', async (req, res) => {
      const validate = validator(req.body);

      validate.isObject((item) => {
        item('name').isString().required();
        item('password').isString().required();
        item().strict();
      });

      if (!validate.isValid()) {
        return res.status(400).json({
          message: 'Invalid input',
          errors: validate.getErrors()
        });
      }

      const { name, password } = req.body;

      try {
        const user = await UserModel.findOne({ name });

        if (!user || user.password !== password) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { id: user._id, name: user.name, role: user.role },
          process.env.JWT_SECRET || 'efrei',
          { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
        );

        res.status(200).json({ token });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }

  // Middleware for protecting routes
  static verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET || 'efrei', (err, user) => {
      if (err) return res.status(403).json({ message: 'Token invalide' });
      req.user = user;
      next();
    });
  }

  run() {
    this.signup();
    this.login();
  }
}
