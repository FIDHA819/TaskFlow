import React, { useState, useCallback, useRef } from 'react';
import {
  FiPlus, FiSearch, FiLogOut, FiCheckSquare, FiSquare,
  FiList, FiChevronLeft, FiChevronRight, FiTrash2, FiRefreshCw
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import TaskModal from '../components/TaskModal';
import TaskItem from '../components/TaskItem';
import ConfirmDialog from '../components/ConfirmDialog';


const Dashboard = () => {
  const { user, logout } = useAuth();
  const {
    tasks, stats, pagination, loading, filters,
    createTask, updateTask, toggleTask, deleteTask,
    clearCompleted, updateFilters, setPage
  } = useTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const searchTimeout = useRef(null);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatToday = () => new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  const handleSearch = useCallback((e) => {
    const val = e.target.value;
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      updateFilters({ search: val });
    }, 350);
  }, [updateFilters]);

  const handleOpenAdd = () => { setEditTask(null); setModalOpen(true); };
  const handleOpenEdit = (task) => { setEditTask(task); setModalOpen(true); };
  const handleCloseModal = () => { setModalOpen(false); setEditTask(null); };

  const handleSubmitTask = async (formData) => {
    setActionLoading(true);
    let result;
    if (editTask) {
      result = await updateTask(editTask._id, formData);
    } else {
      result = await createTask(formData);
    }
    setActionLoading(false);
    if (result.success) handleCloseModal();
  };

  const handleDeleteConfirm = async () => {
    setActionLoading(true);
    await deleteTask(deleteId);
    setActionLoading(false);
    setDeleteId(null);
  };

  const handleClearConfirm = async () => {
    setActionLoading(true);
    await clearCompleted();
    setActionLoading(false);
    setClearConfirm(false);
  };

  const completionPct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <div className="dashboard">
      {/* Navbar */}
    

<nav className="navbar">
  <div className="navbar-brand">
    <div className="navbar-brand-icon">
      <img
  src="/logo.png"
  alt="TaskFlow Logo"
  style={{ width: 24, height: 24 }}
/>
    </div>
    <span className="navbar-brand-name">TaskFlow</span>
  </div>

  <div className="navbar-user">
    <div className="user-info">
      <span className="user-name">{user?.name}</span>
      <span className="user-email">{user?.email}</span>
    </div>

    <div className="user-avatar">
      {user?.name?.charAt(0).toUpperCase()}
    </div>

    <button
      className="btn btn-secondary btn-sm"
      onClick={logout}
      title="Sign out"
    >
      <FiLogOut size={15} /> Sign out
    </button>
  </div>
</nav>

      {/* Content */}
      <main className="dashboard-content">
        {/* Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-greeting">{getGreeting()}, {user?.name?.split(' ')[0]} 👋</h1>
          <p className="dashboard-date">{formatToday()}</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon total"><FiList /></div>
            <div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total tasks</div>
              {stats.total > 0 && (
                <>
                  <div className="progress-bar-wrap" style={{ marginTop: 10, width: 120 }}>
                    <div className="progress-bar-fill" style={{ width: `${completionPct}%` }} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    {completionPct}% complete
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed"><FiCheckSquare /></div>
            <div>
              <div className="stat-value">{stats.completed}</div>
              <div className="stat-label">Completed</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending"><FiSquare /></div>
            <div>
              <div className="stat-value">{stats.pending}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>
        </div>

        {/* Task Panel */}
        <div className="task-panel">
          <div className="task-panel-header">
            <h2 className="task-panel-title">My Tasks</h2>
            <div className="task-panel-actions">
              {/* Search */}
              <div className="search-bar">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search tasks..."
                  defaultValue={filters.search}
                  onChange={handleSearch}
                />
              </div>

              {/* Filters */}
              <select
                className="filter-select"
                value={filters.status}
                onChange={(e) => updateFilters({ status: e.target.value })}
              >
                <option value="all">All status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>

              <select
                className="filter-select"
                value={filters.priority}
                onChange={(e) => updateFilters({ priority: e.target.value })}
              >
                <option value="all">All priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                className="filter-select"
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split(':');
                  updateFilters({ sortBy, sortOrder });
                }}
              >
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
                <option value="priority:desc">Priority (high)</option>
                <option value="dueDate:asc">Due date</option>
              </select>

              {stats.completed > 0 && (
                <button className="btn btn-secondary btn-sm" onClick={() => setClearConfirm(true)} title="Clear all completed tasks">
                  <FiTrash2 size={14} /> Clear done
                </button>
              )}

              <button className="btn btn-primary btn-sm" onClick={handleOpenAdd}>
                <FiPlus size={16} /> New task
              </button>
            </div>
          </div>

          {/* Task List */}
          <div className="task-list">
            {loading ? (
              <div className="task-loading">
                <FiRefreshCw className="spinning" />
                <span>Loading tasks...</span>
              </div>
            ) : tasks.length === 0 ? (
              <div className="task-empty">
                <div className="task-empty-icon">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all' ? '🔍' : '📋'}
                </div>
                <h3 className="task-empty-title">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                    ? 'No tasks match your filters'
                    : 'No tasks yet'}
                </h3>
                <p className="task-empty-text">
                  {filters.search || filters.status !== 'all' || filters.priority !== 'all'
                    ? 'Try adjusting your search or filters.'
                    : 'Create your first task to get started!'}
                </p>
                {!(filters.search || filters.status !== 'all' || filters.priority !== 'all') && (
                  <button className="btn btn-primary" onClick={handleOpenAdd}>
                    <FiPlus size={16} /> Create a task
                  </button>
                )}
              </div>
            ) : (
              tasks.map(task => (
                <TaskItem
                  key={task._id}
                  task={task}
                  onToggle={toggleTask}
                  onEdit={handleOpenEdit}
                  onDelete={(id) => setDeleteId(id)}
                />
              ))
            )}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="pagination">
              <span className="pagination-info">
                Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
              </span>
              <div className="pagination-buttons">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(pagination.page - 1)}
                  disabled={!pagination.hasPrev}
                >
                  <FiChevronLeft />
                </button>
                {Array.from({ length: Math.min(pagination.pages, 7) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                      onClick={() => setPage(page)}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  className="pagination-btn"
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={!pagination.hasNext}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      <TaskModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitTask}
        task={editTask}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete task"
        message="This task will be permanently deleted. This action cannot be undone."
        confirmText="Delete task"
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={clearConfirm}
        onClose={() => setClearConfirm(false)}
        onConfirm={handleClearConfirm}
        title="Clear completed"
        message={`This will permanently delete all ${stats.completed} completed task(s). This action cannot be undone.`}
        confirmText="Clear all completed"
        loading={actionLoading}
      />
    </div>
  );
};

export default Dashboard;
