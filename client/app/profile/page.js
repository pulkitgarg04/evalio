"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Calendar,
  Shield,
  GraduationCap,
  Save,
  Loader2,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({
    name: "",
    username: "",
    email: "",
    createdAt: "",
    role: "",
    study_year: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/profile`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message || data.error || "Failed to load profile"
          );
        }

        setProfile({
          name: data.name || "",
          email: data.email || "",
          createdAt: data.createdAt || "",
          role: data.role || "",
          study_year: data.study_year ?? "",
        });
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const body = {
        name: profile.name,
        email: profile.email,
        study_year: Number(profile.study_year) || profile.study_year,
      };

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/users/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || "Failed to update profile"
        );
      }

      setSuccess(data.message || "Profile updated successfully");
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString()
    : "-";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center gap-3 text-gray-500">
          <Loader2 className="animate-spin" size={22} />
          <span className="text-sm font-medium">Loading profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-[#0a3a30] text-white flex items-center justify-center text-2xl font-bold">
              {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#0a3a30]">Your Profile</h1>
              <p className="text-sm text-gray-500">
                Manage your personal information and study details.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 text-xs sm:text-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 font-semibold">
              <Shield size={14} />
              <span className="capitalize">{profile.role || "student"}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar size={14} />
              <span>Joined: {formattedDate}</span>
            </div>
          </div>
        </div>

        {(error || success) && (
          <div className="mb-6 space-y-2">
            {error && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 font-medium">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 font-medium">
                {success}
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wide"
                >
                  Full Name
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User size={16} />
                  </span>
                  <input
                    id="name"
                    value={profile.name}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wide"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Mail size={16} />
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="you@chitkara.edu.in"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="study_year"
                  className="text-xs font-bold text-gray-500 uppercase tracking-wide"
                >
                  Study Year
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <GraduationCap size={16} />
                  </span>
                  <input
                    id="study_year"
                    type="number"
                    min="1"
                    max="4"
                    value={profile.study_year}
                    onChange={handleChange}
                    className="w-full h-11 rounded-xl border border-gray-200 bg-gray-50/60 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all"
                    placeholder="1"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#0a3a30] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/10 hover:bg-[#022c22] hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <Loader2 className="animate-spin" size={16} />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">
                Account Summary
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Username</span>
                  <span className="font-medium text-gray-900">
                    {profile.name || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Role</span>
                  <span className="font-medium capitalize text-gray-900">
                    {profile.role || "student"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Study Year</span>
                  <span className="font-medium text-gray-900">
                    {profile.study_year || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {formattedDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
              <p className="text-xs font-bold text-amber-700 uppercase mb-2">
                Note
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Make sure your email and study year are correct so we can
                personalize your tests and exam preparation journey.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

