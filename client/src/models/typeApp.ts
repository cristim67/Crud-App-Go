export type ProfessorType = {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  createdAt?: Date;
};

export type SubjectType = {
  id: string;
  subjectName?: string;
  subjectDescription?: string;
  professorId?: string;
  createdAt?: Date;
};

export type StudentType = {
  id: string;
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  address?: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
};

export type RegisterStudentSubjectType = {
  id: string;
  studentId?: string;
  subjectId?: string;
  grade?: number;
  dateRegistered?: Date;
  createdAt?: Date;
};
