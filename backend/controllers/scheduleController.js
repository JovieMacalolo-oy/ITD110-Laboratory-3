const { getDriver } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// Helper to format Schedule node with its Course
const formatSchedule = (record) => {
    const node = record.get('sch').properties;
    const course = record.has('course') ? record.get('course').properties : null;
    
    return {
        _id: node.id,
        day: node.day,
        course: course ? {
            _id: course.id,
            courseCode: course.courseCode,
            courseName: course.courseName
        } : null,
        createdAt: node.createdAt
    };
};

// Get all schedules
const getSchedules = async (req, res) => {
    const session = getDriver().session();
    try {
        const result = await session.run(
            `MATCH (sch:Schedule)
             OPTIONAL MATCH (c:Course)-[:HAS_SCHEDULE]->(sch)
             RETURN sch, c AS course
             ORDER BY sch.day ASC`
        );
        const schedules = result.records.map(formatSchedule);
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    } finally {
        await session.close();
    }
};

// Create schedule and link to course
const createSchedule = async (req, res) => {
    const session = getDriver().session();
    try {
        const { courseId, day } = req.body;
        const id = uuidv4();
        const now = new Date().toISOString();

        // Create Schedule and link to Course in one transaction
        const result = await session.run(
            `MATCH (c:Course {id: $courseId})
             CREATE (sch:Schedule {
                id: $id,
                day: $day,
                createdAt: $now
             })
             MERGE (c)-[:HAS_SCHEDULE]->(sch)
             RETURN sch, c AS course`,
            { courseId, day, id, now }
        );

        if (result.records.length === 0) {
            return res.status(404).json({ message: "Course not found" });
        }

        res.status(201).json(formatSchedule(result.records[0]));
    } catch (error) {
        res.status(400).json({ message: error.message });
    } finally {
        await session.close();
    }
};

// Delete schedule
const deleteSchedule = async (req, res) => {
    const session = getDriver().session();
    try {
        await session.run(
            'MATCH (sch:Schedule {id: $id}) DETACH DELETE sch',
            { id: req.params.id }
        );
        res.json({ message: 'Schedule removed successfully' });
    } finally {
        await session.close();
    }
};

module.exports = { getSchedules, createSchedule, deleteSchedule };