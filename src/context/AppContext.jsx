import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // --- DATABASE KEYS ---
  const USERS_KEY = 'launchpad_users_v2';
  const TASKS_KEY = 'launchpad_tasks_v2';
  const MEETINGS_KEY = 'launchpad_meetings_v2';
  const NOTIFICATIONS_KEY = 'launchpad_notifications_v2';
  const TIMELINE_KEY = 'launchpad_timeline_v2';

  const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%230891b2"><circle cx="12" cy="8" r="4"/><path d="M12 14c-6.1 0-8 4-8 4v2h16v-2s-1.9-4-8-4z"/></svg>`;

  // --- INITIAL DATA SEEDING ---
  const defaultUsers = [
    {
      id: "u1",
      name: 'Sarah Jenkins',
      email: 'sarah@internverse.com',
      password: 'password123',
      role: 'admin',
      phone: '+91 90123 45678',
      college: 'BITS Pilani',
      branch: 'Computer Science',
      skills: 'Product Management, System Architecture, Firebase',
      bio: 'Cohort Lead and Head Admin at InternVerse.',
      avatar: '',
      twoFactorEnabled: false
    },
    {
      id: "u2",
      name: 'Kirty Goswami',
      email: 'kirty@internverse.com',
      password: 'password123',
      role: 'mentor',
      phone: '+91 98765 43210',
      college: 'IIT Delhi',
      branch: 'Software Engineering',
      skills: 'React, Node.js, System Design',
      bio: 'Senior Technical Architect and Cohort Mentor.',
      avatar: '',
      twoFactorEnabled: false
    },
    {
      id: "u3",
      name: 'Aarav Sharma',
      email: 'aarav@internverse.com',
      password: 'password123',
      role: 'intern',
      phone: '+91 99988 77766',
      college: 'IIT Bombay',
      branch: 'Computer Engineering',
      skills: 'React.js, Node.js, SQL, Express.js',
      bio: 'Backend developer intern focused on scaling systems.',
      avatar: '',
      grade: '8.8/10',
      twoFactorEnabled: false
    },
    {
      id: "u4",
      name: 'Priya Patel',
      email: 'priya@internverse.com',
      password: 'password123',
      role: 'intern',
      phone: '+91 98877 66554',
      college: 'NID Ahmedabad',
      branch: 'Interaction Design',
      skills: 'Figma, Adobe XD, User Research',
      bio: 'Design intern creating engaging interface systems.',
      avatar: '',
      grade: '9.2/10',
      twoFactorEnabled: false
    },
    {
      id: "u5",
      name: 'Rohan Verma',
      email: 'rohan@internverse.com',
      password: 'password123',
      role: 'intern',
      phone: '+91 97766 55443',
      college: 'BITS Pilani',
      branch: 'Information Systems',
      skills: 'React, Tailwind CSS, Javascript',
      bio: 'Frontend enthusiast working on user dashboards.',
      avatar: '',
      grade: '8.0/10',
      twoFactorEnabled: false
    }
  ];

  const defaultTasks = [
    {
      id: 't1',
      project: 'Core API Integration',
      title: 'Refactor Backend API Middleware',
      description: 'Optimize Express.js route handlers and apply standardized security middleware headers.',
      assignTo: 'aarav@internverse.com',
      priority: 'High',
      status: 'Completed',
      dueDate: '2026-07-06',
      attachments: 'middleware_doc.pdf',
      tags: 'Express, Node.js',
      estimatedHours: '8',
      comments: [
        { sender: 'Kirty Goswami', text: 'Great structure, code matches review rules.', time: '1 day ago' }
      ]
    },
    {
      id: 't2',
      project: 'User Onboarding Flow',
      title: 'Design Figma User Flow',
      description: 'Design the interactive user registration and role verification wizard mockup in Figma.',
      assignTo: 'priya@internverse.com',
      priority: 'Medium',
      status: 'Review',
      dueDate: '2026-07-09',
      attachments: 'figma_link.txt',
      tags: 'Figma, UI-Design',
      estimatedHours: '12',
      comments: [
        { sender: 'Priya Patel', text: 'Submitted the figma prototypes, awaiting feedback.', time: '2 hours ago' }
      ]
    },
    {
      id: 't3',
      project: 'Database Optimization',
      title: 'Database Index Optimization',
      description: 'Analyze PostgreSQL EXPLAIN query profiles and introduce missing secondary indexes.',
      assignTo: 'rohan@internverse.com',
      priority: 'Medium',
      status: 'Assigned',
      dueDate: '2026-07-12',
      attachments: '',
      tags: 'SQL, Performance',
      estimatedHours: '6',
      comments: []
    }
  ];

  const defaultMeetings = [
    {
      id: 'm1',
      title: 'Sprint Retrospective & Demo Showcase',
      description: 'Discuss accomplishments, blockers, and demonstrate completed core API features.',
      date: '2026-07-08',
      time: '11:00 AM',
      host: 'kirty@internverse.com',
      joinLink: 'https://meet.google.com/xyz-abc-123'
    },
    {
      id: 'm2',
      title: 'Weekly UI Review Sync',
      description: 'Review Priya\'s user flow models and gather comments.',
      date: '2026-07-09',
      time: '03:30 PM',
      host: 'sarah@internverse.com',
      joinLink: 'https://meet.google.com/abc-mno-789'
    }
  ];

  const defaultNotifications = [
    {
      id: 'n1',
      type: 'Task Assigned',
      text: 'You have been assigned the task: Database Index Optimization.',
      targetEmail: 'rohan@internverse.com',
      time: '2 hours ago',
      read: false
    },
    {
      id: 'n2',
      type: 'Approval Request',
      text: 'Priya Patel submitted Figma User Flow for review.',
      targetEmail: 'kirty@internverse.com',
      time: '4 hours ago',
      read: false
    }
  ];

  const defaultTimeline = [
    { id: 'l1', type: 'Task Created', text: 'Task "Refactor Backend API Middleware" created by Kirty Goswami', time: '2026-07-05 10:15 AM' },
    { id: 'l2', type: 'Task Assigned', text: 'Task assigned to Aarav Sharma', time: '2026-07-05 10:20 AM' },
    { id: 'l3', type: 'Status Changed', text: 'Aarav Sharma moved task to "Completed"', time: '2026-07-06 05:30 PM' }
  ];

  // --- STATE DECLARATIONS ---
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser_v2');
    return saved ? JSON.parse(saved) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(TASKS_KEY);
    return saved ? JSON.parse(saved) : defaultTasks;
  });

  const [meetings, setMeetings] = useState(() => {
    const saved = localStorage.getItem(MEETINGS_KEY);
    return saved ? JSON.parse(saved) : defaultMeetings;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : defaultNotifications;
  });

  const [timeline, setTimeline] = useState(() => {
    const saved = localStorage.getItem(TIMELINE_KEY);
    return saved ? JSON.parse(saved) : defaultTimeline;
  });

  const [toasts, setToasts] = useState([]);

  // --- PERSISTENCE SYNCHRONIZATION ---
  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(MEETINGS_KEY, JSON.stringify(meetings));
  }, [meetings]);

  useEffect(() => {
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(TIMELINE_KEY, JSON.stringify(timeline));
  }, [timeline]);

  // --- MOCK DATABASE CONTROLLERS (Mimicking Supabase/Firebase) ---
  const triggerToast = (message, type = 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const loginUser = (email, password) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('currentUser_v2', JSON.stringify(found));
      triggerToast(`Welcome back, ${found.name}!`, 'success');
      return { success: true, user: found };
    }
    return { success: false, message: 'Invalid email or password credentials.' };
  };

  const logoutUser = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser_v2');
    triggerToast('Logged out successfully.', 'success');
  };

  const registerUser = (name, email, password, role) => {
    const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    const newUser = {
      id: 'u_' + Date.now(),
      name,
      email,
      password,
      role,
      phone: '',
      college: '',
      branch: '',
      skills: '',
      bio: '',
      avatar: '',
      twoFactorEnabled: false
    };
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    localStorage.setItem('currentUser_v2', JSON.stringify(newUser));
    triggerToast('Account registered successfully!', 'success');
    return { success: true, user: newUser };
  };

  const updateProfile = (profileData) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...profileData };
    
    // Update currentUser state
    setCurrentUser(updatedUser);
    localStorage.setItem('currentUser_v2', JSON.stringify(updatedUser));

    // Update in users array
    setUsers((prev) =>
      prev.map((u) => (u.email.toLowerCase() === currentUser.email.toLowerCase() ? updatedUser : u))
    );

    // Sync timeline
    addTimelineEntry('Profile Updated', `${currentUser.name} updated their profile settings.`);
    triggerToast('Profile updated successfully.', 'success');
  };

  const addTimelineEntry = (type, text) => {
    const entry = {
      id: 'l_' + Date.now(),
      type,
      text,
      time: new Date().toLocaleString()
    };
    setTimeline((prev) => [entry, ...prev]);
  };

  const addTask = (taskData) => {
    const newTask = {
      id: 't_' + Date.now(),
      comments: [],
      ...taskData
    };
    setTasks((prev) => [newTask, ...prev]);

    // Log Activity
    addTimelineEntry('Task Created', `Task "${taskData.title}" created for ${taskData.assignTo}.`);

    // Auto notify assignee
    const notifyText = `You have been assigned a new task: "${taskData.title}".`;
    addNotification('Task Assigned', notifyText, taskData.assignTo);

    triggerToast('Task created successfully!', 'success');
  };

  const updateTask = (taskId, fields) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const oldStatus = t.status;
          const newStatus = fields.status;
          if (newStatus && oldStatus !== newStatus) {
            addTimelineEntry(
              'Status Changed',
              `Task "${t.title}" status changed from ${oldStatus} to ${newStatus}.`
            );
            
            // Notify when task changes status
            addNotification(
              'Project Updates',
              `Task "${t.title}" status changed to ${newStatus}.`,
              t.assignTo
            );
          }
          return { ...t, ...fields };
        }
        return t;
      })
    );
  };

  const deleteTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      addTimelineEntry('Task Deleted', `Task "${task.title}" was deleted.`);
      triggerToast('Task deleted.', 'warning');
    }
  };

  const addTaskComment = (taskId, text) => {
    if (!currentUser) return;
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const newComment = {
            sender: currentUser.name,
            text,
            time: 'Just now'
          };
          return { ...t, comments: [...(t.comments || []), newComment] };
        }
        return t;
      })
    );
    addTimelineEntry('Comments', `${currentUser.name} added a comment to a task.`);
  };

  const addNotification = (type, text, targetEmail) => {
    const newNotif = {
      id: 'n_' + Date.now(),
      type,
      text,
      targetEmail,
      time: 'Just now',
      read: false
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markAllNotificationsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.targetEmail.toLowerCase() === currentUser.email.toLowerCase() ? { ...n, read: true } : n))
    );
    triggerToast('All notifications marked read.', 'success');
  };

  const deleteNotification = (notifId) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notifId));
  };

  const scheduleMeeting = (meetingData) => {
    const newMeeting = {
      id: 'm_' + Date.now(),
      host: currentUser ? currentUser.email : 'system@internverse.com',
      ...meetingData
    };
    setMeetings((prev) => [...prev, newMeeting]);
    addTimelineEntry('Meeting Scheduled', `Meeting "${meetingData.title}" scheduled for ${meetingData.date}.`);
    
    // Broadcast notifications to all users
    users.forEach((u) => {
      if (currentUser && u.email !== currentUser.email) {
        addNotification(
          'Meeting Invite',
          `Invite: "${meetingData.title}" on ${meetingData.date} at ${meetingData.time}.`,
          u.email
        );
      }
    });
    triggerToast('Meeting scheduled successfully!', 'success');
  };

  // --- ADMIN USER ACTIONS ---
  const manageUser = (userId, fields) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, ...fields } : u))
    );
    triggerToast('User details updated.', 'success');
  };

  const deleteUser = (userId) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    triggerToast('User removed from portal.', 'warning');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        defaultAvatar,
        tasks,
        meetings,
        notifications,
        timeline,
        toasts,
        triggerToast,
        loginUser,
        logoutUser,
        registerUser,
        updateProfile,
        addTask,
        updateTask,
        deleteTask,
        addTaskComment,
        markAllNotificationsRead,
        deleteNotification,
        scheduleMeeting,
        manageUser,
        deleteUser
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
