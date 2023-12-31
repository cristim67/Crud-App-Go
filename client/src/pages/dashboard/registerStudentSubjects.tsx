import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { RegisterStudentSubjectType } from "../../models/typeApp.ts";
import { ModalAdd } from "../../widgets/layout/registerStudentSubject/modalAddRegisterStudentSubject.tsx";
import { ModalDelete } from "../../widgets/layout/registerStudentSubject/modalDeleteRegisterStudentSubject.tsx";
import { ModalEdit } from "../../widgets/layout/registerStudentSubject/modalEditRegisterStudentSubject.tsx";
import { ModalSearch } from "../../widgets/layout/registerStudentSubject/modalSearchRegisterStudentSubject.tsx";
import { Notification } from "../../widgets/layout/notifications.tsx";

interface NotificationState {
  message: string;
  type: "success" | "error" | "";
  isVisible: boolean;
}

export const RegisterStudentSubjects: React.FC = () => {
  const [RegisterStudentSubjects, setRegisterStudentSubjects] = useState<
    RegisterStudentSubjectType[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [
    RegisterStudentSubjectToDeleteId,
    setRegisterStudentSubjectToDeleteId,
  ] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [RegisterStudentSubjectToEdit, setRegisterStudentSubjectToEdit] =
    useState<RegisterStudentSubjectType | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "",
    isVisible: false,
  });

  useEffect(() => {
    const fetchRegisterStudentSubjects = async () => {
      try {
        const RegisterStudentSubjectsData = await fetch(
          "http://localhost:9123/registerStudentSubjects",
        );
        setRegisterStudentSubjects(await RegisterStudentSubjectsData.json());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching RegisterStudentSubjects:", error);
        setLoading(false);
      }
    };

    fetchRegisterStudentSubjects();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalSearch = () => setIsSearchModalOpen(true);
  const closeModalSearch = () => setIsSearchModalOpen(false);
  const handleSearchRegisterStudentSubject = async (id: string) => {
    const foundRegisterStudentSubject = await fetch(
      `http://localhost:9123/registerStudentSubjects/${id}`,
    );
    if (foundRegisterStudentSubject.ok) {
      openEditModal(await foundRegisterStudentSubject.json());
    } else {
      showNotification("RegisterStudentSubject not found", "error");
    }
    closeModalSearch();
  };

  const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setRegisterStudentSubjectToDeleteId(id);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setRegisterStudentSubjectToDeleteId(null);
  };

  const openEditModal = (
    RegisterStudentSubject: RegisterStudentSubjectType,
  ) => {
    setRegisterStudentSubjectToEdit(RegisterStudentSubject);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setRegisterStudentSubjectToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleAddRegisterStudentSubject = async (
    newRegisterStudentSubject: RegisterStudentSubjectType,
  ) => {
    if (
      newRegisterStudentSubject.subjectId === undefined ||
      newRegisterStudentSubject.studentId === undefined ||
      newRegisterStudentSubject.dateRegistered === undefined ||
      newRegisterStudentSubject.grade === undefined
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:9123/registerStudentSubjects",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newRegisterStudentSubject),
        },
      );
      if (response.ok) {
        showNotification(
          "RegisterStudentSubject added successfully",
          "success",
        );
        const RegisterStudentSubjectsData = await fetch(
          "http://localhost:9123/registerStudentSubjects",
        );
        setRegisterStudentSubjects(await RegisterStudentSubjectsData.json());
      } else {
        showNotification("Failed to add RegisterStudentSubject", "error");
      }
    } catch (error) {
      console.error("Error adding RegisterStudentSubject:", error);
      showNotification("Failed to add RegisterStudentSubject", "error");
    }
  };

  const handleDeleteRegisterStudentSubject = async () => {
    if (!RegisterStudentSubjectToDeleteId) return;

    try {
      const response = await fetch(
        `http://localhost:9123/registerStudentSubjects/${RegisterStudentSubjectToDeleteId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        showNotification(
          "RegisterStudentSubject deleted successfully",
          "success",
        );
        setRegisterStudentSubjects(
          (prevRegisterStudentSubjects: RegisterStudentSubjectType[]) =>
            prevRegisterStudentSubjects.filter(
              (RegisterStudentSubject) =>
                RegisterStudentSubject.id !== RegisterStudentSubjectToDeleteId,
            ),
        );
      } else {
        showNotification("Failed to delete registerStudentSubject", "error");
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting RegisterStudentSubject:", error);
      showNotification("Failed to delete registerStudentSubject", "error");
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
            RegisterStudentSubjects
            <div className="flex justify-end mr-3 mt-[-2rem]">
              <button
                onClick={openModalSearch}
                className="mr-2 block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="button"
              >
                Search RegisterStudentSubject
              </button>

              <button
                onClick={openModal}
                className="block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="button"
              >
                Add RegisterStudentSubject
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
                <th className="py-3 px-5 border-b border-blue-gray-50">ID</th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Student ID
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Subject ID
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Grade
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Date Registered
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Created At
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">Edit</th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {RegisterStudentSubjects.map(
                ({
                  id,
                  subjectId,
                  studentId,
                  grade,
                  dateRegistered,
                  createdAt,
                }) => {
                  const className = "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={className}>{id}</td>
                      <td className={className}>{studentId}</td>
                      <td className={className}>{subjectId}</td>
                      <td className={className}>{grade}</td>
                      <td className={className}>
                        {dateRegistered?.toString()}
                      </td>
                      <td className={className}>{createdAt?.toString()}</td>
                      <td className={className}>
                        <button
                          onClick={() =>
                            openEditModal({
                              id,
                              subjectId,
                              studentId,
                              grade,
                              dateRegistered,
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
        onAddRegisterStudentSubject={handleAddRegisterStudentSubject}
      />

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteRegisterStudentSubject}
      />

      <ModalSearch
        isOpen={isSearchModalOpen}
        onClose={closeModalSearch}
        onSearch={handleSearchRegisterStudentSubject}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={async (
          editedRegisterStudentSubject: RegisterStudentSubjectType,
        ) => {
          if (
            editedRegisterStudentSubject.subjectId === undefined ||
            editedRegisterStudentSubject.studentId === undefined ||
            editedRegisterStudentSubject.dateRegistered === undefined ||
            editedRegisterStudentSubject.grade === undefined
          ) {
            alert("Please fill all fields");
            return;
          }

          try {
            const response = await fetch(
              `http://localhost:9123/registerStudentSubjects/${editedRegisterStudentSubject.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedRegisterStudentSubject),
              },
            );
            closeEditModal();
            if (response.ok) {
              showNotification(
                "RegisterStudentSubject updated successfully",
                "success",
              );
              const RegisterStudentSubjectsData = await fetch(
                "http://localhost:9123/registerStudentSubjects",
              );
              setRegisterStudentSubjects(
                await RegisterStudentSubjectsData.json(),
              );
            } else {
              showNotification(
                "Failed to update RegisterStudentSubject",
                "error",
              );
            }
          } catch (error) {
            console.error("Error updating RegisterStudentSubject:", error);
            showNotification(
              "Failed to update RegisterStudentSubject",
              "error",
            );
          }
        }}
        initialData={RegisterStudentSubjectToEdit}
      />
    </div>
  );
};
