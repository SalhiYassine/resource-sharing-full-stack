import React from "react";

import { StudentsList } from "../students/StudentsList.jsx";

function StudentsPage() {
  return (
    <div className="students-page">
      <div className="students-container container">
        <StudentsList />
      </div>
    </div>
  );
}

export default StudentsPage;
