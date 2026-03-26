const API_URL = 'http://localhost:5001/api/departments';

const form = document.getElementById('dept-form');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');


const deptDbId = document.getElementById('dept-db-id'); 
const codeInput = document.getElementById('dept-code');
const nameInput = document.getElementById('dept-name');
const locationInput = document.getElementById('dept-location');

const tbody = document.getElementById('dept-tbody');
const noDeptMsg = document.getElementById('no-dept');

let isEditing = false;

document.addEventListener('DOMContentLoaded', fetchDepartments);
form.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', resetForm);

async function fetchDepartments() {
    try {
        const response = await fetch(API_URL);
        const departments = await response.json();
        renderDepartments(departments);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderDepartments(departments) {
    tbody.innerHTML = '';
    if (departments.length === 0) {
        noDeptMsg.classList.remove('hidden');
        return;
    }
    noDeptMsg.classList.add('hidden');

    departments.forEach(dept => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${escapeHtml(dept.deptCode)}</td>
            <td>${escapeHtml(dept.deptName)}</td>
            <td>${escapeHtml(dept.location)}</td>
            <td>
                <button class="btn-edit" onclick="editDept('${dept._id}')">Edit</button>
                <button class="btn-delete" onclick="deleteDept('${dept._id}')">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

async function handleSubmit(e) {
    e.preventDefault();
    const deptData = {
        deptCode: codeInput.value.trim(),
        deptName: nameInput.value.trim(),
        location: locationInput.value.trim()
    };

    try {
        const url = isEditing ? `${API_URL}/${deptDbId.value}` : API_URL;
        const method = isEditing ? 'PUT' : 'POST';

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(deptData)
        });

        resetForm();
        fetchDepartments();
    } catch (error) {
        console.error('Error saving:', error);
    }
}

async function editDept(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const dept = await response.json();

        deptDbId.value = dept._id;
        codeInput.value = dept.deptCode;
        nameInput.value = dept.deptName;
        locationInput.value = dept.location;

        isEditing = true;
        formTitle.textContent = 'Edit Department';
        submitBtn.textContent = 'Update Department';
        cancelBtn.classList.remove('hidden');
    } catch (error) {
        console.error('Error fetching dept:', error);
    }
}

async function deleteDept(id) {
    if (!confirm('Delete this department?')) return;
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchDepartments();
}

function resetForm() {
    form.reset();
    deptDbId.value = '';
    isEditing = false;
    formTitle.textContent = 'Add New Department';
    submitBtn.textContent = 'Add Department';
    cancelBtn.classList.add('hidden');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text || '-';
    return div.innerHTML;
}