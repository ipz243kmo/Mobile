import React, { createContext, useContext, useState } from 'react';

const AdminContext = createContext(null);

const STATUSES = ['Опубліковано', 'Чернетка', 'На перевірці'];
const CATEGORIES = ['Освіта та наука', 'Кібербезпека', 'Студентське життя', 'Міжнародна співпраця'];
const ROLES = ['Адміністратор', 'Редактор', 'Модератор', 'Автор'];

const INITIAL_NEWS = Array.from({ length: 55 }, (_, i) => {
  const id = String(i + 1);
  return {
    id,
    title: `Новина порталу #${id}: Інноваційні проєкти Житомирської політехніки`,
    category: CATEGORIES[i % CATEGORIES.length],
    status: STATUSES[i % STATUSES.length],
    imageUrl: `https://picsum.photos/seed/lab3news${id}/600/320`,
    content: `Повний текст новини №${id}.\n\nДержавний університет «Житомирська політехніка» впроваджує сучасні освітні технології, розвиває наукові лабораторії та підтримує студентські стартапи.`,
    createdAt: `${(i % 28) + 1}.11.2026`,
  };
});

const INITIAL_USERS = Array.from({ length: 55 }, (_, i) => {
  const id = String(i + 1);
  return {
    id,
    name: i === 0 ? 'Куліш Марія Олександрівна' : `Користувач Системи #${id}`,
    email: i === 0 ? 'ipz243_kmo@student.ztu.edu.ua' : `user${id}@student.ztu.edu.ua`,
    role: ROLES[i % ROLES.length],
    status: i % 4 === 0 ? 'Заблокований' : 'Активний',
  };
});

const INITIAL_LOGS = Array.from({ length: 55 }, (_, i) => ({
  id: String(i + 1),
  action: 'Ініціалізація системного запису',
  details: `Автоматичний аудит події №${i + 1}`,
  timestamp: `21.11.2026 10:${String(i % 60).padStart(2, '0')}`,
}));

export function AdminProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState({
    name: 'Куліш Марія Олександрівна',
    email: 'ipz243_kmo@student.ztu.edu.ua',
  });

  const [news, setNews] = useState(INITIAL_NEWS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [logs, setLogs] = useState(INITIAL_LOGS);

  const [newsFilter, setNewsFilter] = useState({ status: 'Усі', category: 'Усі' });
  const [userFilter, setUserFilter] = useState({ status: 'Усі' });

  const addLog = (action, details) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog = {
      id: String(Date.now() + Math.random()),
      action,
      details,
      timestamp: `21.11.2026 ${timeStr}`,
    };
    setLogs((prev) => [newLog, ...prev]);
  };

  const login = (email) => {
    const cleanEmail = email?.trim() || 'ipz243_kmo@student.ztu.edu.ua';
    setAdminUser({ name: 'Куліш Марія Олександрівна', email: cleanEmail });
    setIsAuthenticated(true);
    addLog('Вхід у систему', `Адміністратор ${cleanEmail} виконав вхід`);
  };

  const logout = () => {
    addLog('Вихід із системи', `Адміністратор ${adminUser.email} завершив сесію`);
    setIsAuthenticated(false);
  };

  const createNews = (itemData) => {
    const newItem = {
      id: String(Date.now()),
      ...itemData,
      createdAt: '21.11.2026',
    };
    setNews((prev) => [newItem, ...prev]);
    addLog('Створення новини', `Створено новину: "${newItem.title}"`);
  };

  const updateNews = (id, updatedFields) => {
    setNews((prev) =>
      prev.map((item) => (item.id === String(id) ? { ...item, ...updatedFields } : item))
    );
    addLog('Редагування новини', `Оновлено новину ID #${id}: "${updatedFields.title}"`);
  };

  const deleteNews = (id) => {
    const target = news.find((n) => n.id === String(id));
    setNews((prev) => prev.filter((item) => item.id !== String(id)));
    addLog('Видалення новини', `Видалено новину: "${target?.title || id}"`);
  };

  const toggleUserStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === String(id)) {
          const nextStatus = u.status === 'Активний' ? 'Заблокований' : 'Активний';
          addLog('Зміна статусу користувача', `${u.name} (${u.email}) -> ${nextStatus}`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminUser,
        news,
        users,
        logs,
        newsFilter,
        setNewsFilter,
        userFilter,
        setUserFilter,
        login,
        logout,
        createNews,
        updateNews,
        deleteNews,
        toggleUserStatus,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);