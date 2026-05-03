import type { Task, User } from './types';
import { addDays, subDays } from 'date-fns';

const today = new Date();

export const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Fardin Rahman',
    email: 'fardin@nbtech.com',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?u=u1',
    department: 'Management'
  },
  {
    id: 'u2',
    name: 'Siam Mastan',
    email: 'siam@nbtech.com',
    role: 'employee',
    avatar: 'https://i.pravatar.cc/150?u=u2',
    department: 'Engineering'
  },
  {
    id: 'u3',
    name: 'Lafid Akmal',
    email: 'lafid@nbtech.com',
    role: 'employee',
    avatar: 'https://i.pravatar.cc/150?u=u3',
    department: 'Design'
  },
  {
    id: 'u4',
    name: 'Mathin M Shahriar',
    email: 'mathin@nbtech.com',
    role: 'employee',
    avatar: 'https://i.pravatar.cc/150?u=u4',
    department: 'Marketing'
  },
  {
    id: 'u5',
    name: 'Muhit S Jarif',
    email: 'muhit@nbtech.com',
    role: 'employee',
    avatar: 'https://i.pravatar.cc/150?u=u5',
    department: 'Sales'
  }
];

export const mockTasks: Task[] = [
  {
    id: 't1',
    title: 'Redesign Landing Page',
    description: 'Create a new modern landing page design matching the new brand guidelines. Use vibrant colors and dynamic animations.',
    client: 'BloomBangla',
    assignedTo: 'u3',
    reportTo: 'u1',
    createdBy: 'u1',
    status: 'in-progress',
    priority: 'high',
    completionPercentage: 65,
    startDate: subDays(today, 5).toISOString(),
    dueDate: addDays(today, 2).toISOString(),
    comments: [
      {
        id: 'c1',
        userId: 'u1',
        content: 'Please make sure to check the latest Figma file.',
        createdAt: subDays(today, 4).toISOString()
      }
    ],
    problemReports: [],
    attachments: ['design-brief.pdf', 'brand-assets.zip']
  },
  {
    id: 't2',
    title: 'Implement Authentication API',
    description: 'Build JWT based authentication for the new employee portal.',
    client: 'Roy Agro',
    assignedTo: 'u2',
    reportTo: 'u1',
    createdBy: 'u1',
    status: 'todo',
    priority: 'critical',
    completionPercentage: 0,
    startDate: today.toISOString(),
    dueDate: addDays(today, 7).toISOString(),
    comments: [],
    problemReports: [],
    attachments: []
  },
  {
    id: 't3',
    title: 'Q2 Marketing Campaign Setup',
    description: 'Prepare social media posts and email templates for the Q2 launch.',
    client: 'Abloom',
    assignedTo: 'u4',
    reportTo: 'u1',
    createdBy: 'u1',
    status: 'review',
    priority: 'medium',
    completionPercentage: 90,
    startDate: subDays(today, 10).toISOString(),
    dueDate: subDays(today, 1).toISOString(), // Overdue
    comments: [],
    problemReports: [
      {
        id: 'pr1',
        userId: 'u4',
        description: 'Waiting on final copy from the copywriter, cannot proceed without it.',
        createdAt: subDays(today, 2).toISOString(),
        resolved: false
      }
    ],
    attachments: ['campaign-assets.zip']
  },
  {
    id: 't4',
    title: 'Update Privacy Policy',
    description: 'Review and update the privacy policy to comply with new regulations.',
    client: 'Magura Group',
    assignedTo: 'u1',
    reportTo: 'u1',
    createdBy: 'u1',
    status: 'done',
    priority: 'low',
    completionPercentage: 100,
    startDate: subDays(today, 20).toISOString(),
    dueDate: subDays(today, 5).toISOString(),
    comments: [],
    problemReports: [],
    attachments: ['privacy_policy_v2.docx']
  }
];
