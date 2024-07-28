const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employee = require('../models/Employee');
const multer = require('multer');
const path = require('path');
const router = express.Router();

// Auth Middleware
function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, 'jwtSecret');
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Register
router.post('/register', async (req, res) => {
    const { userName, password, email, phoneNumber } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({ userName, password, email, phoneNumber });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = { user: { id: user.id } };

        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Login
router.post('/login', async (req, res) => {
    const { userName, password } = req.body;

    try {
        let user = await User.findOne({ userName });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const payload = { user: { id: user.id } };

        jwt.sign(payload, 'jwtSecret', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get user details
router.get('/me', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create Employee
router.post('/', upload.single('imgUpload'), async (req, res) => {
    const { name, email, mobileNo, designation, gender, course } = req.body;
    const imgUpload = req.file.path;

    try {
        let employee = await Employee.findOne({ email });
        if (employee) {
            return res.status(400).json({ msg: 'Employee already exists' });
        }

        employee = new Employee({ name, email, mobileNo, designation, gender, course, imgUpload });
        await employee.save();

        res.json(employee);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Fetch all employees
router.get('/employees', auth, async (req, res) => {
    try {
        const employees = await Employee.find();
        const employeeData = employees.map(employee => ({
            ...employee._doc,
            imgUpload: `${req.protocol}://${req.get('host')}/${employee.imgUpload.replace(/\\/g, '/')}`
        }));
        res.json(employeeData);
    } catch (err) {
        console.error('Error fetching employees:', err);
        res.status(500).send('Server Error');
    }
});

// Fetch a single employee by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        const employeeData = {
            ...employee._doc,
            imgUpload: `${req.protocol}://${req.get('host')}/${employee.imgUpload.replace(/\\/g, '/')}`
        };
        res.json(employeeData);
    } catch (err) {
        console.error('Error fetching employee:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Update Employee
router.put('/:id', auth, upload.single('imgUpload'), async (req, res) => {
    const { name, email, mobileNo, designation, gender, course } = req.body;
    const imgUpload = req.file ? req.file.path : null;

    try {
        let employee = await Employee.findById(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }

        // Update fields
        employee.name = name || employee.name;
        employee.email = email || employee.email;
        employee.mobileNo = mobileNo || employee.mobileNo;
        employee.designation = designation || employee.designation;
        employee.gender = gender || employee.gender;
        employee.course = course || employee.course;
        if (imgUpload) {
            employee.imgUpload = imgUpload;
        }

        await employee.save();

        const employeeData = {
            ...employee._doc,
            imgUpload: `${req.protocol}://${req.get('host')}/${employee.imgUpload.replace(/\\/g, '/')}`
        };

        res.json(employeeData);
    } catch (err) {
        console.error('Error updating employee:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.status(500).send('Server Error');
    }
});

// Delete Employee
router.delete('/:id', auth, async (req, res) => {
    try {
        const employee = await Employee.findByIdAndDelete(req.params.id);
        if (!employee) {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.json({ msg: 'Employee removed' });
    } catch (err) {
        console.error('Error deleting employee:', err);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Employee not found' });
        }
        res.status(500).send('Server Error');
    }
});

module.exports = router;
