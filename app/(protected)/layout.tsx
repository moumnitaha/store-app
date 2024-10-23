"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";
import Link from "next/link";
import {
  HomeIcon,
  BuildingStorefrontIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

export default function Layout({ children, session }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });

  const router = useRouter();
  const location = usePathname();

  useEffect(() => {
    const checkSession = async () => {
      fetch("/api/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 401) {
            console.error("Unauthorized");
            router.push("/login");
          } else if (data.status === 200) {
            console.log("Authorized: ", data);
            setUser({
              name: data.data.name,
              email: data.data.email,
              avatar: data.data.avatar,
            });
            setLoading(false);
          }
        })
        .catch((error) => {
          console.error("Error: ", error);
          router.push("/login");
          setLoading(false);
        });
    };
    checkSession();
  }, []);
  return (
    <div className="bg-gray-100">
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <nav className="flex flex-col items-center justify-start w-60 bg-slate-100 p-4 h-svh fixed z-40 text-gray-900 top-0 left-0">
            <div className="flex flex-col">
              <div className="flex flex-row">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={50}
                  height={50}
                  className="rounded-full"
                />
                <div className="flex flex-col ml-4">
                  <h2 className="font-bold">{user.name}</h2>
                  <h4 className="text-sm">{user.email}</h4>
                </div>
              </div>
              <hr className="w-full border-t-2 border-gray-300 my-2" />
              <div className="flex flex-col items-center justify-start min-h-svh -mb-36 font-poppins">
                <Link
                  className={`w-48 p-3 ${
                    location === "/home"
                      ? "bg-blue-100 text-blue-500"
                      : "bg-transparent text-gray-800"
                  }   rounded-md font-medium hover:bg-blue-100 m-1`}
                  href="/home"
                >
                  <HomeIcon className="h-5 w-5 inline-block mr-2" />
                  Home
                </Link>
                <Link
                  className={`w-48 p-3 ${
                    location.includes("/product")
                      ? "bg-blue-100 text-blue-500"
                      : "bg-transparent text-gray-800"
                  } rounded-md font-medium hover:bg-blue-100 m-1`}
                  href="/products"
                >
                  <BuildingStorefrontIcon className="h-5 w-5 inline-block mr-2" />
                  Products
                </Link>
                <Link
                  className={`w-48 p-3 ${
                    location === "/addProduct"
                      ? "bg-blue-100 text-blue-500"
                      : "bg-transparent text-gray-800"
                  } rounded-md font-medium hover:bg-blue-100 m-1`}
                  href="/addProduct"
                >
                  <PlusCircleIcon className="h-5 w-5 inline-block mr-2" />
                  Add Product
                </Link>
                {/* <Link
                  className={`w-48 p-3 ${
                    location === "/orders"
                      ? "bg-blue-100 text-blue-500"
                      : "bg-transparent text-gray-800"
                  } rounded-md font-medium hover:bg-blue-100 m-1`}
                  href="/orders"
                >
                  <ClipboardDocumentListIcon className="h-5 w-5 inline-block mr-2" />
                  Orders
                </Link>
                <Link
                  className={`w-48 p-3 ${
                    location === "/addOrder"
                      ? "bg-blue-100 text-blue-500"
                      : "bg-transparent text-gray-800"
                  } rounded-md font-medium hover:bg-blue-100 m-1`}
                  href="/addOrder"
                >
                  <PlusIcon className="h-5 w-5 inline-block mr-2" />
                  Add Order
                </Link> */}
                <Link
                  className={`w-48 p-3 ${
                    location === "/settings"
                      ? "bg-blue-100 text-blue-500"
                      : "bg-transparent text-gray-800"
                  } rounded-md font-medium hover:bg-blue-100 m-1`}
                  href="/settings"
                >
                  <Cog6ToothIcon className="h-5 w-5 inline-block mr-2" />
                  Settings
                </Link>
              </div>
              <button
                onClick={() => signOut()}
                className="w-48 p-3 bg-transparent text-red-500 border border-red-500 rounded-md font-medium hover:bg-red-500 hover:text-white font-poppins"
              >
                LOGOUT
              </button>
            </div>
          </nav>
          {children}
        </div>
      )}
    </div>
  );
}
