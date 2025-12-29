"use client";

import { useState } from "react";
import { X } from "lucide-react";

type Mode = "view" | "role" | "password";

type User = {
  _id: string;
  name: string;
  surname?: string;
  email: string;
  phone: string;
  phonePrefix: string;
  role: string;
  department?: string;
  position?: string;
};

type Props = {
  open: boolean;
  mode: Mode;
  loading?: boolean;
  user?: User | null;
  onClose: () => void;
  onSubmit?: (data: any) => void;
};

export default function UserActionModal({
  open,
  mode,
  loading = false,
  user,
  onClose,
  onSubmit,
}: Props) {
  if (!open || !user) return null;

  /* ================= LOCAL STATE ================= */
  const [role, setRole] = useState(user.role);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  /* ================= SUBMIT HANDLER ================= */
  const handleSave = () => {
  if (mode === "role") {
  onSubmit?.({
    name: user.name,
    surname: user.surname,
    email: user.email,
    role,
  });
  return;
}

    if (mode === "password") {
      // REQUIRED
      if (!password || !confirmPassword) {
        setError("Both fields are required");
        return;
      }

      // MIN LENGTH
      if (password.length < 8) {
        setError("Password must be at least 8 characters");
        return;
      }

      // MATCH CHECK
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      setError("");
      onSubmit?.({
        email: user.email,
        password,
        conformPassword: confirmPassword,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center md:justify-center">
      <div className="w-full md:max-w-lg bg-white rounded-t-2xl md:rounded-2xl shadow-lg">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {mode === "view" && "User Details"}
            {mode === "role" && "Update Role"}
            {mode === "password" && "Update Password"}
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ================= BODY ================= */}
        <div className="p-5 space-y-4 text-sm">
          {/* ===== VIEW MODE ===== */}
          {mode === "view" && (
            <>
              <ViewRow label="Name" value={`${user.name} ${user.surname || ""}`} />
              <ViewRow label="Email" value={user.email} />
              <ViewRow label="Phone" value={`${user.phonePrefix} ${user.phone}`} />
              <ViewRow label="Role" value={user.role} />
              <ViewRow label="Department" value={user.department || "-"} />
              <ViewRow label="Position" value={user.position || "-"} />
            </>
          )}

          {/* ===== UPDATE ROLE ===== */}
          {mode === "role" && (
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg text-sm"
            >
              <option value="admin">Admin</option>
              <option value="manager">Staff</option>
              <option value="executive">Executive</option>
            </select>
          )}

          {/* ===== UPDATE PASSWORD ===== */}
          {mode === "password" && (
            <div className="space-y-3">
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full px-3 py-2 border rounded-lg text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              {/* HELPER TEXT */}
              <p className="text-xs text-gray-500">
                Password must be at least 8 characters
              </p>

              {/* ERROR */}
              {error && (
                <p className="text-xs text-red-600">{error}</p>
              )}
            </div>
          )}
        </div>

        {/* ================= FOOTER ================= */}
        {mode !== "view" && (
          <div className="p-4 border-t flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border rounded-lg py-2"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              onClick={handleSave}
              className="flex-1 bg-blue-600 text-white rounded-lg py-2 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= VIEW ROW ================= */

const ViewRow = ({
  label,
  value,
}: {
  label: string;
  value?: string;
}) => (
  <div className="flex justify-between gap-3">
    <span className="text-gray-500">{label}</span>
    <span className="font-medium text-right">{value || "-"}</span>
  </div>
);