import { useState } from "react";

const emptyStudent = {
  name: "", rollNo: "", department: "Computer Science", course: "", year: "", email: "", gpa: "", attendance: "",
};

function StudentForm({ onAdd }) {
  const [form, setForm] = useState(emptyStudent);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.rollNo.trim()) {
      alert("Name and Roll No are required!");
      return;
    }
    onAdd({
      ...form,
      gpa: Number(form.gpa) || 0,
      attendance: Number(form.attendance) || 0,
    });
    setForm(emptyStudent);
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button className="btn btn-primary add-btn" onClick={() => setIsOpen(true)}>
        + Add New Student
      </button>
    );
  }

  return (
    <div className="form-container">
      <div className="form-header">
        <h3>Add New Student</h3>
        <button className="close-btn" onClick={() => setIsOpen(false)}>✕</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label>Name *</label>
            <input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Roll No *</label>
            <input name="rollNo" value={form.rollNo} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Department</label>
            <select name="department" value={form.department} onChange={handleChange}>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <div className="input-group">
            <label>Course</label>
            <input name="course" value={form.course} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Year</label>
            <input name="year" value={form.year} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>GPA</label>
            <input name="gpa" type="number" step="0.1" value={form.gpa} onChange={handleChange} />
          </div>
          <div className="input-group">
            <label>Attendance (%)</label>
            <input name="attendance" type="number" value={form.attendance} onChange={handleChange} />
          </div>
        </div>
        <button className="btn btn-primary" type="submit">Save Student</button>
      </form>
    </div>
  );
}

export default StudentForm;