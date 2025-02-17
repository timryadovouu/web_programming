import React, { useState, useEffect } from "react";
import StudentTable from "../components/StudentTable";
import Pagination from "../components/Pagination";

const Home = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  //   const apiUrl = process.env.REACT_APP_API_URL || "";
  //   console.log("API URL:", process.env.REACT_APP_API_URL);

  useEffect(() => {
    const skip = (page - 1) * pageSize;

    fetch(`/api/students?skip=${skip}&limit=${pageSize}`)
      .then((res) => res.json())
      .then((data) => {
        setStudents(data.students);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => console.error("Ошибка загрузки данных:", error));
  }, [page, pageSize]);

  const handleDelete = (studentId) => {
    if (window.confirm("Вы уверены, что хотите удалить этого студента?")) {
      fetch(`/api/student/delete/${studentId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setStudents((prevStudents) =>
              prevStudents.filter((student) => student.id !== studentId)
            );
            alert("Студент успешно удален!");
            window.location.reload();
          } else {
            alert("Ошибка при удалении студента.");
          }
        })
        .catch((error) => console.error("Ошибка при удалении:", error));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Студенты</h1>

      <StudentTable students={students} onDelete={handleDelete} />
      <Pagination
        page={page}
        setPage={setPage}
        totalPages={totalPages}
        pageSize={pageSize}
        setPageSize={setPageSize}
      />
    </div>
  );
};

export default Home;
