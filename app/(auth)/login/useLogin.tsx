"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AuthService from "@/services/AuthService";
import { isLoggedIn } from "@/lib/auth";

const useLogin = () => {
  const router = useRouter();

  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isLoggedIn()) {
      router.replace("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await AuthService.login({ user, password });

      if (response?.success) {
        router.replace("/dashboard");
        return;
      }

      setError(response?.message || "Invalid credentials");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    setUser,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    error,
    handleSubmit,
  };
};

export default useLogin;