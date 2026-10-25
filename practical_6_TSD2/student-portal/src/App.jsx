import { useState } from "react";
import StudentCard from "./components/StudentCard";
import StudentForm from "./components/StudentForm";
import "./App.css";

const initialStudents = [
  { id: 1, name: "Aarav Sharma", rollNo: "CS101", department: "Computer Science", course: "B.Tech CSE", year: "2nd Year", email: "aarav@college.edu", gpa: 9.1, attendance: 92 },
  { id: 2, name: "Priya Verma", rollNo: "EC204", department: "Electronics", course: "B.Tech ECE", year: "3rd Year", email: "priya@college.edu", gpa: 8.7, attendance: 88 },
  { id: 3, name: "Rohan Mehta", rollNo: "ME309", department: "Mechanical", course: "B.Tech Mech", year: "1st Year", email: "rohan@college.edu", gpa: 7.2, attendance: 70 },
  { id: 4, name: "Sneha Patil", rollNo: "CS102", department: "Computer Science", course: "B.Tech CSE", year: "2nd Year", email: "sneha@college.edu", gpa: 8.9, attendance: 95 },
];

function App() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState("home"); // Controls Navigation

  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  // Group students by department
  const groupedStudents = filteredStudents.reduce((acc, student) => {
    if (!acc[student.department]) acc[student.department] = [];
    acc[student.department].push(student);
    return acc;
  }, {});

  const addStudent = (student) => {
    setStudents((prev) => [
      ...prev,
      { ...student, id: prev.length ? Math.max(...prev.map((s) => s.id)) + 1 : 1 },
    ]);
  };

  const deleteStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const updateStudent = (id, updated) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updated } : s))
    );
  };

  // --- PAGE RENDERERS ---
  const renderHome = () => (
    <div className="hero-section">
      <h1>Welcome to the College Portal</h1>
      <p>Manage student profiles, academic records, and departmental data efficiently.</p>
      <button className="btn btn-primary hero-btn" onClick={() => setCurrentPage("directory")}>
        View Student Directory
      </button>
    </div>
  );

    const renderAbout = () => (
    <div className="content-page">
      <h2>About SVPCET, Nagpur</h2>
      <p>
        St. Vincent Pallotti College of Engineering & Technology (SVPCET), Nagpur, was established in 2004 by the Nagpur Pallottine Society . The institution is committed to providing high-quality technical education and has consistently been a sought-after choice for engineering aspirants in the region .
      </p>
      
      <div className="about-section">
        <h3>Our Vision</h3>
        <p>To develop a knowledge-based society with clarity of thoughts and charity at hearts to serve humanity with integrity.</p>
      </div>

      <div className="about-section">
        <h3>Our Mission</h3>
        <p>To empower youth to be technocrats of tomorrow with absolute discipline, quest for knowledge, and strong ethos to uphold the spirit of professionalism .</p>
      </div>

      <div className="about-section">
        <h3>Academic Excellence & Departments</h3>
        <p>
          The institute offers 11 Undergraduate B.Tech programs across various disciplines including Computer Engineering, Electronics & Telecommunication, Information Technology, Mechanical, Electrical, and cutting-edge fields like Data Science, Cyber-Security, and Artificial Intelligence . We also offer M.Tech programs and serve as an RTMNU Recognized Research Center for Ph.D. studies .
        </p>
      </div>

      <div className="about-section">
        <h3>Beyond the Classroom</h3>
        <p>
          Education at SVPCET extends beyond textbooks. With a focus on Industry 4.0 and Education 4.0, the college fosters a culture of innovation and entrepreneurship . Students actively participate in various clubs including Music & Cultural, and Science & Technology, ensuring holistic development . The dedicated Training & Placement Cell works tirelessly to provide 100% placement assistance, preparing students through rigorous campus recruitment training .
        </p>
      </div>
    </div>
  );

    const renderContact = () => (
    <div className="content-page">
      <h2>Contact SVPCET</h2>
      <p>Get in touch with the administration for admissions, inquiries, or general support.</p>
      
      <div className="contact-grid">
        {/* Address Card */}
        <div className="contact-card">
          <h3>📍Campus Address</h3>
          <p>St. Vincent Pallotti College of Engineering & Technology</p>
          <p>Gavsi Manapur, Wardha Road,</p>
          <p>Nagpur - 441108, Maharashtra, India</p>
        </div>

        {/* Phone Card */}
        <div className="contact-card">
          <h3>📞Phone Numbers</h3>
          <p><strong>Reception:</strong> +91-7104-236325</p>
          <p><strong>Admissions:</strong> +91-7104-236399</p>
          <p><strong>Fax:</strong> +91-7104-236300</p>
        </div>

        {/* Email Card */}
        <div className="contact-card">
          <h3>✉️Email Us</h3>
          <p><strong>General Info:</strong> info@svpcet.org</p>
          <p><strong>Principal:</strong> principal@svpcet.org</p>
          <p><strong>Admissions:</strong> admissions@svpcet.org</p>
        </div>
      </div>
    </div>
  );

  const renderDirectory = () => (
    <>
      <div className="page-title">
        <h2>Student Directory</h2>
        <p>Manage student profiles organized by department.</p>
      </div>

      <div className="controls-bar">
        <input
          className="search-input"
          type="text"
          placeholder="🔍 Search by name or roll no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <StudentForm onAdd={addStudent} />

      {Object.keys(groupedStudents).length === 0 ? (
        <div className="empty-state"><p>No students found.</p></div>
      ) : (
        Object.keys(groupedStudents).map((dept) => (
          <div key={dept} className="department-section">
            <h3 className="department-title">{dept} Department</h3>
            <div className="cards-grid">
              {groupedStudents[dept].map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onDelete={deleteStudent}
                  onUpdate={updateStudent}
                />
              ))}
            </div>
          </div>
        ))
      )}
    </>
  );

  return (
    <div className="app-wrapper">
      {/* HEADER / NAVBAR */}
      <header className="main-header">
        <div className="header-content">
          <div className="logo" onClick={() => setCurrentPage("home")} style={{ cursor: "pointer" }}>
            <span className="logo-icon">🏛️</span> 
            <h1>College Portal</h1>
          </div>
          <nav className="nav-links">
            <button className={currentPage === "home" ? "active" : ""} onClick={() => setCurrentPage("home")}>Home</button>
            <button className={currentPage === "directory" ? "active" : ""} onClick={() => setCurrentPage("directory")}>Departments</button>
            <button className={currentPage === "about" ? "active" : ""} onClick={() => setCurrentPage("about")}>About</button>
            <button className={currentPage === "contact" ? "active" : ""} onClick={() => setCurrentPage("contact")}>Contact</button>
          </nav>
          <div className="user-profile">
            <div className="avatar">A</div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="main-content">
        {currentPage === "home" && renderHome()}
        {currentPage === "directory" && renderDirectory()}
        {currentPage === "about" && renderAbout()}
        {currentPage === "contact" && renderContact()}
      </main>
    </div>
  );
}

export default App;