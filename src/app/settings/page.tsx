"use client";

import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import "./settings.css";

type SectionName =
  | "profile"
  | "store"
  | "notification"
  | "security";

type FormDataType = {
  fullName: string;
  email: string;
  phone: string;
  position: string;

  storeName: string;
  address: string;
  storePhone: string;
  storeEmail: string;

  openTime: string;
  closeTime: string;

  oldPassword: string;
  newPassword: string;
  confirmPassword: string;

  profileImage: string;
  storeLogo: string;

  newOrderNotification: boolean;
  lowStockNotification: boolean;
  dailyReportNotification: boolean;
};

const initialForm: FormDataType = {
  fullName: "",
  email: "",
  phone: "",
  position: "",

  storeName: "",
  address: "",
  storePhone: "",
  storeEmail: "",

  openTime: "",
  closeTime: "",

  oldPassword: "",
  newPassword: "",
  confirmPassword: "",

  profileImage: "",
  storeLogo: "/images/tapjaya-logo.png",

  newOrderNotification: true,
  lowStockNotification: true,
  dailyReportNotification: false,
};

/* =========================
   ICONS
========================= */

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M3 10.8 12 3l9 7.8v9.7a.5.5 0 0 1-.5.5H14v-6h-4v6H3.5a.5.5 0 0 1-.5-.5v-9.7Z" />
    </svg>
  );
}

function OrderIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M7 4h2V2h6v2h2v2h3v16H4V6h3V4Zm4 0v2h2V4h-2Zm-2 7 2.2 2.2L16 8.5l1.4 1.4-6.2 6.2L7.6 12.5 9 11Z" />
    </svg>
  );
}

function ProductIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M5 4h14v16H5v-5H2V9h3V4Zm2 3v10h10V7H7Zm-3 4v2h3v-2H4Zm5-2h6v2H9V9Zm0 4h6v2H9v-2Z" />
    </svg>
  );
}

function ReportIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 2h9l5 5v15H6V2Zm8 2.5V8h3.5L14 4.5ZM9 12h8v1.8H9V12Zm0 4h8v1.8H9V16Z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path d="m19.2 13.2.1-1.2-.1-1.2 2-1.5-2-3.4-2.5 1a8 8 0 0 0-2-1.1L14.4 3H9.6l-.4 2.8a8 8 0 0 0-2 1.1l-2.5-1-2 3.4 2 1.5-.1 1.2.1 1.2-2 1.5 2 3.4 2.5-1a8 8 0 0 0 2 1.1l.4 2.8h4.8l.4-2.8a8 8 0 0 0 2-1.1l2.5 1 2-3.4-2.1-1.5ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z" />
    </svg>
  );
}

function UserOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="8"
        r="3.3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M5.5 20a6.5 6.5 0 0 1 13 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M4 10h16v10H4V10Zm1-6h14l2 5H3l2-5ZM8 10v10M16 10v10M8 14h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M18 8a6 6 0 0 0-12 0c0 6-2.5 7-2.5 7h17S18 14 18 8ZM10 19h4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M12 3 19 6v5c0 4.8-2.9 8.2-7 10-4.1-1.8-7-5.2-7-10V6l7-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 8v5M12 16h.01"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 24 24">
      <path
        d="M4 7h4l1.5-2h5L16 7h4v12H4V7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="13"
        r="3.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

/* =========================
   PAGE
========================= */

