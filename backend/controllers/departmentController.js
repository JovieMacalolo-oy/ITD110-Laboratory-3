const { getDriver } = require('../config/db');
const { v4: uuidv4 } = require('uuid');


const formatDepartment = (record) => {
    const node = record.get('d').properties;
 
    return {
        _id: node.id,
        deptCode: node.deptCode,
        deptName: node.deptName,
        location: node.location,
        createdAt: node.createdAt,
        updatedAt: node.updatedAt
    };
};

// Get all Departments
const getDepartments = async (req, res) => {
    const session = getDriver().session();
    try {
        const result = await session.run(
            `MATCH (d:Department)
             RETURN d
             ORDER BY d.createdAt DESC`
        );
        const departments = result.records.map(formatDepartment);
        res.json(departments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await session.close();
    }
};

// Create Department
const createDepartment = async (req, res) => {
    const session = getDriver().session();
    try {
        const { deptCode, deptName, location } = req.body;
        const id = uuidv4();
        const now = new Date().toISOString();

        const result = await session.run(
            `CREATE (d:Department {
                id: $id,
                deptCode: $deptCode,
                deptName: $deptName,
                location: $location,
                createdAt: $now,
                updatedAt: $now
            }) RETURN d`,
            { id, deptCode, deptName, location: location || '', now }
        );
        res.status(201).json(formatDepartment(result.records[0]));
    } catch (error) {
        res.status(400).json({ message: error.message });
    } finally {
        await session.close();
    }
};

// Update Department
const updateDepartment = async (req, res) => {
    const session = getDriver().session();
    try {
        const { deptCode, deptName, location } = req.body;
        const now = new Date().toISOString();

        const result = await session.run(
            `MATCH (d:Department {id: $id})
             SET d.deptCode = $deptCode,
                 d.deptName = $deptName,
                 d.location = $location,
                 d.updatedAt = $now
             RETURN d`,
            { id: req.params.id, deptCode, deptName, location, now }
        );
        if (result.records.length === 0) return res.status(404).json({ message: 'Dept not found' });
        res.json(formatDepartment(result.records[0]));
    } finally {
        await session.close();
    }
};

// Delete Department
const deleteDepartment = async (req, res) => {
    const session = getDriver().session();
    try {
        const result = await session.run(
            'MATCH (d:Department {id: $id}) DETACH DELETE d RETURN count(d) AS deleted',
            { id: req.params.id }
        );
        res.json({ message: 'Department deleted' });
    } finally {
        await session.close();
    }
};

module.exports = { getDepartments, createDepartment, updateDepartment, deleteDepartment };