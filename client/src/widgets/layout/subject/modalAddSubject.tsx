import React, { useState } from "react";
import {
  SubjectType,
} from "../../../models/typeApp.ts";

interface ModalAddProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSubject: (subject: SubjectType) => void;
}

export const ModalAdd: React.FC<ModalAddProps> = ({
  isOpen,
  onClose,
  onAddSubject,
}) => {
  const [formData, setFormData] = useState<SubjectType>({
    id: "",
    subjectDescription: "",
    subjectName: "",
    professorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const validateForm = async () => {
    const newErrors: Record<string, string> = {};

    if (formData.professorId === undefined) {
      newErrors.professorId = "Professor ID not found";
    }
    if (formData.professorId != null) {
      const response = await fetch("http://localhost:9123/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData.professorId),
      });
      if (!response) {
        newErrors.professorId = "Professor ID not found";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await validateForm()) {
      onAddSubject(formData);
      onClose();
    }
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
                  Add Subject
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
              <form onSubmit={handleSave}>
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
                      htmlFor="subjectName"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Subject Name
                    </label>
                    <input
                      type="text"
                      name="subjectName"
                      id="subjectNameAdd"
                      value={formData.subjectName}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type subject name"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="subjectDescription"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Subject Description
                    </label>
                    <input
                      type="text"
                      name="subjectDescription"
                      id="subjectDescriptionAdd"
                      value={formData.subjectDescription}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type subject description"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="professorId"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Professor ID
                    </label>
                    <input
                      type="text"
                      name="professorId"
                      id="professorIdAdd"
                      value={formData.professorId}
                      onChange={handleInputChange}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Type professor id"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="text-black border border-gray-400 inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 mt-4"
                  >
                    <svg
                      className="mr-1 -ml-1 w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                    Add new subject
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
