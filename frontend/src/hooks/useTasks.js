import { useState, useCallback, useEffect } from 'react';
import { taskAPI } from '../utils/api';
import toast from 'react-hot-toast';

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, limit: 10 });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const fetchTasks = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const queryParams = { ...filters, ...params };
      // Clean 'all' values
      if (queryParams.status === 'all') delete queryParams.status;
      if (queryParams.priority === 'all') delete queryParams.priority;
      if (!queryParams.search) delete queryParams.search;

      const { data } = await taskAPI.getTasks(queryParams);
      setTasks(data.tasks);
      setStats(data.stats);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = useCallback(async (taskData) => {
    try {
      const { data } = await taskAPI.createTask(taskData);
      toast.success(data.message || 'Task created!');
      fetchTasks();
      return { success: true, task: data.task };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create task.';
      toast.error(message);
      return { success: false, message };
    }
  }, [fetchTasks]);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const { data } = await taskAPI.updateTask(id, taskData);
      toast.success(data.message || 'Task updated!');
      fetchTasks();
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update task.';
      toast.error(message);
      return { success: false, message };
    }
  }, [fetchTasks]);

  const toggleTask = useCallback(async (id) => {
    // Optimistic update
    setTasks(prev => prev.map(t =>
      t._id === id ? { ...t, status: t.status === 'pending' ? 'completed' : 'pending' } : t
    ));
    try {
      const { data } = await taskAPI.toggleTask(id);
      toast.success(data.message || 'Task updated!');
      fetchTasks();
    } catch (err) {
      fetchTasks(); // Revert on failure
      toast.error('Failed to update task status.');
    }
  }, [fetchTasks]);

  const deleteTask = useCallback(async (id) => {
    try {
      const { data } = await taskAPI.deleteTask(id);
      toast.success(data.message || 'Task deleted!');
      fetchTasks();
      return { success: true };
    } catch (err) {
      toast.error('Failed to delete task.');
      return { success: false };
    }
  }, [fetchTasks]);

  const clearCompleted = useCallback(async () => {
    try {
      const { data } = await taskAPI.clearCompleted();
      toast.success(data.message);
      fetchTasks();
    } catch (err) {
      toast.error('Failed to clear completed tasks.');
    }
  }, [fetchTasks]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const setPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  return {
    tasks, stats, pagination, loading, filters,
    fetchTasks, createTask, updateTask, toggleTask, deleteTask,
    clearCompleted, updateFilters, setPage
  };
};

export default useTasks;
