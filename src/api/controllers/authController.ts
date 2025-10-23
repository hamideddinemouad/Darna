import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';

export default class AuthController {
  
  public async register(req: Request, res: Response): Promise<void> {
    const { email, password, role, firstName, lastName, phone } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }

    const user = await User.create({
      email,
      password,
      role: role || 'Particulier',
      firstName,
      lastName,
      phone
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  }

  public async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  }
}