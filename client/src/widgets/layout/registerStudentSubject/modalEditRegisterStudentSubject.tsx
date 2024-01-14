import React, { useState, useEffect } from "react";
import { Button } from "@material-tailwind/react";
import { RegisterStudentSubjectType } from "../../../models/typeApp.ts";

interface ModalEditProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: (editedRegisterStudentSubject: RegisterStudentSubjectType) => void;
  initialData: RegisterStudentSubjectType | null;
}

export const ModalEdit: React.FC<ModalEditProps> = ({
  isOpen,
  onClose,
  onEdit,
  initialData,
}) => {
  const [editedRegisterStudentSubject, setEditedRegisterStudentSubject] =
    useState<RegisterStudentSubjectType>(
      initialData || {
        id: "",
        studentId: "",
        subjectId: "",
        dateRegistered: new Date(),
        createdAt: new Date(),
      },
    );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setEditedRegisterStudentSubject(
      initialData || {
        id: "",
        studentId: "",
        subjectId: "",
        dateRegistered: new Date(),
        grade: 0,
        createdAt: new Date(),
      },
    );
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedRegisterStudentSubject((prevRegisterStudentSubject) => ({
      ...prevRegisterStudentSubject,
      [name]: value,
      [name]: name === "grade" ? parseInt(value) : value,
      [name]: name === "dateRegistered" ? new Date(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!(await validateForm())) {
      return;
    }
    onEdit(editedRegisterStudentSubject);
  };

  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (editedRegisterStudentSubject.studentId === undefined) {
      newErrors.studentId = "Student ID not found";
    }
    if (editedRegisterStudentSubject.studentId != null) {
      const response = await fetch(
        "http://localhost:9123/students/" +
          editedRegisterStudentSubject.studentId,
      );
      if (!response.ok) {
        newErrors.studentId = "Student ID not found";
      }
    }
    if (editedRegisterStudentSubject.subjectId === undefined) {
      newErrors.subjectId = "Subject ID not found";
    }
    if (editedRegisterStudentSubject.subjectId != null) {
      const response = await fetch(
        "http://localhost:9123/subjects/" +
          editedRegisterStudentSubject.subjectId,
      );
      if (!response.ok) {
        newErrors.subjectId = "Subject ID not found";
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  return (
    <div
      className={`fixed inset-0 overflow-y-auto ${isOpen ? "block" : "hidden"}`}
    >
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-2xl"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="relative p-4 w-full h-full">
            <div className="relative p-4 bg-white rounded-lg shadow sm:p-5">
              <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Edit RegisterStudentSubject
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={onClose}
                >
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="text-red-500">
                  {Object.values(errors).map((error, index) => (
                    <p key={index} className="mb-10">
                      {error}
                    </p>
                  ))}
                </div>
                <div className="grid gap-4 mb-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="studentId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      StudentId
                    </label>
                    <input
                      type="text"
                      name="studentId"
                      id="studentId"
                      value={editedRegisterStudentSubject.studentId}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subjectId"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      SubjectId
                    </label>
                    <input
                      type="text"
                      name="subjectId"
                      id="subjectId"
                      value={editedRegisterStudentSubject.subjectId}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dateRegistered"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      DateRegistered
                    </label>
                    <input
                      type="date"
                      name="dateRegistered"
                      id="dateRegistered"
                      value={
                        editedRegisterStudentSubject.dateRegistered
                          ? new Date(
                              editedRegisterStudentSubject.dateRegistered,
                            )
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="grade"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                    >
                      Grade
                    </label>
                    <input
                      type="number"
                      name="grade"
                      id="grade"
                      value={editedRegisterStudentSubject.grade}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="text-black border border-gray-400 inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-4"
                    placeholder
                  >
                    Save Changes
                  </Button>
                  <Button
                    className="ml-2 text-black border border-gray-400 inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-4"
                    placeholder
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