export default function SettingsPage() {
  const [activeSection, setActiveSection] =
    useState<SectionName>("profile");

  const [form, setForm] =
    useState<FormDataType>(initialForm);

  const [message, setMessage] = useState("");

  const profileRef = useRef<HTMLDivElement | null>(null);
  const storeRef = useRef<HTMLDivElement | null>(null);
  const notificationRef = useRef<HTMLDivElement | null>(null);
  const securityRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(
      "tapjaya-settings"
    );

    if (!saved) return;

    try {
      const parsed = JSON.parse(saved);

      setForm((current) => ({
        ...current,
        ...parsed,
      }));
    } catch {
      console.error("Data settings tidak dapat dibaca");
    }
  }, []);

  function scrollToSection(section: SectionName) {
    setActiveSection(section);

    const refs = {
      profile: profileRef,
      store: storeRef,
      notification: notificationRef,
      security: securityRef,
    };

    refs[section].current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function updateField(
    field: keyof FormDataType,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    field: "profileImage" | "storeLogo"
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setMessage(
        "Format gambar harus JPG, PNG, atau WEBP."
      );
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage(
        "Ukuran gambar maksimal 2MB."
      );
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result !== "string") return;

      updateField(field, result);

      setMessage("Foto berhasil dipilih.");
    };

    reader.readAsDataURL(file);
  }

  function handleSave(event: FormEvent) {
    event.preventDefault();

    if (
      form.newPassword &&
      form.newPassword !== form.confirmPassword
    ) {
      setMessage(
        "Konfirmasi password baru tidak sama."
      );
      return;
    }

    localStorage.setItem(
      "tapjaya-settings",
      JSON.stringify(form)
    );

    setMessage("Perubahan berhasil disimpan.");

    window.setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  return (
    <main className="settings-page">
      <div className="settings-layout">

        {/* ======================
            SIDEBAR
        ====================== */}

        <aside className="settings-sidebar">
          <div className="settings-logo">
            <img
              src="/images/tapjaya-logo.png"
              alt="TAP JAYA"
            />
          </div>

          <nav className="settings-navigation">

            <Link
              href="/dashboard"
              className="settings-nav-item"
            >
              <span>
                <DashboardIcon />
              </span>

              Dashboard
            </Link>

            <Link
              href="/orders"
              className="settings-nav-item"
            >
              <span>
                <OrderIcon />
              </span>

              Pesanan
            </Link>

            <Link
              href="/products"
              className="settings-nav-item"
            >
              <span>
                <ProductIcon />
              </span>

              Menu Produk
            </Link>

            <Link
              href="/reports"
              className="settings-nav-item"
            >
              <span>
                <ReportIcon />
              </span>

              Laporan
            </Link>

            <Link
              href="/settings"
              className="settings-nav-item active"
            >
              <span>
                <SettingsIcon />
              </span>

              Pengaturan
            </Link>

          </nav>
        </aside>

        {/* ======================
            CONTENT
        ====================== */}

        <section className="settings-content">

          <header className="settings-header">
            <h1>Pengaturan</h1>

            <p>
              Kelola Informasi akun, toko, dan preferensi sistem TapJaya
            </p>
          </header>

          {/* ======================
              CATEGORY TABS
          ====================== */}

          <nav className="settings-tabs">

            <button
              type="button"
              className={
                activeSection === "profile"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("profile")
              }
            >
              <UserOutlineIcon />

              <span>Profil & Akun</span>
            </button>

            <button
              type="button"
              className={
                activeSection === "store"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("store")
              }
            >
              <StoreIcon />

              <span>Informasi Toko</span>
            </button>

            <button
              type="button"
              className={
                activeSection === "notification"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("notification")
              }
            >
              <BellIcon />

              <span>Notifikasi</span>
            </button>

            <button
              type="button"
              className={
                activeSection === "security"
                  ? "active"
                  : ""
              }
              onClick={() =>
                scrollToSection("security")
              }
            >
              <ShieldIcon />

              <span>Keamanan</span>
            </button>

          </nav>

          <form
            onSubmit={handleSave}
            className="settings-form"
          >

            <div className="settings-columns">

              {/* ======================
                  LEFT
              ====================== */}

              <div className="settings-column-left">

                {/* PROFILE */}

                <section
                  ref={profileRef}
                  className={`settings-card ${
                    activeSection === "profile"
                      ? "focused-card"
                      : ""
                  }`}
                >
                  <h2>Profil Admin</h2>

                  <p className="card-description">
                    Kelola informasi akun admin yang digunakan untuk mengakses sistem
                  </p>

                  <div className="profile-upload-row">

                    <label className="profile-photo">

                      {form.profileImage ? (
                        <img
                          src={form.profileImage}
                          alt="Foto profil"
                        />
                      ) : (
                        <CameraIcon />
                      )}

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) =>
                          handleImageUpload(
                            event,
                            "profileImage"
                          )
                        }
                      />

                    </label>

                    <div className="upload-info">
                      <label className="upload-button">
                        Pilih Foto

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) =>
                            handleImageUpload(
                              event,
                              "profileImage"
                            )
                          }
                        />
                      </label>

                      <span>
                        JPG, PNG (maks. 2MB)
                      </span>
                    </div>

                  </div>

                  <div className="form-group">
                    <label>
                      Nama Lengkap
                    </label>

                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(event) =>
                        updateField(
                          "fullName",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Email</label>

                    <input
                      type="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Nomor Telepon
                    </label>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(event) =>
                        updateField(
                          "phone",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>Jabatan</label>

                    <input
                      type="text"
                      value={form.position}
                      onChange={(event) =>
                        updateField(
                          "position",
                          event.target.value
                        )
                      }
                    />
                  </div>

                </section>

                {/* PASSWORD */}

                <section
                  ref={securityRef}
                  className={`settings-card password-card ${
                    activeSection === "security"
                      ? "focused-card"
                      : ""
                  }`}
                >
                  <h2>Ubah Password</h2>

                  <p className="card-description">
                    Gunakan password yang kuat untuk menjaga keamanan akun.
                  </p>

                  <div className="form-group">
                    <label>
                      Password Lama
                    </label>

                    <input
                      type="password"
                      value={form.oldPassword}
                      onChange={(event) =>
                        updateField(
                          "oldPassword",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Password Baru
                    </label>

                    <input
                      type="password"
                      value={form.newPassword}
                      onChange={(event) =>
                        updateField(
                          "newPassword",
                          event.target.value
                        )
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label>
                      Konfirmasi Password Baru
                    </label>

                    <input
                      type="password"
                      value={
                        form.confirmPassword
                      }
                      onChange={(event) =>
                        updateField(
                          "confirmPassword",
                          event.target.value
                        )
                      }
                    />
                  </div>

                </section>

              </div>

              {/* ======================
                  RIGHT
              ====================== */}

              <div className="settings-column-right">

                {/* STORE */}

                <section
                  ref={storeRef}
                  className={`settings-card ${
                    activeSection === "store"
                      ? "focused-card"
                      : ""
                  }`}
                >
                  <h2>
                    Informasi Toko
                  </h2>

                  <p className="card-description">
                    Kelola informasi dasar usaha TapJaya yang akan ditampilkan pada sistem
                  </p>

                  <div className="store-logo-row">

                    <span className="store-logo-label">
                      Logo Toko
                    </span>

                    <label className="store-logo-preview">
                      <img
                        src={
                          form.storeLogo ||
                          "/images/tapjaya-logo.png"
                        }
                        alt="Logo toko"
                      />

                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) =>
                          handleImageUpload(
                            event,
                            "storeLogo"
                          )
                        }
                      />
                    </label>

                    <div className="upload-info">

                      <label className="upload-button compact">
                        Pilih Foto

                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) =>
                            handleImageUpload(
                              event,
                              "storeLogo"
                            )
                          }
                        />
                      </label>

                      <span>
                        JPG, PNG (maks. 2MB)
                      </span>

                    </div>

                  </div>

                  <div className="two-column-fields">

                    <div className="form-group">
                      <label>Nama Toko</label>

                      <input
                        type="text"
                        value={form.storeName}
                        onChange={(event) =>
                          updateField(
                            "storeName",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Alamat</label>

                      <input
                        type="text"
                        value={form.address}
                        onChange={(event) =>
                          updateField(
                            "address",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Nomor Telepon
                      </label>

                      <input
                        type="tel"
                        value={
                          form.storePhone
                        }
                        onChange={(event) =>
                          updateField(
                            "storePhone",
                            event.target.value
                          )
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Email</label>

                      <input
                        type="email"
                        value={
                          form.storeEmail
                        }
                        onChange={(event) =>
                          updateField(
                            "storeEmail",
                            event.target.value
                          )
                        }
                      />
                    </div>

                  </div>

                  <div className="form-group">
                    <label>
                      Jam Operasional
                    </label>

                    <div className="time-fields">

                      <input
                        type="time"
                        value={form.openTime}
                        onChange={(event) =>
                          updateField(
                            "openTime",
                            event.target.value
                          )
                        }
                      />

                      <span>Sampai</span>

                      <input
                        type="time"
                        value={form.closeTime}
                        onChange={(event) =>
                          updateField(
                            "closeTime",
                            event.target.value
                          )
                        }
                      />

                    </div>
                  </div>

                </section>

                {/* NOTIFICATION */}

                <section
                  ref={notificationRef}
                  className={`settings-card notification-card ${
                    activeSection === "notification"
                      ? "focused-card"
                      : ""
                  }`}
                >
                  <h2>Notifikasi</h2>

                  <p className="card-description">
                    Atur notifikasi yang ingin diterima oleh admin.
                  </p>

                  <div className="notification-setting">

                    <button
                      type="button"
                      className={`toggle ${
                        form.newOrderNotification
                          ? "on"
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "newOrderNotification",
                          !form.newOrderNotification
                        )
                      }
                    >
                      <span />
                    </button>

                    <div>
                      <strong>
                        Notifikasi pesanan baru
                      </strong>

                      <p>
                        Dapatkan notifikasi saat pesanan baru masuk
                      </p>
                    </div>

                  </div>

                  <div className="notification-setting">

                    <button
                      type="button"
                      className={`toggle ${
                        form.lowStockNotification
                          ? "on"
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "lowStockNotification",
                          !form.lowStockNotification
                        )
                      }
                    >
                      <span />
                    </button>

                    <div>
                      <strong>
                        Notifikasi stock menu menipis
                      </strong>

                      <p>
                        Dapatkan notifikasi saat stok menu menipis
                      </p>
                    </div>

                  </div>

                  <div className="notification-setting">

                    <button
                      type="button"
                      className={`toggle ${
                        form.dailyReportNotification
                          ? "on"
                          : ""
                      }`}
                      onClick={() =>
                        updateField(
                          "dailyReportNotification",
                          !form.dailyReportNotification
                        )
                      }
                    >
                      <span />
                    </button>

                    <div>
                      <strong>
                        Notifikasi laporan harian
                      </strong>

                      <p>
                        Dapatkan ringkasan laporan penjualan setiap hari
                      </p>
                    </div>

                  </div>

                </section>

              </div>

            </div>

            {/* MESSAGE */}

            {message && (
              <div className="settings-message">
                {message}
              </div>
            )}

            {/* SAVE */}

            <div className="save-area">
              <button
                type="submit"
                className="save-button"
              >
                Simpan Perubahan
              </button>
            </div>

          </form>

        </section>

      </div>
    </main>
  );
}