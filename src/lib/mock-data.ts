
export type Category = 'Complaint' | 'Recommendation' | 'Academic Concern' | 'Facilities Issue' | 'Appreciation';
export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'Reviewing' | 'Resolved';

export interface Suggestion {
  id: string;
  studentName?: string;
  studentRegNo?: string;
  department: string;
  category: Category;
  title: string;
  message: string;
  priority: Priority;
  isAnonymous: boolean;
  submittedAt: string;
  status: Status;
}

export const DEPARTMENTS = [
  'Faculty of Science & Technology',
  'Faculty of Business & Management',
  'Faculty of Law',
  'Faculty of Social Sciences',
  'Faculty of Health Sciences'
];

export const CATEGORIES: Category[] = [
  'Complaint',
  'Recommendation',
  'Academic Concern',
  'Facilities Issue',
  'Appreciation'
];

export const INITIAL_SUGGESTIONS: Suggestion[] = [
  {
    id: '1',
    studentName: 'John Doe',
    studentRegNo: 'CU/2023/1001',
    department: 'Faculty of Science & Technology',
    category: 'Recommendation',
    title: 'Extend Library Hours',
    message: 'I suggest extending the library hours during exams to 10 PM to allow students more study time.',
    priority: 'Medium',
    isAnonymous: false,
    submittedAt: '2023-11-20T10:30:00Z',
    status: 'Resolved'
  },
  {
    id: '2',
    studentRegNo: 'CU/2023/2045',
    department: 'Faculty of Health Sciences',
    category: 'Facilities Issue',
    title: 'Faulty AC in Block B',
    message: 'The air conditioning in lecture room B12 has not been working for the past week. It gets very hot.',
    priority: 'High',
    isAnonymous: true,
    submittedAt: '2023-11-21T14:15:00Z',
    status: 'Pending'
  },
  {
    id: '3',
    studentName: 'Sarah Smith',
    studentRegNo: 'CU/2023/5021',
    department: 'Faculty of Social Sciences',
    category: 'Appreciation',
    title: 'Excellent Career Fair',
    message: 'The career fair held last Friday was incredibly helpful. Thank you for the opportunity!',
    priority: 'Low',
    isAnonymous: false,
    submittedAt: '2023-11-22T09:00:00Z',
    status: 'Reviewing'
  }
];
