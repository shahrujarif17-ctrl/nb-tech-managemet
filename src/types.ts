export type Role = 'admin' | 'employee';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  department?: string;
  phone?: string;
};

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export type Comment = {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
};

export type ProblemReport = {
  id: string;
  userId: string;
  description: string;
  createdAt: string;
  resolved: boolean;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  client?: string;    // Client Name
  assignedTo: string; // User ID
  reportTo: string;   // User ID
  createdBy: string;  // User ID
  status: TaskStatus;
  priority: TaskPriority;
  completionPercentage: number; // 0-100
  startDate: string;
  dueDate: string;
  comments: Comment[];
  problemReports: ProblemReport[];
  attachments: string[]; // Mock file URLs or names
};
