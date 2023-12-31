import { AcademicCapIcon } from "@heroicons/react/24/solid";
import { UsersIcon } from "@heroicons/react/24/solid";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { Students } from "./pages/dashboard/students.tsx";
import { Subjects } from "./pages/dashboard/subjects.tsx";
import { Professors } from "./pages/dashboard/professors.tsx";
import { RegisterStudentSubjects } from "./pages/dashboard/registerStudentSubjects.tsx";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UsersIcon {...icon} />,
        name: "Students",
        path: "/students",
        element: <Students />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <UsersIcon {...icon} />,
        name: "Professors",
        path: "/professors",
        element: <Professors />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <BookOpenIcon {...icon} />,
        name: "Subjects",
        path: "/subjects",
        element: <Subjects />,
      },
    ],
  },
  {
    layout: "dashboard",
    pages: [
      {
        icon: <AcademicCapIcon {...icon} />,
        name: "RegisterStudentSubject",
        path: "/registerStudentSubject",
        element: <RegisterStudentSubjects />,
      },
    ],
  },
];

export default routes;
