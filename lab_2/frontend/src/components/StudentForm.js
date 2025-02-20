import { useState } from "react";
import axios from "axios";

const StudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    middle_name: "",
    course: "",
    group_name: "",
    faculty: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/student/create", formData);
      alert("Студент успешно добавлен!");
      onStudentAdded(response.data.student);
      setFormData({
        last_name: "",
        first_name: "",
        middle_name: "",
        course: "",
        group_name: "",
        faculty: "",
      });
    } catch (error) {
      alert(error.response?.data?.detail || "Error while adding student");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 border rounded shadow-md bg-white"
    >
      <h2 className="text-lg font-semibold mb-2">Add student</h2>
      <input
        type="text"
        name="last_name"
        placeholder="Фамилия"
        value={formData.last_name}
        onChange={handleChange}
        required
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="first_name"
        placeholder="Имя"
        value={formData.first_name}
        onChange={handleChange}
        required
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="middle_name"
        placeholder="Отчество (если есть)"
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
        required
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="group_name"
        placeholder="Группа"
        value={formData.group_name}
        onChange={handleChange}
        required
        className="w-full p-2 border mb-2"
      />
      <input
        type="text"
        name="faculty"
        placeholder="Факультет"
        value={formData.faculty}
        onChange={handleChange}
        required
        className="w-full p-2 border mb-2"
      />
      <button
        type="submit"
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Add
      </button>
    </form>
  );
};

export default StudentForm;
