export interface Thesis {
  id: string;
  title: string;
  description: string;
  supervisor: {
    id: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    expertise: string;
  };
  status: string;
  deadline: string;
  objectives: string;
  requirements: string;
  progress?: number;
  createdAt: string;
}
