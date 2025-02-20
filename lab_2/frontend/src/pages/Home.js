import React, { useState, useEffect } from "react";
import StudentTable from "../components/StudentTable";
import Pagination from "../components/Pagination";
import StudentForm from "../components/StudentForm";
import StudentEditForm from "../components/StudentEditForm";

const Home = () => {
  //   const apiUrl = process.env.REACT_APP_API_URL || "";
  //   console.log("API URL:", process.env.REACT_APP_API_URL);
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  {
    /* ===================================== SEARCH FILTERS ===================================== */
  }
  const [filters, setFilters] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    course: "",
    group_name: "",
    faculty: "",
  });

  {
    /* ===================================== RESET FILTERS ===================================== */
  }
  const handleResetFilters = () => {
    setFilters({
      last_name: "",
      first_name: "",
      middle_name: "",
      course: "",
      group_name: "",
      faculty: "",
    });

    // setPage(1);
    // fetchStudents();
  };

  {
    /* ===================================== STUDENTS SEARCH ===================================== */
  }
  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchStudents();
  };

  {
    /* ===================================== STUDENTS LOAD ===================================== */
  }
  const fetchStudents = () => {
    const skip = (page - 1) * pageSize;
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "")
    );
    const queryParams = new URLSearchParams({
      skip,
      limit: pageSize,
      ...cleanedFilters,
    });

    fetch(`/api/students/search?${queryParams}`)
      // .then((res) => res.json())
      .then((res) => {
        if (!res.ok) {
          return res.json().then((errorData) => {
            throw new Error(errorData.detail || "Error while data loading");
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Received data: ", data);
        setStudents(data.students);
        setTotalPages(Math.ceil(data.totalCount / pageSize));
      })
      .catch((error) => {
        console.error("Error during data loading: ", error);
        alert(error.message);
        setStudents([]);
        setTotalPages(1);
      });
  };

  useEffect(() => {
    fetchStudents();
  }, [page, pageSize]);

  {
    /* ===================================== STUDENTS DELETE ===================================== */
  }
  const handleDelete = (studentId) => {
    if (window.confirm("Are you sure you want to remove this student?")) {
      fetch(`/api/student/delete/${studentId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            setStudents((prevStudents) =>
              prevStudents.filter((student) => student.id !== studentId)
            );
            alert("The student has been successfully removed!");
            window.location.reload();
          } else {
            alert("Error while deleting a student");
          }
        })
        .catch((error) => console.error("Error while deleting: ", error));
    }
  };

  {
    /* ===================================== STUDENTS UPDATE ===================================== */
  }
  const handleEdit = (student) => {
    setEditingStudent(student);
    setIsEditFormVisible(true);
  };

  const handleUpdate = async (updatedStudent) => {
    try {
      const response = await fetch(`/api/student/update/${updatedStudent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedStudent),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error while updating a student");
      }

      alert("The student has been successfully updated!");
      setStudents(
        students.map((student) =>
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      setIsEditFormVisible(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center">
        <h1 className="text-2xl mb-4">STUDENTS</h1>
      </div>

      {/* ===================================== STUDENTS SEARCH BUTTON ===================================== */}
      <button
        onClick={() => setIsSearchVisible(!isSearchVisible)}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 mb-4"
      >
        {isSearchVisible ? "Hide search" : "Search students"}
      </button>

      {/* ============================= STUDENT ADD BUTTON ============================= */}
      <button
        onClick={() => setIsFormVisible(!isFormVisible)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
      >
        {isFormVisible ? "Hide form" : "Add student"}
      </button>

      {isFormVisible && (
        <StudentForm
          onStudentAdded={(newStudent) =>
            setStudents([...students, newStudent])
          }
        />
      )}

      {/* ===================================== STUDENTS SEARCH BLOCK ===================================== */}
      {isSearchVisible && (
        <form onSubmit={handleSearch} className="mb-4 bg-gray-100 p-4 rounded">
          <div className="grid grid-cols-2 gap-4">
            {[
              "last_name",
              "first_name",
              "middle_name",
              "course",
              "group_name",
              "faculty",
            ].map((field) => (
              <input
                key={field}
                type={field === "course" ? "number" : "text"}
                name={field}
                placeholder={field.replace("_", " ")}
                value={filters[field]}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="p-2 border rounded w-full"
              />
            ))}
          </div>

          <div className="flex">
            {/* ============================= SEARCH BUTTON ============================= */}
            <button
              type="submit"
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Search
            </button>
            {/* ============================= RESTORE FILTERS BUTTON ============================= */}
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ml-2"
            >
              Reset filters
            </button>
          </div>
        </form>
      )}

      {/* ===================================== STUDENT UPDATE BLOCK ===================================== */}
      {isEditFormVisible && editingStudent && (
        <StudentEditForm
          student={editingStudent}
          onUpdate={handleUpdate}
          onCancel={() => setIsEditFormVisible(false)}
        />
      )}

      {/* ===================================== STUDENTS VIEW BLOCK ===================================== */}
      {students.length === 0 ? (
        <p className="text-center text-gray-500">No students found</p>
      ) : (
        <StudentTable
          students={students}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}

      {/* ===================================== PAGINATION BLOCK ===================================== */}
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
