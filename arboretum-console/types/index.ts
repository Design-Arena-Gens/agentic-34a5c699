export interface Client {
  id: string;
  name: string;
  estateName: string;
  address: string;
  phone: string;
  email: string;
  tier: 'Foundation' | 'Stewardship' | 'Legacy';
  acreage: number;
  joinDate: string;
  lastVisit: string;
  notes: string;
  accountBalance: number;
  retainerValue: number;
}

export interface Estate {
  id: string;
  clientId: string;
  name: string;
  zones: Zone[];
  soilType: string;
  irrigationSystem: string;
  annualPlan: string;
}

export interface Zone {
  id: string;
  name: string;
  area: number;
  plantingType: string;
  lastMaintenance: string;
  nextScheduled: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  category: 'Planting' | 'Maintenance' | 'Analysis' | 'Design' | 'Planning';
  duration: number;
  basePrice: number;
}

export interface Appointment {
  id: string;
  clientId: string;
  estateId: string;
  serviceId: string;
  date: string;
  time: string;
  duration: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  notes: string;
  workLog?: string;
  photos?: string[];
  videos?: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate: string;
  clientId?: string;
  estateId?: string;
  estimatedHours: number;
  actualHours?: number;
  category: string;
}

export interface Transaction {
  id: string;
  type: 'Income' | 'Expense';
  amount: number;
  date: string;
  clientId?: string;
  category: string;
  description: string;
  status: 'Pending' | 'Cleared';
  invoiceNumber?: string;
}

export interface SeasonalPlan {
  id: string;
  season: 'Spring' | 'Summer' | 'Fall' | 'Winter';
  year: number;
  clientId: string;
  estateId: string;
  tasks: string[];
  goals: string[];
  budget: number;
  status: 'Draft' | 'Active' | 'Completed';
}
