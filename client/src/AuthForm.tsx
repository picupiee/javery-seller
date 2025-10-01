import React, { useState } from "react";
import { Router, useNavigate } from "react-router-dom";

export default function AuthForm() {
  const [activeForm, setActiveForm] = useState<"login" | "register">("login");
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Login/Register Form (hidden on 2xl and above) */}
      <div className="mt-50">
        <div className="flex flex-col items-center justify-center p-4 2xl:hidden">
          <h1 className="text-2xl font-semibold text-center mb-4">
            Selamat Datang di Javery Sellers
          </h1>
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${
                activeForm === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition-all duration-300`}
              onClick={() => setActiveForm("login")}
            >
              Masuk
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeForm === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition-all duration-300`}
              onClick={() => setActiveForm("register")}
            >
              Daftar
            </button>
          </div>
          <div className="relative w-full max-w-xs">
            {/* Login Form */}
            <div
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                activeForm === "login"
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 -translate-x-10 z-0 pointer-events-none"
              } p-6 rounded-lg shadow-md bg-gradient-to-tl from-slate-100 to-white to-90%`}
            >
              <h1 className="text-xl font-semibold mb-2 text-center">Masuk</h1>
              <input
                type="text"
                placeholder="Username / Email"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <input
                type="password"
                placeholder="Kata Sandi"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-2"
                onClick={() => navigate("/dashboard")}
              >
                Masuk
              </button>
            </div>
            {/* Register Form */}
            <div
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                activeForm === "register"
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 translate-x-10 z-0 pointer-events-none"
              } p-6 rounded-lg shadow-md bg-gradient-to-tl from-slate-100 to-white to-90%`}
            >
              <h1 className="text-xl font-semibold mb-2 text-center">Daftar</h1>
              <input
                type="text"
                placeholder="Username"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <input
                type="password"
                placeholder="Kata Sandi"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-2"
                onClick={() => navigate("/dashboard")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Desktop Login/Register Form (hidden below 2xl) */}
      <div className="min-h-screen flex-col p-4 hidden 2xl:flex">
        <h1 className="text-[60px] font-semibold text-center">
          Selamat Datang di Javery Sellers
        </h1>
        <div className="mt-2 flex flex-col items-center justify-center">
          <div className="flex gap-4 mb-4">
            <button
              className={`px-4 py-2 rounded-md ${
                activeForm === "login"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition-all duration-300 hover:shadow-lg`}
              onClick={() => setActiveForm("login")}
            >
              Masuk
            </button>
            <button
              className={`px-4 py-2 rounded-md ${
                activeForm === "register"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } transition-all duration-300 hover:shadow-lg`}
              onClick={() => setActiveForm("register")}
            >
              Daftar
            </button>
          </div>
          <div className="relative w-full max-w-md">
            {/* Login Form */}
            <div
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                activeForm === "login"
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 -translate-x-10 z-0 pointer-events-none"
              } p-6 rounded-lg shadow-md bg-gradient-to-tl from-slate-100 to-white to-90%`}
            >
              <h1 className="text-2xl font-semibold mb-2">Masuk</h1>
              <input
                type="text"
                placeholder="Username / Email"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <input
                type="password"
                placeholder="Kata Sandi"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-2 cursor-pointer transition-colors hover:bg-blue-400"
                onClick={() => navigate("/dashboard")}
              >
                Login
              </button>
            </div>
            {/* Register Form */}
            <div
              className={`absolute top-0 left-0 w-full transition-all duration-500 ${
                activeForm === "register"
                  ? "opacity-100 translate-x-0 z-10"
                  : "opacity-0 translate-x-10 z-0 pointer-events-none"
              } p-6 rounded-lg shadow-md bg-gradient-to-tl from-slate-100 to-white to-90%`}
            >
              <h1 className="text-2xl font-semibold mb-2">Daftar</h1>
              <input
                type="text"
                placeholder="Username"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <input
                type="password"
                placeholder="Kata Sandi"
                className="border p-2 rounded-md mb-2 w-full"
              />
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded-md w-full mt-2 cursor-pointer transition-colors hover:bg-blue-400"
                onClick={() => navigate("/dashboard")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
