
"use client";

import {
  type ChangeEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  AlertCircle,
  Bell,
  Camera,
  CheckCircle2,
  LockKeyhole,
  Save,
  ShieldCheck,
  Store,
  UserRound,
  X,
} from "lucide-react";

import Sidebar from "@/components/Sidebar";
import AdminHeader from "@/components/AdminHeader";
import { settingsService } from "@/services/settingsService";

type SettingsTab =
  | "profile"
  | "store"
  | "notification"
  | "security";

type NotificationType = "success" | "error";

type NotificationState = {
  type: NotificationType;
  message: string;
} | null;

const LOCAL_KEY = "tapjaya-settings";

type LocalSettings = {
  profile?: {
    phone?: string;
    position?: string;
  };
  store?: {
    email?: string;
    open?: string;
    close?: string;
  };
  notifications?: {
    newOrder: boolean;
    lowStock: boolean;
    dailyReport: boolean;
  };
  profileImage?: string;
  storeLogo?: string;
};

export default function SettingsPage() {
  const router = useRouter();

  /* =========================
     REFS
  ========================== */

  const profileInputRef =
    useRef<HTMLInputElement>(null);

  const storeInputRef =
    useRef<HTMLInputElement>(null);

  /* =========================
     TAB
  ========================== */

  const [activeTab, setActiveTab] =
    useState<SettingsTab>("profile");

  /* =========================
     NOTIFICATION MESSAGE
  ========================== */

  const [message, setMessage] =
    useState<NotificationState>(null);

  const [saving, setSaving] = useState(false);

  /* =========================
     IMAGES
  ========================== */

  const [profileImage, setProfileImage] =
    useState<string>("");

  const [storeLogo, setStoreLogo] =
    useState<string>(
      "/images/tapjaya-logo.png"
    );

  /* =========================
     PROFILE
  ========================== */

  const [profile, setProfile] = useState({
    name: "Admin TAP JAYA",
    email: "admin@tapjaya.com",
    phone: "081234567890",
    position: "Administrator",
  });

  /* =========================
     STORE
  ========================== */

  const [store, setStore] = useState({
    name: "Toko Kopi Jaya Begawan",
    address: "Malang, Jawa Timur",
    phone: "081234567890",
    email: "tapjaya@gmail.com",
    open: "08:00",
    close: "22:00",
  });

  /* =========================
     NOTIFICATIONS
  ========================== */

  const [notifications, setNotifications] =
    useState({
      newOrder: true,
      lowStock: true,
      dailyReport: false,
    });

  /* =========================
     PASSWORD
  ========================== */

  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  /* =========================
     SHOW MESSAGE
  ========================== */

  const showMessage = (
    type: NotificationType,
    text: string
  ) => {
    setMessage({
      type,
      message: text,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================
     LOAD SETTINGS FROM API
  ========================== */

  useEffect(() => {
    let active = true;

    // Baca data tambahan yang belum
    // memiliki kolom database.
    try {
      const saved = localStorage.getItem(LOCAL_KEY);

      if (saved) {
        const local: LocalSettings =
          JSON.parse(saved);

        if (local.profile) {
          setProfile((prev) => ({
            ...prev,
            phone:
              local.profile?.phone ??
              prev.phone,
            position:
              local.profile?.position ??
              prev.position,
          }));
        }

        if (local.store) {
          setStore((prev) => ({
            ...prev,
            email:
              local.store?.email ??
              prev.email,
            open:
              local.store?.open ??
              prev.open,
            close:
              local.store?.close ??
              prev.close,
          }));
        }

        if (local.notifications) {
          setNotifications(local.notifications);
        }

        if (local.profileImage) {
          setProfileImage(local.profileImage);
        }

        if (local.storeLogo) {
          setStoreLogo(local.storeLogo);
        }
      }
    } catch (error) {
      console.error(
        "Gagal membaca pengaturan lokal:",
        error
      );
    }

    async function loadFromBackend() {
      const results = await Promise.allSettled([
        settingsService.getProfile(),
        settingsService.getStore(),
      ]);

      if (!active) return;

      const profileResult = results[0];
      const storeResult = results[1];

      if (profileResult.status === "fulfilled") {
        const admin = profileResult.value.data;

        setProfile((prev) => ({
          ...prev,
          name: admin.username,
          email: admin.email,
        }));
      }

      if (storeResult.status === "fulfilled") {
        const toko = storeResult.value.data;

        setStore((prev) => ({
          ...prev,
          name: toko.store_name,
          address: toko.address ?? "",
          phone: toko.phone ?? "",
        }));

        if (toko.logo) {
          setStoreLogo((prev) =>
            prev.startsWith("data:")
              ? prev
              : toko.logo ||
                "/images/tapjaya-logo.png"
          );
        }
      }

      if (
        profileResult.status === "rejected" ||
        storeResult.status === "rejected"
      ) {
        const errors = [
          profileResult.status === "rejected"
            ? profileResult.reason
            : null,
          storeResult.status === "rejected"
            ? storeResult.reason
            : null,
        ].filter(Boolean);

        const text = errors
          .map((err) =>
            err instanceof Error
              ? err.message
              : "Gagal mengambil data Pengaturan."
          )
          .join(" | ");

        setMessage({
          type: "error",
          message: text,
        });
      }
    }

    void loadFromBackend();

    return () => {
      active = false;
    };
  }, []);

  /* =========================
     IMAGE UPLOAD
  ========================== */

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    type: "profile" | "store"
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      showMessage(
        "error",
        "Format foto harus JPG, PNG, atau WEBP."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      showMessage(
        "error",
        "Ukuran foto maksimal 2 MB."
      );

      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const result = reader.result;

      if (typeof result !== "string") {
        showMessage(
          "error",
          "Foto gagal dibaca."
        );
        return;
      }

      if (type === "profile") {
        setProfileImage(result);
      } else {
        setStoreLogo(result);
      }

      showMessage(
        "success",
        type === "profile"
          ? "Foto profil berhasil dipilih."
          : "Logo toko berhasil dipilih."
      );
    };

    reader.readAsDataURL(file);
  };

  /* =========================
     SAVE LOCAL SETTINGS
     HANYA DATA TAMBAHAN
  ========================== */

  const saveLocalSettings = () => {
    const localData: LocalSettings = {
      profile: {
        phone: profile.phone,
        position: profile.position,
      },
      store: {
        email: store.email,
        open: store.open,
        close: store.close,
      },
      notifications,
      profileImage,
      storeLogo,
    };

    try {
      localStorage.setItem(
        LOCAL_KEY,
        JSON.stringify(localData)
      );

      return true;
    } catch (error) {
      console.error(
        "Gagal menyimpan pengaturan lokal:",
        error
      );

      return false;
    }
  };

  /* =========================
     SAVE SETTINGS
  ========================== */

  const handleSave = async () => {
    if (saving) return;

    setMessage(null);
    setSaving(true);

    try {
      /* =========================
         PROFILE
      ========================== */

      if (activeTab === "profile") {
        if (!profile.name.trim()) {
          showMessage(
            "error",
            "Nama lengkap wajib diisi."
          );
          return;
        }

        if (
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            profile.email.trim()
          )
        ) {
          showMessage(
            "error",
            "Format email tidak valid."
          );
          return;
        }

        const result =
          await settingsService.updateProfile({
            username: profile.name.trim(),
            email: profile.email.trim(),
          });

        if (result.data) {
          setProfile((prev) => ({
            ...prev,
            name: result.data!.username,
            email: result.data!.email,
          }));
        }

        const localSaved = saveLocalSettings();

        showMessage(
          "success",
          localSaved
            ? "Profil admin berhasil disimpan."
            : "Profil admin tersimpan di database, tetapi data tambahan lokal gagal disimpan."
        );
      }

      /* =========================
         STORE
      ========================== */

      else if (activeTab === "store") {
        if (!store.name.trim()) {
          showMessage(
            "error",
            "Nama toko wajib diisi."
          );
          return;
        }

        if (
          store.email.trim() &&
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            store.email.trim()
          )
        ) {
          showMessage(
            "error",
            "Format email toko tidak valid."
          );
          return;
        }

        if (
          store.open &&
          store.close &&
          store.open >= store.close
        ) {
          showMessage(
            "error",
            "Jam tutup harus lebih besar dari jam buka."
          );
          return;
        }

        // FileReader menghasilkan data URL Base64.
        // Kolom logo di backend VARCHAR(255),
        // jadi data URL tidak boleh dikirim ke MySQL.
        const logoForBackend =
          storeLogo.startsWith("data:")
            ? null
            : storeLogo || null;

        const result =
          await settingsService.updateStore({
            store_name: store.name.trim(),
            address: store.address.trim(),
            phone: store.phone.trim(),
            logo: logoForBackend,
          });

        if (result.data) {
          setStore((prev) => ({
            ...prev,
            name: result.data!.store_name,
            address: result.data!.address ?? "",
            phone: result.data!.phone ?? "",
          }));
        }

        const localSaved = saveLocalSettings();

        showMessage(
          "success",
          localSaved
            ? "Informasi toko berhasil disimpan. Email, jam operasional, dan gambar pilihan disimpan di browser."
            : "Informasi utama toko tersimpan di database, tetapi data tambahan lokal gagal disimpan."
        );
      }

      /* =========================
         NOTIFICATION
      ========================== */

      else if (activeTab === "notification") {
        const localSaved = saveLocalSettings();

        if (!localSaved) {
          showMessage(
            "error",
            "Preferensi notifikasi gagal disimpan di browser."
          );
          return;
        }

        showMessage(
          "success",
          "Preferensi notifikasi berhasil disimpan di browser."
        );
      }

      /* =========================
         SECURITY
      ========================== */

      else if (activeTab === "security") {
        if (!password.oldPassword.trim()) {
          showMessage(
            "error",
            "Password lama wajib diisi."
          );
          return;
        }

        if (!password.newPassword) {
          showMessage(
            "error",
            "Password baru wajib diisi."
          );
          return;
        }

        if (password.newPassword.length < 8) {
          showMessage(
            "error",
            "Password baru minimal 8 karakter."
          );
          return;
        }

        if (
          password.newPassword !==
          password.confirmPassword
        ) {
          showMessage(
            "error",
            "Konfirmasi password baru tidak cocok."
          );
          return;
        }

        if (
          password.oldPassword ===
          password.newPassword
        ) {
          showMessage(
            "error",
            "Password baru harus berbeda dari password lama."
          );
          return;
        }

        await settingsService.changePassword({
          currentPassword: password.oldPassword,
          newPassword: password.newPassword,
          confirmPassword:
            password.confirmPassword,
        });

        setPassword({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        showMessage(
          "success",
          "Password admin berhasil diperbarui."
        );
      }

      // Tetap mengikuti alur sukses
      // yang sudah ada di desain asli.
      // Navigasi dilakukan hanya setelah
      // operasi penyimpanan berhasil.
      router.push("/settings/success");

    } catch (error) {
      showMessage(
        "error",
        error instanceof Error
          ? error.message
          : "Gagal menyimpan pengaturan."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================
     TABS
  ========================== */

  const tabs = [
    {
      id: "profile" as SettingsTab,
      label: "Profil & Akun",
      icon: UserRound,
    },
    {
      id: "store" as SettingsTab,
      label: "Informasi Toko",
      icon: Store,
    },
    {
      id: "notification" as SettingsTab,
      label: "Notifikasi",
      icon: Bell,
    },
    {
      id: "security" as SettingsTab,
      label: "Keamanan",
      icon: ShieldCheck,
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#f5f5f5]">
      {/* =========================
          SIDEBAR
      ========================== */}

      <Sidebar />

      {/* =========================
          CONTENT
      ========================== */}

      <section className="min-w-0 flex-1 p-5">
        {/* HEADER */}

        <div className="mb-5">
          <AdminHeader
            title="Pengaturan"
            subtitle="Kelola informasi akun, toko, dan preferensi sistem TAP JAYA."
          />
        </div>

        {/* =========================
            NOTIFICATION
        ========================== */}

        {message && (
          <div
            className={`mb-4 flex items-center justify-between gap-4 rounded-xl border px-4 py-3 ${
              message.type === "success"
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-red-200 bg-red-50 text-red-600"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? (
                <CheckCircle2
                  size={17}
                  className="shrink-0"
                />
              ) : (
                <AlertCircle
                  size={17}
                  className="shrink-0"
                />
              )}

              <p className="text-[10px] font-medium">
                {message.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setMessage(null)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition hover:bg-black/5"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* =========================
            TAB BUTTONS
        ========================== */}

        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            return (
              <button
                type="button"
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMessage(null);
                }}
                className={`flex h-[40px] items-center gap-2 rounded-lg border px-4 text-[11px] font-medium transition ${
                  activeTab === tab.id
                    ? "border-[#e63131] bg-[#e63131] text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon size={15} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ==================================
            PROFIL & AKUN
        =================================== */}

        {activeTab === "profile" && (
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">
              Profil Admin
            </h2>

            <p className="mt-1 text-[10px] text-gray-500">
              Kelola informasi akun admin
              yang digunakan untuk mengakses
              sistem.
            </p>

            {/* PROFILE PHOTO */}

            <div className="mt-4 flex items-center gap-4">
              <div className="relative flex h-[64px] w-[64px] shrink-0 items-center justify-center overflow-hidden rounded-full bg-red-50 text-red-500">
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt="Foto Profil"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <Camera size={22} />
                )}
              </div>

              <div>
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, "profile")
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    profileInputRef.current?.click()
                  }
                  className="h-[32px] rounded-lg border border-gray-200 bg-white px-3 text-[9px] font-medium text-gray-600 transition hover:border-red-300 hover:text-red-500"
                >
                  Pilih Foto
                </button>

                <p className="mt-1 text-[8px] text-gray-400">
                  JPG, PNG, WEBP (maks. 2MB)
                </p>
              </div>
            </div>

            {/* PROFILE FORM */}

            <div className="mt-5 grid grid-cols-1 gap-3 lg:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Nama Lengkap
                </label>

                <input
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      name: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Nomor Telepon
                </label>

                <input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Jabatan
                </label>

                <input
                  value={profile.position}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      position: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================
            INFORMASI TOKO
        =================================== */}

        {activeTab === "store" && (
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">
              Informasi Toko
            </h2>

            <p className="mt-1 text-[10px] text-gray-500">
              Kelola informasi dasar usaha
              TAP JAYA yang ditampilkan pada
              sistem.
            </p>

            {/* STORE LOGO */}

            <div className="mt-4 flex items-center gap-4">
              <div className="relative h-[64px] w-[64px] shrink-0 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <Image
                  src={storeLogo}
                  alt="Logo TAP JAYA"
                  fill
                  unoptimized
                  className="object-contain p-1"
                />
              </div>

              <div>
                <input
                  ref={storeInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(e, "store")
                  }
                />

                <button
                  type="button"
                  onClick={() =>
                    storeInputRef.current?.click()
                  }
                  className="h-[32px] rounded-lg border border-gray-200 bg-white px-3 text-[9px] font-medium text-gray-600 transition hover:border-red-300 hover:text-red-500"
                >
                  Pilih Foto
                </button>

                <p className="mt-1 text-[8px] text-gray-400">
                  JPG, PNG, WEBP (maks. 2MB)
                </p>
              </div>
            </div>

            {/* STORE FORM */}

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Nama Toko
                </label>

                <input
                  value={store.name}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      name: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Alamat
                </label>

                <input
                  value={store.address}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      address: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Nomor Telepon
                </label>

                <input
                  value={store.phone}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      phone: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Email
                </label>

                <input
                  type="email"
                  value={store.email}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      email: e.target.value,
                    })
                  }
                  className="h-[38px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>
            </div>

            {/* OPERATION TIME */}

            <div className="mt-3">
              <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                Jam Operasional
              </label>

              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="time"
                  value={store.open}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      open: e.target.value,
                    })
                  }
                  className="h-[38px] w-[130px] rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-red-400"
                />

                <span className="text-[10px] text-gray-500">
                  Sampai
                </span>

                <input
                  type="time"
                  value={store.close}
                  onChange={(e) =>
                    setStore({
                      ...store,
                      close: e.target.value,
                    })
                  }
                  className="h-[38px] w-[130px] rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-red-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================
            NOTIFIKASI
        =================================== */}

        {activeTab === "notification" && (
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <h2 className="text-[14px] font-bold">
              Notifikasi
            </h2>

            <p className="mt-1 text-[10px] text-gray-500">
              Atur jenis notifikasi yang
              ingin diterima oleh admin.
            </p>

            <div className="mt-5 divide-y divide-gray-100">
              {/* NEW ORDER */}

              <div className="flex items-center justify-between gap-5 py-4 first:pt-0">
                <div>
                  <p className="text-[11px] font-semibold text-gray-800">
                    Notifikasi pesanan baru
                  </p>

                  <p className="mt-1 text-[9px] text-gray-400">
                    Dapatkan notifikasi saat
                    pesanan baru masuk.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      newOrder:
                        !notifications.newOrder,
                    })
                  }
                  className={`relative h-[22px] w-[40px] shrink-0 rounded-full transition ${
                    notifications.newOrder
                      ? "bg-[#e63131]"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${
                      notifications.newOrder
                        ? "left-[21px]"
                        : "left-[3px]"
                    }`}
                  />
                </button>
              </div>

              {/* LOW STOCK */}

              <div className="flex items-center justify-between gap-5 py-4">
                <div>
                  <p className="text-[11px] font-semibold text-gray-800">
                    Notifikasi stok menu menipis
                  </p>

                  <p className="mt-1 text-[9px] text-gray-400">
                    Dapatkan notifikasi saat
                    stok menu hampir habis.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      lowStock:
                        !notifications.lowStock,
                    })
                  }
                  className={`relative h-[22px] w-[40px] shrink-0 rounded-full transition ${
                    notifications.lowStock
                      ? "bg-[#e63131]"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${
                      notifications.lowStock
                        ? "left-[21px]"
                        : "left-[3px]"
                    }`}
                  />
                </button>
              </div>

              {/* DAILY REPORT */}

              <div className="flex items-center justify-between gap-5 py-4 last:pb-0">
                <div>
                  <p className="text-[11px] font-semibold text-gray-800">
                    Notifikasi laporan harian
                  </p>

                  <p className="mt-1 text-[9px] text-gray-400">
                    Dapatkan ringkasan
                    laporan penjualan setiap hari.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setNotifications({
                      ...notifications,
                      dailyReport:
                        !notifications.dailyReport,
                    })
                  }
                  className={`relative h-[22px] w-[40px] shrink-0 rounded-full transition ${
                    notifications.dailyReport
                      ? "bg-[#e63131]"
                      : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-[3px] h-4 w-4 rounded-full bg-white shadow transition-all ${
                      notifications.dailyReport
                        ? "left-[21px]"
                        : "left-[3px]"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================
            KEAMANAN
        =================================== */}

        {activeTab === "security" && (
          <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2">
              <LockKeyhole
                size={16}
                className="text-gray-600"
              />

              <h2 className="text-[14px] font-bold">
                Ubah Password
              </h2>
            </div>

            <p className="mt-1 text-[10px] text-gray-500">
              Gunakan password yang kuat
              untuk menjaga keamanan akun.
            </p>

            <div className="mt-5 max-w-[830px] space-y-3">
              {/* PASSWORD LAMA */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Password Lama
                </label>

                <input
                  type="password"
                  value={password.oldPassword}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      oldPassword: e.target.value,
                    });

                    setMessage(null);
                  }}
                  placeholder="Masukkan password lama"
                  className="h-[44px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              {/* PASSWORD BARU */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Password Baru
                </label>

                <input
                  type="password"
                  value={password.newPassword}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      newPassword: e.target.value,
                    });

                    setMessage(null);
                  }}
                  placeholder="Masukkan password baru"
                  className="h-[44px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />
              </div>

              {/* CONFIRM PASSWORD */}

              <div>
                <label className="mb-1.5 block text-[10px] font-medium text-gray-700">
                  Konfirmasi Password Baru
                </label>

                <input
                  type="password"
                  value={password.confirmPassword}
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      confirmPassword: e.target.value,
                    });

                    setMessage(null);
                  }}
                  placeholder="Masukkan kembali password baru"
                  className="h-[44px] w-full rounded-lg border border-gray-200 px-3 text-[11px] outline-none transition focus:border-red-400"
                />

                {password.confirmPassword &&
                  password.newPassword !==
                    password.confirmPassword && (
                    <p className="mt-1.5 text-[9px] font-medium text-red-500">
                      Password tidak sama.
                    </p>
                  )}

                {password.confirmPassword &&
                  password.newPassword ===
                    password.confirmPassword && (
                    <p className="mt-1.5 text-[9px] font-medium text-green-600">
                      Password sudah sama.
                    </p>
                  )}
              </div>
            </div>
          </div>
        )}

        {/* ==================================
            SAVE BUTTON
        =================================== */}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex h-[40px] items-center gap-2 rounded-lg bg-[#e63131] px-5 text-[11px] font-semibold text-white transition hover:bg-[#ca2929]"
          >
            <Save size={15} />

            {saving
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>
        </div>
      </section>
    </main>
  );
}
