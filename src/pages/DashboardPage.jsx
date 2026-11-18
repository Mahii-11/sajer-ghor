import { useEffect, useState } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { getUserProfile } from "../services/api";
import { PROFILE_UPDATED_EVENT } from "../utils/profileEvents";
import DashboardSkeleton from "../components/dashboard/DashboardSkeleton";
import Sidebar from "../components/dashboard/Sidebar";
import Header from "../components/dashboard/Header";
import Overview from "../components/dashboard/Overview";
import Orders from "../components/dashboard/Orders";
import TrackOrder from "../components/dashboard/TrackOrder";
import PasswordSettings from "../components/dashboard/PasswordSettings";
import Wishlist from "../components/dashboard/Wishlist";
import AccountSettings from "../components/dashboard/AccountSettings";

// Tabs listed in the Sidebar whose APIs are not ready yet (address).
// Import their components and add them to the switch below once the endpoints are available.
const PENDING_TABS = {
  address: "Address Book",
  points: "Reward Points",
};

const hasToken = () => {
  try {
    return !!localStorage.getItem("token");
  } catch {
    return false;
  }
};

export default function DashboardPage() {
  const [params, setParams] = useSearchParams();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const loggedIn = hasToken();

  const activeTab = params.get("tab") || "dashboard";
  const setActiveTab = (tab) => {
    setParams({ tab });
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (!loggedIn) return;
    const load = () =>
      getUserProfile()
        .then((res) => {
          if (res?.status && res?.user) setUser(res.user);
        })
        .finally(() => setLoading(false));
    load();
    window.addEventListener(PROFILE_UPDATED_EVENT, load);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, load);
  }, [loggedIn]);

  if (!loggedIn) return <Navigate to="/" replace />;

  const renderTab = () => {
    switch (activeTab) {
      case "orders":
        return <Orders />;
      case "track":
        return <TrackOrder />;
      case "wishlist":
        return <Wishlist />;
      case "password":
        return <PasswordSettings />;
      case "profile":
        return <AccountSettings user={user || {}} setUser={setUser} />;
      case "dashboard":
        return <Overview user={user} setActiveTab={setActiveTab} />;
      default:
        return (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center">
            <h2 className="text-xl font-bold text-slate-900">
              {PENDING_TABS[activeTab] || "Page"}
            </h2>
            <p className="text-sm text-slate-500 mt-2">Coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      {/* Brand accent line, same as the storefront header */}
      <div className="h-[3px] w-full shrink-0 bg-linear-to-r from-pink-500 via-fuchsia-500 to-rose-400" />
      <div className="flex flex-1 min-h-0">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header setSidebarOpen={setSidebarOpen} setActiveTab={setActiveTab} user={user} loading={loading} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {loading ? <DashboardSkeleton /> : renderTab()}
        </main>
      </div>
      </div>
    </div>
  );
}
