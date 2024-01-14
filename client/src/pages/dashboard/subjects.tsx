import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { SubjectType } from "../../models/typeApp.ts";
import { ModalAdd } from "../../widgets/layout/subject/modalAddSubject.tsx";
import { ModalDelete } from "../../widgets/layout/subject/modalDeleteSubject.tsx";
import { ModalEdit } from "../../widgets/layout/subject/modalEditSubject.tsx";
import { ModalSearch } from "../../widgets/layout/subject/modalSearchSubject.tsx";
import { Notification } from "../../widgets/layout/notifications.tsx";

interface NotificationState {
  message: string;
  type: "success" | "error" | "";
  isVisible: boolean;
}

export const Subjects: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subjectToDeleteId, setSubjectToDeleteId] = useState<string | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<SubjectType | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "",
    isVisible: false,
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectsData = await fetch("http://localhost:9123/subjects")
        setSubjects(await subjectsData.json());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalSearch = () => setIsSearchModalOpen(true);
  const closeModalSearch = () => setIsSearchModalOpen(false);
  const handleSearchSubject = async (id: string) => {
    const foundSubject = await fetch(
      `http://localhost:9123/subjects/${id}`,
    )
    if (foundSubject.ok) {
      openEditModal(await foundSubject.json());
    } else {
      showNotification("Subject not found", "error");
    }
    closeModalSearch();
  };

  const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setSubjectToDeleteId(id);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSubjectToDeleteId(null);
  };

  const openEditModal = (subject: SubjectType) => {
    setSubjectToEdit(subject);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setSubjectToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleAddSubject = async (newSubject: SubjectType) => {
    if (
      newSubject.subjectName === undefined ||
      newSubject.subjectDescription === undefined ||
      newSubject.professorId === undefined
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:9123/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubject),
      });
      if (response.ok) {
        showNotification("Subject added successfully", "success");
        const subjectsData = await fetch("http://localhost:9123/subjects")
        setSubjects(await subjectsData.json());
      } else {
        showNotification("Failed to add subject", "error");
      }
    } catch (error) {
      console.error("Error adding subject:", error);
      showNotification("Failed to add subject", "error");
    }
  };

  const handleDeleteSubject = async () => {
    if (!subjectToDeleteId) return;

    try {
      const response = await fetch(
        `http://localhost:9123/subjects/${subjectToDeleteId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        showNotification("Subject deleted successfully", "success");
        setSubjects((prevSubjects: SubjectType[]) =>
          prevSubjects.filter((subject) => subject.id !== subjectToDeleteId),
        );
      } else {
        showNotification("Failed to delete subject", "error");
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting subject:", error);
      showNotification("Failed to delete subject", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type, isVisible: true });
    setTimeout(() => {
      setNotification((prevState) => ({ ...prevState, isVisible: false }));
    }, 5000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Notification message={notification.message} type={notification.type} />
      <Card placeholder>
        <CardHeader
          variant="gradient"
          color="gray"
          className="mb-8 p-6"
          placeholder
        >
          <Typography
              variant="h6"
              color="white"
              placeholder="true"
              className="mx-auto"
          >
            <div className="hidden md:block">Subjects</div>
            <div className="flex justify-end md:mr-3 mt-0 md:mt-[-2rem] ">
              <button
                  onClick={openModalSearch}
                  className="mr-2 block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  type="button"
              >
                Search Subject
              </button>

              <button
                  onClick={openModal}
                  className="block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  type="button"
              >
                Add Subject
              </button>
            </div>
          </Typography>
        </CardHeader>
        <CardBody
            className="overflow-x-scroll px-0 pt-0 pb-2"
            placeholder="true"
        >
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Id
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Subject Name
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Subject Description
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Professor Id
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Created At
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Edit
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50 dark:border-gray-600 bg-primary-700 dark:bg-primary-600 dark:text-white">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(
                ({
                  id,
                  subjectName,
                  subjectDescription,
                  professorId,
                  createdAt,
                }) => {
                  const className = "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={className}>{id}</td>
                      <td className={className}>{subjectName}</td>
                      <td className={className}>{subjectDescription}</td>
                      <td className={className}>{professorId}</td>
                      <td className={className}>{createdAt?.toString()}</td>
                      <td className={className}>
                        <button
                          onClick={() =>
                            openEditModal({
                              id,
                              subjectName,
                              subjectDescription,
                              professorId,
                              createdAt,
                            })
                          }
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                        >
                          Edit
                        </button>
                      </td>
                      <td className={className}>
                        <button
                          onClick={() => openDeleteModal(id)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                },
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <ModalAdd
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddSubject={handleAddSubject}
      />

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteSubject}
      />

      <ModalSearch
        isOpen={isSearchModalOpen}
        onClose={closeModalSearch}
        onSearch={handleSearchSubject}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={async (editedSubject: SubjectType) => {
          if (
            editedSubject.subjectName === undefined ||
            editedSubject.subjectDescription === undefined ||
            editedSubject.professorId === undefined
          ) {
            alert("Please fill all fields");
            return;
          }

          try {
            const response = await fetch(
              `http://localhost:9123/subjects/${editedSubject.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedSubject),
              },
            );
            closeEditModal();
            if (response.ok) {
              showNotification("Subject updated successfully", "success");
              const subjectsData = await fetch(
                "http://localhost:9123/subjects",
              );
              setSubjects(await subjectsData.json());
            } else {
              showNotification("Failed to update subject", "error");
            }
          } catch (error) {
            console.error("Error updating subject:", error);
            showNotification("Failed to update subject", "error");
          }
        }}
        initialData={subjectToEdit}
      />
    </div>
  );
};
