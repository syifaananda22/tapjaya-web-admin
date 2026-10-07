"use client";

import {
  ChangeEvent,
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

type SettingsTab =
  | "profile"
  | "store"
  | "notification"
  | "security";

type NotificationType =
  | "success"
  | "error";

type NotificationState = {
  type: NotificationType;
  message: string;
} | null;

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

  const [profile, setProfile] =
    useState({
      name: "Admin TAP JAYA",
      email: "admin@tapjaya.com",
      phone: "081234567890",
      position: "Administrator",
    });

  /* =========================
     STORE
  ========================== */

  const [store, setStore] =
    useState({
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

  const [password, setPassword] =
    useState({
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
     IMAGE UPLOAD
  ========================== */

  const handleImageUpload = (
    event: ChangeEvent<HTMLInputElement>,
    type: "profile" | "store"
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(file.type)
    ) {
      showMessage(
        "error",
        "Format foto harus JPG, PNG, atau WEBP."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      2 * 1024 * 1024
    ) {
      showMessage(
        "error",
        "Ukuran foto maksimal 2 MB."
      );

      event.target.value = "";
      return;
    }

    const reader =
      new FileReader();

    reader.onloadend = () => {
      const result =
        reader.result as string;

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
     SAVE SETTINGS
  ========================== */

  const handleSave = () => {
    setMessage(null);

    /* PASSWORD LAMA KOSONG */

    if (
      !password.oldPassword.trim()
    ) {
      setActiveTab("security");

      showMessage(
        "error",
        "Perubahan tidak dapat disimpan. Password lama wajib diisi."
      );

      return;
    }

    /* PASSWORD BARU KOSONG */

    if (
      !password.newPassword.trim()
    ) {
      setActiveTab("security");

      showMessage(
        "error",
        "Perubahan tidak dapat disimpan. Password baru wajib diisi."
      );

      return;
    }

    /* KONFIRMASI KOSONG */

    if (
      !password.confirmPassword.trim()
    ) {
      setActiveTab("security");

      showMessage(
        "error",
        "Perubahan tidak dapat disimpan. Konfirmasi password baru wajib diisi."
      );

      return;
    }

    /* PASSWORD TERLALU PENDEK */

    if (
      password.newPassword.length < 6
    ) {
      setActiveTab("security");

      showMessage(
        "error",
        "Password baru minimal harus terdiri dari 6 karakter."
      );

      return;
    }

    /* PASSWORD TIDAK SAMA */

    if (
      password.newPassword !==
      password.confirmPassword
    ) {
      setActiveTab("security");

      showMessage(
        "error",
        "Password baru dan konfirmasi password tidak sama."
      );

      return;
    }

    /* DATA YANG DISIMPAN */

    const settingsData = {
      profile,
      store,
      notifications,
      profileImage,
      storeLogo,
    };

    try {
      localStorage.setItem(
        "tapjaya-settings",
        JSON.stringify(settingsData)
      );
    } catch {
      // Jika localStorage penuh,
      // data masih tetap berada
      // pada state selama halaman aktif.
    }

    showMessage(
      "success",
      "Perubahan berhasil disimpan."
    );

    /* PINDAH KE HALAMAN SUKSES */

    setTimeout(() => {
      router.push(
        "/settings/success"
      );
    }, 1000);
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
              {message.type ===
              "success" ? (
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
              onClick={() =>
                setMessage(null)
              }
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
                  setActiveTab(
                    tab.id
                  );

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
                  ref={
                    profileInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      e,
                      "profile"
                    )
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
                  JPG, PNG, WEBP
                  (maks. 2MB)
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
                      name:
                        e.target.value,
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
                  value={
                    profile.email
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      email:
                        e.target.value,
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
                  value={
                    profile.phone
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      phone:
                        e.target.value,
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
                  value={
                    profile.position
                  }
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      position:
                        e.target.value,
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
                  ref={
                    storeInputRef
                  }
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) =>
                    handleImageUpload(
                      e,
                      "store"
                    )
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
                  JPG, PNG, WEBP
                  (maks. 2MB)
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
                      name:
                        e.target.value,
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
                  value={
                    store.address
                  }
                  onChange={(e) =>
                    setStore({
                      ...store,
                      address:
                        e.target.value,
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
                      phone:
                        e.target.value,
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
                  value={
                    store.email
                  }
                  onChange={(e) =>
                    setStore({
                      ...store,
                      email:
                        e.target.value,
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
                      open:
                        e.target.value,
                    })
                  }
                  className="h-[38px] w-[130px] rounded-lg border border-gray-200 px-3 text-[11px] outline-none focus:border-red-400"
                />

                <span className="text-[10px] text-gray-500">
                  Sampai
                </span>

                <input
                  type="time"
                  value={
                    store.close
                  }
                  onChange={(e) =>
                    setStore({
                      ...store,
                      close:
                        e.target.value,
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

        {activeTab ===
          "notification" && (
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
                    Notifikasi stok menu
                    menipis
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
                    Notifikasi laporan
                    harian
                  </p>

                  <p className="mt-1 text-[9px] text-gray-400">
                    Dapatkan ringkasan
                    laporan penjualan setiap
                    hari.
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
                  value={
                    password.oldPassword
                  }
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      oldPassword:
                        e.target.value,
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
                  value={
                    password.newPassword
                  }
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      newPassword:
                        e.target.value,
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
                  value={
                    password.confirmPassword
                  }
                  onChange={(e) => {
                    setPassword({
                      ...password,
                      confirmPassword:
                        e.target.value,
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
            className="flex h-[40px] items-center gap-2 rounded-lg bg-[#e63131] px-5 text-[11px] font-semibold text-white transition hover:bg-[#ca2929]"
          >
            <Save size={15} />

            Simpan Perubahan
          </button>
        </div>
      </section>
    </main>
  );
}