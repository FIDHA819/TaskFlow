import React from 'react';
import { FiEdit2, FiTrash2, FiCheck, FiCalendar } from 'react-icons/fi';

const priorityLabels = { high: 'High', medium: 'Medium', low: 'Low' };

const TaskItem = ({ task, onToggle, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const isOverdue = date < now && !isCompleted;
    return {
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      isOverdue
    };
  };

  const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric'
  });

  const dueInfo = task.dueDate ? formatDate(task.dueDate) : null;

  return (
    <div className={`task-item ${isCompleted ? 'completed' : ''}`}>
      <button
        className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
        onClick={() => onToggle(task._id)}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
      >
        {isCompleted && <FiCheck size={12} strokeWidth={3} />}
      </button>

      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.description && (
          <div className="task-description">{task.description}</div>
        )}
        <div className="task-meta">
          <span className={`tag tag-priority-${task.priority}`}>
            {task.priority === 'high' ? '↑' : task.priority === 'low' ? '↓' : '→'} {priorityLabels[task.priority]}
          </span>
          <span className={`tag tag-status-${task.status}`}>
            {isCompleted ? '✓' : '○'} {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
          </span>
          {dueInfo && (
            <span className="task-date" style={{ color: dueInfo.isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
              <FiCalendar size={11} />
              {dueInfo.isOverdue && 'Overdue · '}{dueInfo.label}
            </span>
          )}
          <span className="task-date">Added {createdDate}</span>
        </div>
      </div>

      <div className="task-actions">
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => onEdit(task)}
          title="Edit task"
          style={{ fontSize: 15 }}
        >
          <FiEdit2 />
        </button>
        <button
          className="btn btn-ghost btn-icon"
          onClick={() => onDelete(task._id)}
          title="Delete task"
          style={{ fontSize: 15, color: 'var(--danger)', '--ghost-hover-bg': 'var(--danger-light)' }}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
