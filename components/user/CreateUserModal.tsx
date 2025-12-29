"use client";

import { useEffect, useState } from "react";
import { X, Eye, EyeOff, Plus } from "lucide-react";
import apiRequest from "@/lib/apiRequest";
import EmployeeService from "@/services/EmployeeService";

/* ================= TYPES ================= */

type Props = {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
};

type Employee = {
  _id: string;
  email: string;
  name?: string;
  surname?: string;
  phone?: string;
  phonePrefix?: string;
  department?: string;
  position?: string;
  state?: string;
};

/* ================= COMPONENT ================= */

export default function CreateUserModal({
  open,
  loading = false,
  onClose,
  onSubmit,
}: Props) {

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    email: "",
    phone: "",
    name: "",
    surname: "",
    department: "",
    position: "",
    state: "",
    role: "",
    password: "",
    confirmPassword: "",
  });

  /* ================= EMAIL SEARCH ================= */
  const [emailQuery, setEmailQuery] = useState("");
  const [emailResults, setEmailResults] = useState<Employee[]>([]);
  const [emailLoading, setEmailLoading] = useState(false);

  /* ================= UI STATE ================= */
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ================= HELPERS ================= */
  const update = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= EMAIL SEARCH EFFECT ================= */
  useEffect(() => {
    if (!emailQuery.trim()) {
      setEmailResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setEmailLoading(true);
        const res = await EmployeeService.searchByEmail(emailQuery);

        setEmailResults(res?.success ? res.result : []);
      } catch {
        setEmailResults([]);
      } finally {
        setEmailLoading(false);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [emailQuery]);

  /* ================= SUBMIT ================= */
  const handleSubmit = () => {
    const {
      email,
      phone,
      name,
      surname,
      department,
      position,
      state,
      role,
      password,
      confirmPassword,
    } = form;

    if (
      !email ||
      !phone ||
      !name ||
      !surname ||
      !department ||
      !position ||
      !state ||
      !role ||
      !password ||
      !confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");

    onSubmit({
      email,
      phone,
      name,
      surname,
      department,
      position,
      state,
      role,
      password,
      conformPassword: confirmPassword, // backend spelling
    });
  };

    /* ================= CONDITIONAL RENDER ================= */
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg">
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div className="flex items-center gap-3">
            <button onClick={onClose}>
              <X size={18} />
            </button>
            <h2 className="text-xl font-semibold">Create user</h2>
          </div>

          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 border rounded-lg">
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 disabled:opacity-60"
            >
              <Plus size={16} />
              {loading ? "Creating..." : "Create user"}
            </button>
          </div>
        </div>

        {/* ================= FORM ================= */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
          {/* ===== EMAIL SEARCH ===== */}
          <div className="relative">
            <label className="block mb-1 font-medium">
              E-mail <span className="text-red-500">*</span>
            </label>

            <input
              value={emailQuery}
              onChange={(e) => setEmailQuery(e.target.value)}
              placeholder="Search email..."
              className="w-full px-3 py-2 border rounded-lg"
            />

            {emailResults.length > 0 && (
              <div className="absolute z-20 mt-1 w-full bg-white border rounded-lg shadow max-h-60 overflow-auto">
                {emailResults.map((emp) => (
                  <button
                    key={emp._id}
                    type="button"
                    onClick={() => {
                      setForm({
                        ...form,
                        email: emp.email || "",
                        name: emp.name || "",
                        surname: emp.surname || "",
                        phone: emp.phone || "",
                        department: emp.department || "",
                        position: emp.position || "",
                        state: emp.state || "",
                      });
                      setEmailQuery(emp.email || "");
                      setEmailResults([]);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    <div className="font-medium">{emp.email}</div>
                    <div className="text-xs text-gray-500">
                      {emp.name} {emp.surname} • {emp.department}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {emailLoading && (
              <p className="text-xs text-gray-400 mt-1">Searching…</p>
            )}
          </div>

          <Input
            label="Position"
            value={form.position}
            onChange={(v) => update("position", v)}
          />
          <Input
            label="Phone Number"
            value={form.phone}
            onChange={(v) => update("phone", v)}
          />
          <Input
            label="State"
            value={form.state}
            onChange={(v) => update("state", v)}
          />
          <Input
            label="Name"
            value={form.name}
            onChange={(v) => update("name", v)}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(v) => update("role", v)}
          />
          <Input
            label="Surname"
            value={form.surname}
            onChange={(v) => update("surname", v)}
          />

          <PasswordInput
            label="Password"
            value={form.password}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            onChange={(v) => update("password", v)}
          />

          <Input
            label="Department"
            value={form.department}
            onChange={(v) => update("department", v)}
          />

          <PasswordInput
            label="Confirm Password"
            value={form.confirmPassword}
            show={showPassword}
            toggle={() => setShowPassword(!showPassword)}
            onChange={(v) => update("confirmPassword", v)}
          />
        </div>

        {/* ================= ERROR ================= */}
        {error && <div className="px-6 pb-4 text-sm text-red-600">{error}</div>}
      </div>
    </div>
  );
}

/* ================= REUSABLE INPUTS ================= */

const Input = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="block mb-1 font-medium">
      {label} <span className="text-red-500">*</span>
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    />
  </div>
);

const Select = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="block mb-1 font-medium">
      {label} <span className="text-red-500">*</span>
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2 border rounded-lg"
    >
      <option value="">Select role</option>
      <option value="admin">Admin</option>
      <option value="staff">Staff</option>
      <option value="executive">Executive</option>
    </select>
  </div>
);

const PasswordInput = ({
  label,
  value,
  show,
  toggle,
  onChange,
}: {
  label: string;
  value: string;
  show: boolean;
  toggle: () => void;
  onChange: (v: string) => void;
}) => (
  <div>
    <label className="block mb-1 font-medium">
      {label} <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border rounded-lg pr-10"
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-2.5 text-gray-500"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  </div>
);
