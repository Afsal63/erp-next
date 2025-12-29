"use client";

import useUsers from "./useUsers";
import SearchInput from "@/components/ui/SearchInput";
import Pagination from "@/components/ui/Pagination";
import UserDropdown from "@/components/user/UserDropDown";
import UserActionModal from "@/components/user/UserActionModal";

export default function UsersPage() {
  const {
    users,
    loading,
    page,
    pagination,
    setPage,
    handleSearch,
    actionOpen,
    actionMode,
    setActionOpen,
    selectedUser,
    setSelectedUser,
    setActionMode,
  } = useUsers();

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Loading users...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      {/* ================= HEADER ================= */}
      <div>
        <h1 className="text-2xl font-bold">Users</h1>
        <p className="text-sm text-gray-500">
          Manage system users & executives
        </p>
      </div>

      {/* ================= SEARCH ================= */}
      <SearchInput onSearch={handleSearch} placeholder="Search users..." />

      {/* ================= TABLE ================= */}
      <div className="hidden md:block bg-white border rounded-2xl shadow-sm overflow-visible">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">Phone</th>
              <th className="p-4 text-left">Role</th>
              <th className="p-4 text-left">Department</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t hover:bg-gray-50">
                <td className="p-4 font-medium">
                  {u.name} {u.surname || ""}
                </td>

                <td className="p-4">{u.email}</td>

                <td className="p-4">
                  {u.phonePrefix} {u.phone}
                </td>

                <td className="p-4">
                  <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs">
                    {u.role}
                  </span>
                </td>

                <td className="p-4">{u.department || "-"}</td>

                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      u.enabled
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {u.enabled ? "Active" : "Disabled"}
                  </span>
                </td>

                {/* ================= ACTIONS ================= */}
                <td className="p-4 text-center">
                  <UserDropdown
                    onShow={() => {
                      setSelectedUser(u);
                      setActionMode("view");
                      setActionOpen(true);
                    }}
                    onUpdateRole={() => {
                      setSelectedUser(u);
                      setActionMode("role");
                      setActionOpen(true);
                    }}
                    onUpdatePassword={() => {
                      setSelectedUser(u);
                      setActionMode("password");
                      setActionOpen(true);
                    }}
                    onDelete={() => console.log("Delete user", u._id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="p-6 text-center text-gray-500">No users found</div>
        )}
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="space-y-4 md:hidden">
        {users.map((u) => (
          <div
            key={u._id}
            className="bg-white border rounded-2xl shadow-sm p-4 space-y-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">
                  {u.name} {u.surname || ""}
                </h3>
                <p className="text-xs text-gray-500">{u.email}</p>
              </div>

              <UserDropdown
                onShow={() => console.log("Show user", u._id)}
                onUpdateRole={() => console.log("Update role", u._id)}
                onUpdatePassword={() => console.log("Update password", u._id)}
                onDelete={() => console.log("Delete user", u._id)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Phone</p>
                <p className="font-medium">
                  {u.phonePrefix} {u.phone}
                </p>
              </div>

              <div>
                <p className="text-gray-500">Department</p>
                <p className="font-medium">{u.department || "-"}</p>
              </div>

              <div>
                <p className="text-gray-500">Role</p>
                <p className="font-medium">{u.role}</p>
              </div>

              <div>
                <p className="text-gray-500">Status</p>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs ${
                    u.enabled
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {u.enabled ? "Active" : "Disabled"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <UserActionModal
        open={actionOpen}
        mode={actionMode}
        user={selectedUser}
        onClose={() => {
          setActionOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={(data) => {
          console.log("SUBMIT DATA", data);
          // call update role / password API here
        }}
      />

      {/* ================= PAGINATION ================= */}
      <Pagination
        page={page}
        totalPages={pagination?.pages || 1}
        onPageChange={setPage}
      />
    </div>
  );
}
