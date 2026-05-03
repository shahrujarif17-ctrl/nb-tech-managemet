import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Task, User } from '../types';
import { supabase } from '../lib/supabase';

interface AppContextType {
  tasks: Task[];
  users: User[];
  loading: boolean;
  addTask: (taskData: Partial<Task>) => Promise<{ success: boolean; error?: string; emailStatus?: string }>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<boolean>;
  deleteTask: (id: string) => Promise<boolean>;
  updateUser: (id: string, updates: Partial<User>) => Promise<boolean>;
  addEmployee: (employeeData: Partial<User>) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  currentUser: User | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // Initial Auth Check
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setIsAuthenticated(true);
        fetchProfile(session.user.id);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsAuthenticated(true);
        fetchProfile(session.user.id);
      } else {
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (data && !error) {
      setCurrentUser(data);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Tasks (Safely)
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*') // Fetch base tasks first to avoid relationship errors
        .order('created_at', { ascending: false });

      if (!tasksError && tasksData) {
        const transformedTasks = tasksData.map((t: any) => ({
          ...t,
          assignedTo: t.assigned_to,
          startDate: t.start_date,
          dueDate: t.due_date,
          completionPercentage: t.completion_percentage,
          problemReports: [] // Initialize empty for now
        }));
        setTasks(transformedTasks);
      } else if (tasksError) {
        console.error('Task fetch error:', tasksError);
      }

      // 2. Fetch Profiles (Independent of tasks)
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (!profilesError && profilesData) {
        console.log(`[Data Fetch] Successfully found ${profilesData.length} profiles.`);
        setUsers(profilesData);
      } else if (profilesError) {
        console.error('Profile fetch error:', profilesError);
      }

    } catch (err) {
      console.error('Critical fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const addTask = async (taskData: any) => {
    const { error } = await supabase
      .from('tasks')
      .insert([{
        title: taskData.title,
        description: taskData.description,
        client: taskData.client,
        status: taskData.status,
        priority: taskData.priority,
        assigned_to: taskData.assignedTo,
        due_date: taskData.dueDate,
        start_date: taskData.startDate || new Date().toISOString(),
        completion_percentage: taskData.completionPercentage || 0,
        created_by: currentUser?.id
      }]);
    
    if (error) {
      console.error('Error adding task:', error);
      return { success: false, error: error.message };
    }
    
    // Trigger Notifications (Safe Call)
    let emailStatus = 'Not sent';
    if (taskData.assignedTo) {
      const assignedUser = users.find(u => u.id === taskData.assignedTo);
      if (assignedUser) {
        try {
          const { error: funcError } = await supabase.functions.invoke('send-task-notification', {
            body: { user: assignedUser, task: { title: taskData.title, dueDate: taskData.dueDate } }
          });
          if (funcError) throw funcError;
          emailStatus = 'Sent successfully';
        } catch (err: any) {
          console.error('Notification failed:', err);
          emailStatus = `Failed to send: ${err.message}`;
        }
      }
    }

    await fetchData(); // Refresh list
    return { success: true, emailStatus };
  };

  const updateTask = async (id: string, updates: any) => {
    const mappedUpdates: any = { ...updates };
    if (updates.assignedTo) mappedUpdates.assigned_to = updates.assignedTo;
    if (updates.startDate) mappedUpdates.start_date = updates.startDate;
    if (updates.dueDate) mappedUpdates.due_date = updates.dueDate;
    if (updates.completionPercentage !== undefined) mappedUpdates.completion_percentage = updates.completionPercentage;
    
    // Remove camelCase fields to avoid Supabase errors
    delete mappedUpdates.assignedTo;
    delete mappedUpdates.startDate;
    delete mappedUpdates.dueDate;
    delete mappedUpdates.completionPercentage;
    delete mappedUpdates.problemReports; // Handled separately or ignored for now

    const { error } = await supabase
      .from('tasks')
      .update(mappedUpdates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating task:', error);
      return false;
    }
    await fetchData();
    return true;
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting task:', error);
      return false;
    }
    fetchData();
    return true;
  };

  const updateUser = async (id: string, updates: any) => {
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }
    
    // Refresh both the global users list and the specific currentUser object
    await fetchData();
    if (currentUser?.id === id) {
      await fetchProfile(id);
    }
    return true;
  };

  const addEmployee = async (employeeData: any) => {
    const { error } = await supabase
      .from('profiles')
      .insert([{
        id: crypto.randomUUID(), // Generate a unique ID for the profile
        name: employeeData.name,
        email: employeeData.email,
        role: employeeData.role,
        department: employeeData.department,
        phone: employeeData.phone,
        avatar: employeeData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeData.name)}&background=random`
      }]);

    if (error) {
      console.error('Error adding employee:', error);
      let friendlyError = error.message;
      if (error.message.includes('unique constraint') && error.message.includes('email')) {
        friendlyError = 'An employee with this email already exists in your directory.';
      }
      return { success: false, error: friendlyError };
    }
    await fetchData();
    return { success: true };
  };

  return (
    <AppContext.Provider value={{ 
      tasks, 
      users, 
      loading, 
      addTask, 
      updateTask, 
      deleteTask, 
      updateUser, 
      addEmployee,
      isAuthenticated, 
      currentUser,
      login, 
      logout 
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
