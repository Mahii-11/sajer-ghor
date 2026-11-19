import { useEffect, useState } from "react";
import { Mail, Phone, MapPin, Edit2, Save, CalendarDays } from "lucide-react";
import Swal from "sweetalert2";
import { updateUserProfile, getUserProfile } from "../../services/api";

import { resolveImageUrl } from "../../utils/imageUrl";
import { PROFILE_UPDATED_EVENT } from "../../utils/profileEvents";

export default function AccountSettings({ user, setUser }) {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [profileImage, setProfileImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    joined: "",
    status: "",
  });

  useEffect(() => {
    if (user) {
      setProfileImage(user.image || "");
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        joined: user.joined || "",
        status: user.status || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (profileImage?.startsWith("blob:")) {
      URL.revokeObjectURL(profileImage);
    }

    setImageFile(file);
    setProfileImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // The backend's unique-phone rule does not ignore the user's own number, so
      // an unchanged phone is rejected ("The phone has already been taken") and
      // nothing gets saved. Only send the phone when it was actually edited.
      const build = (withPhone) => {
        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        if (withPhone) form.append("phone", formData.phone);
        form.append("address", formData.address);
        if (imageFile) form.append("image", imageFile);
        return form;
      };

      const phoneChanged = formData.phone !== (user?.phone || "");
      let res = await updateUserProfile(build(phoneChanged));

      // Backend insists on a phone: retry with it included
      if (res?.errors?.phone && !phoneChanged && !/taken/i.test(String(res.errors.phone))) {
        res = await updateUserProfile(build(true));
      }

      const failed = !res || res.status === false || res.success === false;
      if (failed) {
        // Laravel validation error: { message, errors: { field: [msg] } }
        const firstError = res?.errors && Object.values(res.errors).flat()[0];
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: firstError || res?.message || res?.msg || "Could not update your profile.",
          confirmButtonColor: "#db2777",
        });
        return;
      }

      // server এর আসল data (নতুন image path সহ) আবার নিয়ে আসা
      const fresh = await getUserProfile();
      if (fresh?.status === true && fresh?.user) {
        setUser(fresh.user);
      } else {
        setUser((prev) => ({
          ...prev,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
        }));
      }

      // site header এর avatar refresh করতে
      window.dispatchEvent(new Event(PROFILE_UPDATED_EVENT));

      setImageFile(null);
      setIsEditingProfile(false);

      Swal.fire({
        icon: "success",
        title: "Profile Updated",
        text: res?.message || res?.msg || "Your profile has been updated.",
        confirmButtonColor: "#db2777",
        timer: 2000,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
        confirmButtonColor: "#db2777",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const contactFields = [
    { label: "Full Name", icon: Edit2, type: "text", name: "name" },
    { label: "Email Address", icon: Mail, type: "email", name: "email" },
    { label: "Phone Number", icon: Phone, type: "tel", name: "phone" },
  ];

  const addressFields = [
    { label: "Shipping Address", icon: MapPin, type: "textarea", name: "address" },
  ];

  return (
    <>
      {/* Loader */}
      {isSaving && (
        <div className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white px-6 py-5 rounded-2xl shadow-xl flex items-center gap-3">
            <div className="w-6 h-6 border-4 border-[#db2777] border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-slate-700">
              Saving changes...
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Account Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage your profile information and account preferences.
          </p>
        </div>

        <button
          disabled={isSaving}
          onClick={() => {
            // save সফল হলে handleSave নিজেই edit mode বন্ধ করে; fail করলে edit mode খোলা থাকে
            if (isEditingProfile) handleSave();
            else setIsEditingProfile(true);
          }}
          className="bg-[#db2777] hover:bg-[#be185d] disabled:opacity-50 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shadow-[#db2777]/20 transition-all active:scale-95 flex items-center gap-2"
        >
          {isEditingProfile ? (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mt-6">
        <div className="relative h-32 sm:h-36 bg-gradient-to-r from-[#db2777] via-[#e8386a] to-[#f43f5e] overflow-hidden">
          <div className="absolute -right-10 -top-16 w-56 h-56 rounded-full bg-white/10" />
          <div className="absolute right-32 -bottom-20 w-48 h-48 rounded-full border-[22px] border-white/10" />
          <div className="absolute -left-8 -bottom-12 w-32 h-32 rounded-full bg-white/10" />
        </div>

        <div className="px-6 sm:px-8 pb-7 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 -mt-14 relative z-10">
            <div className="flex flex-col items-start shrink-0">
              <img
                src={resolveImageUrl(profileImage)}
                alt="Profile"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-4 border-white shadow-lg ring-1 ring-slate-100 object-cover bg-white"
              />

              {isEditingProfile && (
                <label className="mt-2 cursor-pointer text-xs text-[#db2777] font-medium">
                  Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="flex-1 min-w-0 sm:pt-[4.25rem]">
              <h2 className="text-2xl font-bold text-slate-900 leading-tight truncate">
                {formData.name || "User"}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="inline-flex items-center rounded-full bg-pink-50 px-3 py-1 text-xs font-semibold text-[#db2777] ring-1 ring-pink-100">
                  {formData.status || "Customer"}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                  Member since {formData.joined || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact + Address */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
        {/* Contact */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">
            Contact Information
          </h3>

          <div className="space-y-6">
            {contactFields.map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <field.icon className="w-4 h-4 text-[#db2777]" />
                  {field.label}
                </label>

                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-[#db2777]/10 transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Address</h3>

          <div className="space-y-6">
            {addressFields.map((field, i) => (
              <div key={i}>
                <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                  <field.icon className="w-4 h-4 text-[#db2777]" />
                  {field.label}
                </label>

                <textarea
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditingProfile}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-slate-900 bg-white disabled:bg-slate-50 disabled:text-slate-500 focus:outline-none focus:border-[#db2777] focus:ring-4 focus:ring-[#db2777]/10 transition-all resize-none h-32"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TODO: Danger Zone - delete account API ready hole uncomment kore onClick e API call wire korte hobe
      <div className="bg-red-50 rounded-2xl border border-red-200 p-6 mt-6">
        <h3 className="text-lg font-bold text-red-700 mb-3">Danger Zone</h3>
        <p className="text-sm text-red-600 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>

        <button className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
          Delete Account
        </button>
      </div>
      */}
    </>
  );
}