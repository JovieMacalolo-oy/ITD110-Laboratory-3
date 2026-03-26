const API_URL = 'http://localhost:5001/api/schedules';
const COURSES_API_URL = 'http://localhost:5001/api/courses';

const form = document.getElementById('schedule-form');
const courseSelect = document.getElementById('course-select');
const daySelect = document.getElementById('day-select');
const tbody = document.getElementById('schedule-tbody');

document.addEventListener('DOMContentLoaded', async () => {
    await fetchCoursesForDropdown();
    await fetchSchedules();
});

// Load courses into the dropdown
async function fetchCoursesForDropdown() {
    try {
        const response = await fetch(COURSES_API_URL);
        const courses = await response.json();
        
        courseSelect.innerHTML = '<option value="" disabled selected>Select a Course</option>';
        courses.forEach(course => {
            const option = document.createElement('option');
            option.value = course._id; // This is the UUID
            option.textContent = `${course.courseCode} - ${course.courseName}`;
            courseSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}

async function fetchSchedules() {
    try {
        const response = await fetch(API_URL);
        const schedules = await response.json();
        renderSchedules(schedules);
    } catch (error) {
        console.error('Error fetching schedules:', error);
    }
}

function renderSchedules(schedules) {
    tbody.innerHTML = '';
    
    if (schedules.length === 0) {
        return; // Table remains empty
    }

    schedules.forEach(item => {
        const row = document.createElement('tr');
        const courseDisplay = item.course 
            ? `${item.course.courseCode} - ${item.course.courseName}` 
            : 'Unassigned';

        row.innerHTML = `
            <td>${escapeHtml(courseDisplay)}</td>
            <td><strong>${escapeHtml(item.day)}</strong></td>
            <td>
                <button class="btn-delete" onclick="deleteSchedule('${item._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const scheduleData = {
        courseId: courseSelect.value,
        day: daySelect.value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(scheduleData)
        });

        if (response.ok) {
            form.reset();
            fetchSchedules();
        }
    } catch (error) {
        console.error('Error saving schedule:', error);
    }
});

async function deleteSchedule(id) {
    if (!confirm('Are you sure you want to remove this schedule?')) return;
    
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchSchedules();
    } catch (error) {
        console.error('Error deleting schedule:', error);
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '-';
    return div.innerHTML;
}