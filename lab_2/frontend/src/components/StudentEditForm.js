import React, { useState, useEffect } from "react";
import axios from "axios";

const StudentEditForm = ({ student, onUpdate, onCancel }) => {
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    course: "",
    group_name: "",
    faculty: "",
  });

  useEffect(() => {
    if (student) {
      setFormData({
        last_name: student.last_name,
        first_name: student.first_name,
        middle_name: student.middle_name,
        course: student.course,
        group_name: student.group_name,
        faculty: student.faculty,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/student/update/${student.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error while student update");
      }

      alert("The student has been successfully updated!");
      onUpdate({ ...student, ...formData });
      window.location.reload();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md bg-white mb-4"
    >
      <h2 className="text-lg font-semibold mb-2">Edit student</h2>
      <input
        type="text"
        name="last_name"
        placeholder="Фамилия"
        value={formData.last_name}
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="first_name"
        placeholder="Имя"
        value={formData.first_name}
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="middle_name"
        placeholder="Отчество"
        value={formData.middle_name}
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        type="number"
        name="course"
        placeholder="Курс"
        value={formData.course}
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="group_name"
        placeholder="Группа"
        value={formData.group_name}
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="faculty"
        placeholder="Факультет"
        value={formData.faculty}
        onChange={handleChange}
        className="w-full p-2 border mb-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
      >
        Cancel
      </button>
    </form>
  );
};

export default StudentEditForm;
