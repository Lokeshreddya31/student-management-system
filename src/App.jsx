
import { useState } from "react";
import "./App.css";

function App() {
  const [students, setStudents] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("students")) || [];
    } catch {
      return [];
    }
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  function saveStudents(data) {
    setStudents(data);
    localStorage.setItem("students", JSON.stringify(data));
  }

  function clearForm() {
    setName("");
    setEmail("");
    setDepartment("");
    setYear("");
    setEditId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !department.trim() || !year) {
      alert("Please fill all fields!");
      return;
    }

    if (editId !== null) {
      const updated = students.map((student) =>
        student.id === editId
          ? { ...student, name, email, department, year }
          : student
      );

      saveStudents(updated);
      alert("Student updated successfully!");
    } else {
      const newStudent = {
        id: crypto.randomUUID(),
        name,
        email,
        department,
        year,
      };

      saveStudents([...students, newStudent]);
      alert("Student added successfully!");
    }

    clearForm();
  }

  function editStudent(student) {
    setName(student.name);
    setEmail(student.email);
    setDepartment(student.department);
    setYear(student.year);
    setEditId(student.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteStudent(id) {
    if (window.confirm("Are you sure you want to delete this student?")) {
      saveStudents(students.filter((student) => student.id !== id));

      if (editId === id) {
        clearForm();
      }
    }
  }

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <header className="header">
        <h1>Student Management System</h1>
        <p>Manage student records easily and efficiently</p>
      </header>

      <main className="container">
        <div className="dashboard">
          <div className="stat-card">
            <h3>Total Students</h3>
            <h2>{students.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Departments</h3>
            <h2>
              {new Set(students.map((s) => s.department)).size}
            </h2>
          </div>

          <div className="stat-card">
            <h3>Search Results</h3>
            <h2>{filteredStudents.length}</h2>
          </div>
        </div>

        <section className="card">
          <h2>{editId !== null ? "Edit Student" : "Add New Student"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <input
                type="text"
                placeholder="Department (e.g. CSE)"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                required
              />

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editId !== null ? "Update Student" : "Add Student"}
              </button>

              {editId !== null && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="table-header">
            <h2>Student Records</h2>

            <input
              type="text"
              className="search-input"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Year</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student, index) => (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.department}</td>
                      <td>{student.year}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="edit-btn"
                            onClick={() => editStudent(student)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-btn"
                            onClick={() => deleteStudent(student.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-message">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer>
        Student Management System | React.js Project
      </footer>
    </div>
  );
}

export default App;
