import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { loginApi, registerApi } from "../services/api";

const EMPTY = { name: "", email: "", phone: "", password: "", password_confirmation: "" };

const inputCls =
  "w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-pink-100 transition-all";

// Flatten Laravel-style validation errors ({ errors: { email: ["..."] } }) into one message
const errorMessage = (res) => {
  const first = res?.errors ? Object.values(res.errors).flat()[0] : null;
  return first || res?.message || "Something went wrong. Please try again.";
};

export default function AuthModal({ open, onClose, onSuccess }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const isLogin = mode === "login";
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!form.email.trim() || !form.password.trim()) {
        setError("Please enter your email and password.");
        return;
      }
    } else if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = isLogin
        ? await loginApi(form.email, form.password)
        : await registerApi(form);

      if (res?.status && res?.token) {
        onSuccess({ token: res.token, user: res.user });
        setForm(EMPTY);
      } else {
        setError(errorMessage(res));
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-bold text-gray-900">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>
        <p className="mt-1 mb-5 text-sm text-gray-500">
          {isLogin ? "Login to track orders and manage your profile." : "Register to get started."}
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <input placeholder="Full name" value={form.name} onChange={set("name")} className={inputCls} />
              <input placeholder="Phone" value={form.phone} onChange={set("phone")} className={inputCls} />
            </>
          )}
          <input type="email" placeholder="Email" value={form.email} onChange={set("email")} className={inputCls} />
          <input type="password" placeholder="Password" value={form.password} onChange={set("password")} className={inputCls} />
          {!isLogin && (
            <input
              type="password"
              placeholder="Confirm password"
              value={form.password_confirmation}
              onChange={set("password_confirmation")}
              className={inputCls}
            />
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-lg bg-[#db2777] font-bold text-white transition-colors hover:bg-[#be185d] disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {isLogin ? "New here?" : "Already have an account?"}{" "}
          <button onClick={switchMode} className="font-semibold text-[#db2777] hover:underline">
            {isLogin ? "Create an account" : "Login"}
          </button>
        </p>
      </div>
    </div>,
    document.body
  );
}
