import React, {useEffect, useState} from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import {StudentType} from "../../models/typeApp.ts";
import {ModalAdd} from "../../widgets/layout/student/modalAddStudent.tsx";
import {ModalDelete} from "../../widgets/layout/student/modalDeleteStudent.tsx";
import {ModalEdit} from "../../widgets/layout/student/modalEditStudent.tsx";
import {ModalSearch} from "../../widgets/layout/student/modalSearchStudent.tsx";
import {Notification} from "../../widgets/layout/notifications.tsx";

interface NotificationState {
  message: string;
  type: "success" | "error" | "";
  isVisible: boolean;
}

export const Students: React.FC = () => {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<StudentType | null>(null);
  const [notification, setNotification] = useState<NotificationState>({
    message: "",
    type: "",
    isVisible: false,
  });

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const studentsData = await fetch("http://localhost:9123/students")
        setStudents(await studentsData.json());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching students:", error);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openModalSearch = () => setIsSearchModalOpen(true);
  const closeModalSearch = () => setIsSearchModalOpen(false);
  const handleSearchStudent = async (id: string) => {
    const foundStudent = await fetch(`http://localhost:9123/students/${id}`);
    if (foundStudent.ok) {
      openEditModal(await foundStudent.json());
    } else {
      showNotification("Student not found", "error");
    }
    closeModalSearch();
  };

  const openDeleteModal = (id: string) => {
    setIsDeleteModalOpen(true);
    setStudentToDeleteId(id);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setStudentToDeleteId(null);
  };

  const openEditModal = (student: StudentType) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setStudentToEdit(null);
    setIsEditModalOpen(false);
  };

  const handleAddStudent = async (newStudent: StudentType) => {

    if (newStudent.firstName === undefined || newStudent.lastName === undefined || newStudent.birthDate === undefined || newStudent.address === undefined || newStudent.email === undefined || newStudent.phone === undefined) {
      alert("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:9123/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newStudent),
      }).then((response) => response.json()
      );
      console.log(response)
      if (response) {
        showNotification("Student added successfully", "success");
        const studentsData = await fetch("http://localhost:9123/students").then(
          (response) => response.json(),
        );
        setStudents(studentsData);
      } else {
        showNotification("Failed to add student", "error");
      }
    } catch (error) {
      console.error("Error adding student:", error);
      showNotification("Failed to add student", "error");
    }
  };

  const handleDeleteStudent = async () => {
    if (!studentToDeleteId) return;

    try {
      const response = await fetch(
        `http://localhost:9123/students/${studentToDeleteId}`,
        {
          method: "DELETE",
        },
      );
      if (response.ok) {
        showNotification("Student deleted successfully", "success");
        setStudents((prevStudents: StudentType[]) =>
          prevStudents.filter((student) => student.id !== studentToDeleteId)
        );
      } else {
        showNotification("Failed to delete student", "error");
      }
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting student:", error);
      showNotification("Failed to delete student", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({message, type, isVisible: true});
    setTimeout(() => {
      setNotification((prevState) => ({...prevState, isVisible: false}));
    }, 5000);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Notification message={notification.message} type={notification.type}/>
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
            Students
            <div className="flex justify-end mr-3 mt-[-2rem]">
              <button
                onClick={openModalSearch}
                className="mr-2 block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="button"
              >
                Search Student
              </button>

              <button
                onClick={openModal}
                className="block text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                type="button"
              >
                Add Student
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
                Birth Date
              </th>
              <th className="py-3 px-5 border-b border-blue-gray-50">
                Address
              </th>
              <th className="py-3 px-5 border-b border-blue-gray-50">
                Email
              </th>
              <th className="py-3 px-5 border-b border-blue-gray-50">
                Phone
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
            {students.map(
              ({
                 id,
                 firstName,
                 lastName,
                 birthDate,
                 address,
                 email,
                 phone,
                 createdAt,
               }) => {
                const className = "py-3 px-5 border-b border-blue-gray-50";

                return (
                  <tr key={id}>
                    <td className={className}>{id}</td>
                    <td className={className}>{firstName}</td>
                    <td className={className}>{lastName}</td>
                    <td className={className}>
                      {new Date(birthDate!).toISOString().split("T")[0]}
                    </td>
                    <td className={className}>{address}</td>
                    <td className={className}>{email}</td>
                    <td className={className}>{phone}</td>
                    <td className={className}>{createdAt?.toString()}</td>
                    <td className={className}>
                      <button
                        onClick={() =>
                          openEditModal({
                            id,
                            firstName,
                            lastName,
                            birthDate,
                            address,
                            email,
                            phone,
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

      {/* Modals go here */}
      <ModalAdd
        isOpen={isModalOpen}
        onClose={closeModal}
        onAddStudent={handleAddStudent}
      />

      <ModalDelete
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onDelete={handleDeleteStudent}
      />

      <ModalSearch
        isOpen={isSearchModalOpen}
        onClose={closeModalSearch}
        onSearch={handleSearchStudent}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onEdit={async (editedStudent: StudentType) => {
          if (
            editedStudent.firstName === undefined ||
            editedStudent.lastName === undefined ||
            editedStudent.birthDate === undefined ||
            editedStudent.address === undefined ||
            editedStudent.email === undefined ||
            editedStudent.phone === undefined
          ) {
            alert("Please fill all fields");
            return;
          }

          try {
            const response = await fetch(
              `http://localhost:9123/students/${editedStudent.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(editedStudent),
              },
            );
            closeEditModal();
            if (response.ok) {
              showNotification("Student updated successfully", "success");
              const studentsData = await fetch(
                "http://localhost:9123/students",
              ).then((response) => response.json());
              setStudents(studentsData);
            } else {
              showNotification("Failed to update student", "error");
            }
          } catch (error) {
            console.error("Error updating student:", error);
            showNotification("Failed to update student", "error");
          }
        }}
        initialData={studentToEdit}
      />
    </div>
  );
};

