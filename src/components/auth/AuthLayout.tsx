"use client";

import Image from "next/image";
import React from "react";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-white">
      <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
        
        {/* LEFT */}
        <section className="hidden items-center justify-center bg-[#fffdf8] px-8 md:flex">
          <div className="flex w-full max-w-[420px] flex-col items-center">
            
            <Image
              src="/images/tapjaya-logo.png"
              alt="TAP JAYA"
              width={260}
              height={180}
              priority
              className="h-auto w-[220px] object-contain"
            />

            <div className="mt-10 text-center">
              <h2 className="font-serif text-[40px] font-semibold leading-tight text-[#111111]">
                Selamat Datang,
              </h2>

              <h2 className="font-serif text-[46px] font-semibold leading-tight text-[#df2d2d]">
                Admin
              </h2>
            </div>
          </div>
        </section>

        {/* RIGHT */}
        <section className="flex items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-16">
          <div className="w-full max-w-[440px]">
            {children}
          </div>
        </section>

      </div>
    </main>
  );
}