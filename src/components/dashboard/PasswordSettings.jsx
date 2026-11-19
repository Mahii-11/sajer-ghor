import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { changePasswordApi } from "../../services/api";

export default function PasswordSettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { type: "success" | "error", text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!oldPassword) {
      setMessage({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }
    if (password !== confirm) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setLoading(true);
    const res = await changePasswordApi(oldPassword, password, confirm);
    setLoading(false);

    if (res?.status) {
      setMessage({ type: "success", text: res.message || "Password updated successfully." });
      setOldPassword("");
      setPassword("");
      setConfirm("");
    } else {
      const firstError =
        res?.errors && Object.values(res.errors).flat()[0];
      setMessage({
        type: "error",
        text: firstError || res?.message || "Could not update password.",
      });
    }
  };

  const inputClass =
    "w-full px-4 py-3 pr-11 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-[#db2777]/10 transition-all";
  const labelClass =
    "block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6">
      <div className="pb-4 mb-6 border-b border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900">Set Password</h2>
        <p className="text-sm text-slate-500 mt-1">
          Update your account password to keep your account secure
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className={labelClass}>Old Password</label>
          <input
            type={show ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter your old password"
            autoComplete="current-password"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>New Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your new password"
              className={inputClass}
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>Confirm New Password</label>
          <input
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm your new password"
            className={inputClass}
          />
        </div>

        {message && (
          <div
            className={`text-sm px-4 py-3 rounded-lg border ${
              message.type === "success"
                ? "bg-green-50 border-green-200 text-green-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="submit"
            disabled={loading}
            className="bg-[#db2777] hover:bg-[#be185d] disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all active:scale-95"
          >
            {loading ? "Saving..." : "Save Password"}
          </button>
        </div>
      </form>
    </div>
  );
}
