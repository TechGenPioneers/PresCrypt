// hooks/useUsers.js
import { useState, useEffect, useCallback } from "react";
import { GetUsers } from "../../service/ChatService";

export default function useUsers(userId) {
  const [users, setUsers] = useState([]);
  const [isUsersLoading, setIsUsersLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    try {
      const data = await GetUsers(userId);
      setUsers(data || []);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsUsersLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, setUsers, isUsersLoading, fetchUsers };
}
