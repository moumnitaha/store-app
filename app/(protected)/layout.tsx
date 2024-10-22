"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Layout({ children, session }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  });
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
            // router.push("/login");
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
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <h1>Loading...</h1>
        </div>
      ) : (
        <div>
          <div className="flex justify-between items-center bg-stone-600 p-4 fixed w-full shadow-md">
            <h1 className="text-3xl font-bold text-white">NextAuth</h1>
            <div className="flex flex-row">
              <Image
                src={user.avatar}
                alt={user.name}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div className="flex flex-col ml-4">
                <h2 className="text-white">{user.name}</h2>
                <h4 className="text-white">{user.email}</h4>
              </div>
              <button
                className="bg-red-500 text-white rounded-md p-2 ml-4"
                onClick={() => signOut()}
              >
                Sign Out
              </button>
            </div>
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
