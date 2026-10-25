import { useState } from "react";

function StudentCard({ student, onDelete, onUpdate }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ ...student });

  const isTopper = Number(student.gpa) >= 8.5;
  const isLowAttendance = Number(student.attendance) < 75;

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    onUpdate(student.id, {
      ...editData,
      gpa: Number(editData.gpa),
      attendance: Number(editData.attendance),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="student-card edit-mode">
        <h3>Edit Student</h3>
        <div className="edit-inputs">
          <div className="edit-group">
            <label>Name</label>
            <input name="name" value={editData.name} onChange={handleEditChange} />
          </div>
          <div className="edit-group">
            <label>Roll No</label>
            <input name="rollNo" value={editData.rollNo} onChange={handleEditChange} />
          </div>
          <div className="edit-group">
            <label>Department</label>
            <select name="department" value={editData.department} onChange={handleEditChange}>
              <option value="Computer Science">Computer Science</option>
              <option value="Electronics">Electronics</option>
              <option value="Mechanical">Mechanical</option>
              <option value="Civil">Civil</option>
            </select>
          </div>
          <div className="edit-group">
            <label>Course</label>
            <input name="course" value={editData.course} onChange={handleEditChange} />
          </div>
          <div className="edit-group">
            <label>Year</label>
            <input name="year" value={editData.year} onChange={handleEditChange} />
          </div>
          <div className="edit-group">
            <label>Email</label>
            <input name="email" value={editData.email} onChange={handleEditChange} />
          </div>
          <div className="edit-group">
            <label>GPA</label>
            <input name="gpa" type="number" step="0.1" value={editData.gpa} onChange={handleEditChange} />
          </div>
          <div className="edit-group">
            <label>Attendance (%)</label>
            <input name="attendance" type="number" value={editData.attendance} onChange={handleEditChange} />
          </div>
        </div>
        <div className="card-actions">
          <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
          <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`student-card ${isTopper ? "border-topper" : ""} ${isLowAttendance ? "border-warning" : ""}`}>
      <div className="card-header">
        <div className="name-section">
          <h2>{student.name}</h2>
          <span className="roll-no">{student.rollNo}</span>
        </div>
        <div className="badges">
          {isTopper && <span className="badge badge-success">🏆 Topper</span>}
          {isLowAttendance && <span className="badge badge-danger">⚠ Low Att.</span>}
        </div>
      </div>

      {showDetails && (
        <div className="card-details">
          <div className="detail-row"><span>Dept:</span> <strong>{student.department}</strong></div>
          <div className="detail-row"><span>Course:</span> <strong>{student.course || "N/A"}</strong></div>
          <div className="detail-row"><span>Year:</span> <strong>{student.year || "N/A"}</strong></div>
          <div className="detail-row"><span>Email:</span> <strong>{student.email || "N/A"}</strong></div>
          <div className="detail-row"><span>GPA:</span> <strong>{Number(student.gpa).toFixed(1)}</strong></div>
          <div className="detail-row"><span>Attendance:</span> <strong>{Number(student.attendance).toFixed(1)}%</strong></div>
        </div>
      )}

      <div className="card-actions">
        <button className="btn btn-outline" onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide Details" : "View Details"}
        </button>
        <div className="action-group">
          <button className="btn btn-icon" onClick={() => setIsEditing(true)} title="Edit">✏️</button>
          <button className="btn btn-icon btn-danger-icon" onClick={() => onDelete(student.id)} title="Delete">🗑️</button>
        </div>
      </div>
    </div>
  );
}

export default StudentCard;