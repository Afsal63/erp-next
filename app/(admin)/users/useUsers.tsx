"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import UsersService from "@/services/UsersService";

const ITEMS_PER_PAGE = 10;

export type User = {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  phone: string;
  phonePrefix: string;
  department?: string;
  position?: string;
  role: string;
  state?: string;
  enabled: boolean;
  isLoggedIn?: boolean;
};

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [actionOpen, setActionOpen] = useState(false);
  const [actionMode, setActionMode] = useState<"view" | "role" | "password">(
    "view"
  );
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const fetchUsers = async (
    pageNo: number = page,
    searchValue: string = search
  ) => {
    try {
      setLoading(true);

      const res = searchValue
        ? await UsersService.search(pageNo, ITEMS_PER_PAGE, searchValue)
        : await UsersService.list(pageNo, ITEMS_PER_PAGE);

      if (res?.success) {
        setUsers(res.result || []);
        setPagination(res.pagination || null);
      } else {
        setUsers([]);
      }
    } catch {
      toast.error("Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page, search);
    // eslint-disable-next-line
  }, [page]);

  const handleSearch = (value: string) => {
    setSearch(value.trim());
    setPage(1);
    fetchUsers(1, value.trim());
  };

  return {
    users,
    loading,
    page,
    pagination,
    setPage,
    handleSearch,
    fetchUsers,
    actionOpen,
    setActionOpen,
    actionMode,
    setActionMode,
    selectedUser,
    setSelectedUser
  };
};

export default useUsers;
