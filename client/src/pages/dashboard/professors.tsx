import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { ProfessorType } from "../../models/typeApp.ts";
import { ModalAdd } from "../../widgets/layout/professor/modalAddProfessor.tsx";
import { ModalDelete } from "../../widgets/layout/professor/modalDeleteProfessor.tsx";
import { ModalEdit } from "../../widgets/layout/professor/modalEditProfessor.tsx";
import { ModalSearch } from "../../widgets/layout/professor/modalSearchProfessor.tsx";
import { Notification } from "../../widgets/layout/notifications.tsx";

interface NotificationState {
  message: string;
  type: "success" | "error" | "";
  isVisible: boolean;
}

export const Professors: React.FC = () => {
  const [professors, setprofessors] = useState<ProfessorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [professorToDeleteId, setprofessorToDeleteId] = useState<string | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [professorToEdit, setprofessorToEdit] = useState<ProfessorType | null>(
    null,
  );
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "",
    isVisible: false,
  });

  useEffect(() => {
    const fetchprofessors = async () => {
      try {
        const professorsData = await fetch("http://localhost:9123/professors",{
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
        setprofessors(await professorsData.json());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching professors:", error);
        setLoading(false);
      }
    };

    fetchprofessors();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalSearch = () => setIsSearchModalOpen(true);
  const closeModalSearch = () => setIsSearchModalOpen(false);
  const handleSearchprofessor = async (id: string) => {
    const foundprofessor = await fetch(
      `http://localhost:9123/professors/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (foundprofessor.ok) {
      openEditModal(await foundprofessor.json());
    } else {
      showNotification("Professor not found", "error");
    }
    closeModalSearch();
  };

  const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setprofessorToDeleteId(id);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setprofessorToDeleteId(null);
  };

  const openEditModal = (professor: ProfessorType) => {
    setprofessorToEdit(professor);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setprofessorToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleAddprofessor = async (newprofessor: ProfessorType) => {
    if (
      newprofessor.firstName === undefined ||
      newprofessor.lastName === undefined ||
      newprofessor.email === undefined
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:9123/professors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newprofessor),
      });

      if (response.ok) {
        showNotification("professor added successfully", "success");
        const professorsData = await fetch("http://localhost:9123/professors", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        setprofessors(await professorsData.json());
      } else {
        showNotification("Failed to add professor", "error");
      }
    } catch (error) {
      console.error("Error adding professor:", error);
      showNotification("Failed to add professor", "error");
    }
  };

  const handleDeleteprofessor = async () => {
    if (!professorToDeleteId) return;

    try {
      const response =
        await fetch(`http://localhost:9123/professors/${professorToDeleteId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });
      if (response.ok) {
        showNotification("Professor deleted successfully", "success");
        setprofessors((prevProfessors: ProfessorType[]) =>
          prevProfessors.filter(
            (professor) => professor.id !== professorToDeleteId,
          ),
        );
      } else {
        showNotification("Failed to delete professor", "error");
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting professor:", error);
      showNotification("Failed to delete professor", "error");
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
            Professors
            <div className="flex justify-end mr-3 mt-[-2rem]">
              <button
                onClick={openModalSearch}
                className="mr-2 block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="button"
              >
                Search professor
              </button>

              <button
                onClick={openModal}
                className="block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="button"
              >
                Add professor
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
                  First Name
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Last Name
                </th>
                <th className="py-3 px-5 border-b border-blue-gray-50">
                  Email
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
              {professors.map(
                ({ id, firstName, lastName, email, createdAt }) => {
                  const className = "py-3 px-5 border-b border-blue-gray-50";

                  return (
                    <tr key={id}>
                      <td className={className}>{id}</td>
                      <td className={className}>{firstName}</td>
                      <td className={className}>{lastName}</td>
                      <td className={className}>{email}</td>
                      <td className={className}>{createdAt?.toString()}</td>
                      <td className={className}>
                        <button
                          onClick={() =>
                            openEditModal({
                              id,
                              firstName,
                              lastName,
                              email,
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
        onAddprofessor={handleAddprofessor}
      />

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteprofessor}
      />

      <ModalSearch
        isOpen={isSearchModalOpen}
        onClose={closeModalSearch}
        onSearch={handleSearchprofessor}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={async (editedprofessor: ProfessorType) => {
          if (
            editedprofessor.firstName === undefined ||
            editedprofessor.lastName === undefined ||
            editedprofessor.email === undefined
          ) {
            alert("Please fill all fields");
            return;
          }

          try {
            const response = await fetch(
              `http://localhost:9123/professors/${editedprofessor.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedprofessor),
              },
            );
            closeEditModal();
            if (response.ok) {
              showNotification("professor updated successfully", "success");
              const professorsData = await fetch(
                "http://localhost:9123/professors",
                {
                  method: "GET",
                  headers: {
                    "Content-Type": "application/json",
                  },
                },
              );
              setprofessors(await professorsData.json());
            } else {
              showNotification("Failed to update professor", "error");
            }
          } catch (error) {
            console.error("Error updating professor:", error);
            showNotification("Failed to update professor", "error");
          }
        }}
        initialData={professorToEdit}
      />
    </div>
  );
};
