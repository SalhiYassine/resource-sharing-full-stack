import React from "react";
import { useLocation } from "react-router-dom";

import { StudentsList } from "../students/StudentsList.jsx";
import StudentProfile from "../students/StudentProfile.jsx";

function StudentPage() {
  const location = useLocation();
  const studentID = location.pathname.split("/")[2];

  return (
    <div className="students-page">
      <div className="students-container container student-page">
        <StudentsList />
        <StudentProfile studentID={parseInt(studentID)} />
      </div>
    </div>
  );
}

export default StudentPage;
