'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Users,
  ClipboardList,
  DollarSign,
  Leaf,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  MapPin,
  FileText,
  BarChart3
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { clients, appointments, tasks, transactions } from '@/lib/mockData';

export default function Dashboard() {
  const [activeView, setActiveView] = useState<'overview' | 'calendar' | 'clients' | 'tasks' | 'finances'>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i));

  const getTodayAppointments = () => {
    return appointments.filter(apt =>
      isSameDay(new Date(apt.date), new Date())
    );
  };

  const getUpcomingTasks = () => {
    return tasks
      .filter(t => t.status !== 'Completed')
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  };

  const getMonthlyRevenue = () => {
    return transactions
      .filter(t => t.type === 'Income' && t.status === 'Cleared')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getPendingIncome = () => {
    return transactions
      .filter(t => t.type === 'Income' && t.status === 'Pending')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getMonthlyExpenses = () => {
    return transactions
      .filter(t => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-light tracking-wide mb-2 gold-accent">
              Arboretum Console
            </h1>
            <p className="text-muted text-sm">Master Gardener's Office</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted">Today</p>
            <p className="text-xl font-light">{format(new Date(), 'EEEE, MMMM d, yyyy')}</p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="mb-8 glass-effect rounded-lg p-2">
        <div className="flex gap-2">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
            { id: 'clients', label: 'Estates', icon: Users },
            { id: 'tasks', label: 'Workflow', icon: ClipboardList },
            { id: 'finances', label: 'Accounts', icon: DollarSign },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md smooth-transition ${
                activeView === id
                  ? 'accent-gradient text-white'
                  : 'hover:bg-white/5 text-text-secondary'
              }`}
            >
              <Icon size={18} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      {activeView === 'overview' && (
        <div className="space-y-6 animate-fade-in">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              label="Active Estates"
              value={clients.length.toString()}
              subtitle={`${clients.filter(c => c.tier === 'Legacy').length} Legacy tier`}
              trend="+1 this month"
            />
            <StatCard
              icon={Calendar}
              label="This Week"
              value={appointments.filter(a => a.status === 'Scheduled').length.toString()}
              subtitle="Appointments"
              trend={`${getTodayAppointments().length} today`}
            />
            <StatCard
              icon={DollarSign}
              label="November Revenue"
              value={`$${(getMonthlyRevenue() / 1000).toFixed(1)}k`}
              subtitle={`$${getPendingIncome()} pending`}
              trend="+12% vs October"
            />
            <StatCard
              icon={ClipboardList}
              label="Active Tasks"
              value={tasks.filter(t => t.status !== 'Completed').length.toString()}
              subtitle={`${tasks.filter(t => t.priority === 'High').length} high priority`}
              trend="3 due this week"
            />
          </div>

          {/* Today's Schedule & Tasks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Today's Appointments */}
            <div className="card-gradient rounded-lg p-6 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 accent-gradient rounded-lg">
                  <Calendar className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Today's Schedule</h3>
                  <p className="text-sm text-muted">{format(new Date(), 'EEEE, MMMM d')}</p>
                </div>
              </div>
              <div className="space-y-4">
                {getTodayAppointments().length > 0 ? (
                  getTodayAppointments().map(apt => {
                    const client = clients.find(c => c.id === apt.clientId);
                    return (
                      <div key={apt.id} className="flex gap-4 p-4 bg-white/5 rounded-lg">
                        <div className="text-center min-w-[60px]">
                          <p className="text-sm text-muted">Time</p>
                          <p className="font-medium">{apt.time}</p>
                        </div>
                        <div className="flex-1 border-l border-white/10 pl-4">
                          <p className="font-medium">{client?.estateName}</p>
                          <p className="text-sm text-muted mt-1">{client?.name}</p>
                          <p className="text-xs text-muted mt-2">{apt.notes}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-muted">
                    <CheckCircle className="mx-auto mb-2" size={32} />
                    <p>No appointments scheduled for today</p>
                  </div>
                )}
              </div>
            </div>

            {/* Priority Tasks */}
            <div className="card-gradient rounded-lg p-6 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 accent-gradient rounded-lg">
                  <ClipboardList className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-medium">Priority Workflow</h3>
                  <p className="text-sm text-muted">Upcoming tasks</p>
                </div>
              </div>
              <div className="space-y-3">
                {getUpcomingTasks().map(task => (
                  <div key={task.id} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 smooth-transition">
                    <div className={`mt-1 p-1 rounded ${
                      task.priority === 'High' || task.priority === 'Urgent'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      <AlertCircle size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{task.title}</p>
                      <p className="text-xs text-muted mt-1">Due {format(new Date(task.dueDate), 'MMM d')}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      task.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-white/10 text-muted'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Estates & Financial Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Estate Overview */}
            <div className="lg:col-span-2 card-gradient rounded-lg p-6 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 accent-gradient rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-medium">Estate Portfolio</h3>
              </div>
              <div className="space-y-3">
                {clients.slice(0, 4).map(client => (
                  <div key={client.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 smooth-transition">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 accent-gradient rounded-lg flex items-center justify-center">
                        <Leaf className="text-white" size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{client.estateName}</p>
                        <p className="text-sm text-muted">{client.name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded text-xs font-medium ${
                        client.tier === 'Legacy'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : client.tier === 'Stewardship'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {client.tier}
                      </span>
                      <p className="text-xs text-muted mt-2">{client.acreage} acres</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Quick View */}
            <div className="card-gradient rounded-lg p-6 card-hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 accent-gradient rounded-lg">
                  <DollarSign className="text-white" size={20} />
                </div>
                <h3 className="text-lg font-medium">Financials</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted mb-2">November Revenue</p>
                  <p className="text-3xl font-light gold-accent">${getMonthlyRevenue().toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <TrendingUp size={14} className="text-green-400" />
                    <span className="text-xs text-green-400">+12% vs last month</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-muted">Pending</span>
                    <span className="text-sm font-medium">${getPendingIncome()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Expenses</span>
                    <span className="text-sm font-medium text-red-400">-${getMonthlyExpenses()}</span>
                  </div>
                </div>
                <div className="border-t border-white/10 pt-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Net</span>
                    <span className="text-lg font-medium gold-accent">
                      ${(getMonthlyRevenue() - getMonthlyExpenses()).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeView === 'calendar' && <CalendarView />}
      {activeView === 'clients' && <ClientsView />}
      {activeView === 'tasks' && <TasksView />}
      {activeView === 'finances' && <FinancesView />}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  subtitle,
  trend
}: {
  icon: any;
  label: string;
  value: string;
  subtitle: string;
  trend: string;
}) {
  return (
    <div className="card-gradient rounded-lg p-6 card-hover">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 accent-gradient rounded-lg">
          <Icon className="text-white" size={20} />
        </div>
        <span className="text-xs text-muted">{trend}</span>
      </div>
      <p className="text-muted text-sm mb-1">{label}</p>
      <p className="text-3xl font-light mb-2">{value}</p>
      <p className="text-xs text-muted">{subtitle}</p>
    </div>
  );
}

function CalendarView() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(selectedDate), i));

  return (
    <div className="animate-fade-in space-y-6">
      <div className="card-gradient rounded-lg p-6">
        <h2 className="text-2xl font-light mb-6">Seasonal Calendar</h2>
        <div className="grid grid-cols-7 gap-4">
          {weekDays.map((day, i) => {
            const dayAppointments = appointments.filter(apt =>
              isSameDay(new Date(apt.date), day)
            );
            return (
              <div key={i} className="text-center">
                <p className="text-sm text-muted mb-2">{format(day, 'EEE')}</p>
                <div className={`p-4 rounded-lg ${
                  isSameDay(day, new Date())
                    ? 'accent-gradient text-white'
                    : 'bg-white/5'
                }`}>
                  <p className="text-2xl font-light">{format(day, 'd')}</p>
                  {dayAppointments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {dayAppointments.map(apt => {
                        const client = clients.find(c => c.id === apt.clientId);
                        return (
                          <div key={apt.id} className="text-xs bg-black/20 rounded px-2 py-1">
                            {apt.time} - {client?.estateName}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card-gradient rounded-lg p-6">
        <h3 className="text-xl font-light mb-4">All Appointments</h3>
        <div className="space-y-3">
          {appointments.map(apt => {
            const client = clients.find(c => c.id === apt.clientId);
            return (
              <div key={apt.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 smooth-transition">
                <div className="text-center min-w-[80px]">
                  <p className="text-sm text-muted">{format(new Date(apt.date), 'MMM d')}</p>
                  <p className="font-medium">{apt.time}</p>
                </div>
                <div className="flex-1 border-l border-white/10 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{client?.estateName}</p>
                    <span className={`px-2 py-1 rounded text-xs ${
                      apt.status === 'Completed'
                        ? 'bg-green-500/20 text-green-400'
                        : apt.status === 'In Progress'
                        ? 'bg-blue-500/20 text-blue-400'
                        : 'bg-white/10 text-muted'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted">{apt.notes}</p>
                </div>
                <div className="text-right">
                  <Clock size={16} className="text-muted inline mr-1" />
                  <span className="text-sm text-muted">{apt.duration}h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClientsView() {
  return (
    <div className="animate-fade-in">
      <div className="card-gradient rounded-lg p-6">
        <h2 className="text-2xl font-light mb-6">Estate Portfolio</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white/5 rounded-lg p-6 hover:bg-white/10 smooth-transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-medium mb-1">{client.estateName}</h3>
                  <p className="text-muted">{client.name}</p>
                </div>
                <span className={`px-3 py-1 rounded text-sm font-medium ${
                  client.tier === 'Legacy'
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : client.tier === 'Stewardship'
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                }`}>
                  {client.tier}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-muted" />
                  <span className="text-muted">{client.address}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-muted" />
                    <span>{client.acreage} acres</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span>Last visit: {format(new Date(client.lastVisit), 'MMM d')}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <p className="text-sm text-muted mb-2">Estate Notes</p>
                <p className="text-sm">{client.notes}</p>
              </div>

              <div className="border-t border-white/10 mt-4 pt-4 flex justify-between items-center">
                <div>
                  <p className="text-xs text-muted">Annual Retainer</p>
                  <p className="text-lg font-medium gold-accent">${client.retainerValue.toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Account Balance</p>
                  <p className="text-lg font-medium">${client.accountBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TasksView() {
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {} as Record<string, typeof tasks>);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-light">Workflow Management</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm">
            {tasks.filter(t => t.priority === 'High' || t.priority === 'Urgent').length} High Priority
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm">
            {tasks.filter(t => t.status === 'In Progress').length} In Progress
          </span>
        </div>
      </div>

      {Object.entries(tasksByCategory).map(([category, categoryTasks]) => (
        <div key={category} className="card-gradient rounded-lg p-6">
          <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
            <FileText size={18} className="text-muted" />
            {category}
          </h3>
          <div className="space-y-3">
            {categoryTasks.map(task => {
              const client = task.clientId ? clients.find(c => c.id === task.clientId) : null;
              return (
                <div key={task.id} className="flex items-start gap-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 smooth-transition">
                  <div className={`mt-1 p-2 rounded ${
                    task.priority === 'Urgent'
                      ? 'bg-red-500/30 text-red-400'
                      : task.priority === 'High'
                      ? 'bg-red-500/20 text-red-400'
                      : task.priority === 'Medium'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    <AlertCircle size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{task.title}</h4>
                        {client && <p className="text-sm text-muted mt-1">{client.estateName}</p>}
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${
                        task.status === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : task.status === 'In Progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-white/10 text-muted'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted mb-3">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted">
                      <span>Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}</span>
                      <span>Est. {task.estimatedHours}h</span>
                      {task.actualHours && <span className="text-green-400">Actual: {task.actualHours}h</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function FinancesView() {
  const income = transactions.filter(t => t.type === 'Income');
  const expenses = transactions.filter(t => t.type === 'Expense');
  const totalIncome = income.filter(t => t.status === 'Cleared').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-gradient rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Total Income</p>
          <p className="text-3xl font-light gold-accent mb-2">${totalIncome.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-green-400" />
            <span className="text-xs text-green-400">+12% this month</span>
          </div>
        </div>
        <div className="card-gradient rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Total Expenses</p>
          <p className="text-3xl font-light text-red-400 mb-2">${totalExpenses.toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">Within budget</span>
          </div>
        </div>
        <div className="card-gradient rounded-lg p-6">
          <p className="text-sm text-muted mb-2">Net Revenue</p>
          <p className="text-3xl font-light gold-accent mb-2">${(totalIncome - totalExpenses).toLocaleString()}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">November 2025</span>
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Income */}
        <div className="card-gradient rounded-lg p-6">
          <h3 className="text-xl font-light mb-4 flex items-center gap-2">
            <TrendingUp className="text-green-400" size={20} />
            Income
          </h3>
          <div className="space-y-3">
            {income.map(transaction => {
              const client = transaction.clientId ? clients.find(c => c.id === transaction.clientId) : null;
              return (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{transaction.description}</p>
                    {client && <p className="text-sm text-muted">{client.estateName}</p>}
                    <p className="text-xs text-muted mt-1">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-medium text-green-400">+${transaction.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      transaction.status === 'Cleared'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses */}
        <div className="card-gradient rounded-lg p-6">
          <h3 className="text-xl font-light mb-4 flex items-center gap-2">
            <DollarSign className="text-red-400" size={20} />
            Expenses
          </h3>
          <div className="space-y-3">
            {expenses.map(transaction => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted">{transaction.category}</p>
                  <p className="text-xs text-muted mt-1">{format(new Date(transaction.date), 'MMM d, yyyy')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-medium text-red-400">-${transaction.amount}</p>
                  <span className={`text-xs px-2 py-1 rounded ${
                    transaction.status === 'Cleared'
                      ? 'bg-white/10 text-muted'
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
