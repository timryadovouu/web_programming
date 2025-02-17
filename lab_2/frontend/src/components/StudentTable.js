import React from "react";

const StudentTable = ({ students, onDelete }) => {
  return (
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border p-2">ID</th>
          <th className="border p-2">Фамилия</th>
          <th className="border p-2">Имя</th>
          <th className="border p-2">Отчество</th>
          <th className="border p-2">Курс</th>
          <th className="border p-2">Группа</th>
          <th className="border p-2">Факультет</th>
          <th className="border p-2">Действия</th>
        </tr>
      </thead>
      <tbody>
        {students.map((student) => (
          <tr key={student.id} className="text-center">
            <td className="border p-2">{student.id}</td>
            <td className="border p-2">{student.last_name}</td>
            <td className="border p-2">{student.first_name}</td>
            <td className="border p-2">{student.middle_name || "-"}</td>
            <td className="border p-2">{student.course}</td>
            <td className="border p-2">{student.group_name}</td>
            <td className="border p-2">{student.faculty}</td>
            <td className="border p-2">
              <button
                onClick={() => onDelete(student.id)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StudentTable;
