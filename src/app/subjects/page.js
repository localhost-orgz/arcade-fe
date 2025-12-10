// app/subjects/page.js
"use client";

import React from "react";
import List from "@/components/CardSubjects/List";
import AuthGuard from "@/utils/authGuard";
// Hapus semua import yang sudah tidak terpakai: useSearchParams, useRouter, useEffect, toast

import { Suspense } from "react";
// Import komponen reusable yang baru
import URLParamToastHandler from "@/components/URLParamToastHandler";

export default function Subjects() {
  return (
    <AuthGuard>
      {/* SOLUSI REUSABLE DENGAN SUSPENSE */}
      <Suspense fallback={null}>
        <URLParamToastHandler
          paramName="loggedIn"
          paramValue="true"
          toastMessage="Login berhasil!"
          toastDescription="Rasakan pengalaman belajar menggunakan AR🔥"
          replacePath="/subjects" // URL yang akan dituju setelah parameter dibersihkan
        />
      </Suspense>
      {/* AKHIR DARI SOLUSI */}

      <div className="h-full max-w-[912px] px-3 mx-auto">
        <h1 className="text-2xl font-bold text-neutral-700">Mata Pelajaran</h1>
        <p className="text-sm text-neutral-600 mb-4">
          Pilih mata pelajaran yang ingin kamu pelajari dan jelajahi materi yang tersedia.
        </p>
        <List />
      </div>
    </AuthGuard>
  );
}
