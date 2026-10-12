


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { authClient } from "@/lib/auth-client";

// type Category = {
//     slug: string;
//     nameBn: string;
//     icon?: string;
// };

// export default function Navbar() {
//     const [date, setDate] = useState("");
//     const [weekday, setWeekday] = useState("");
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [loggingOut, setLoggingOut] = useState(false);
//     const [profileOpen, setProfileOpen] = useState(false);

//     const pathname = usePathname();
//     const profileRef = useRef<HTMLDivElement>(null);

//     // Logged-in user session
//     const { data: session, isPending } = authClient.useSession();

//     // Bengali date and weekday
//     useEffect(() => {
//         const today = new Date();

//         setDate(
//             today.toLocaleDateString("bn-BD", {
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//             })
//         );

//         setWeekday(
//             today.toLocaleDateString("bn-BD", {
//                 weekday: "long",
//             })
//         );
//     }, []);

//     // Fetch categories from API
//     useEffect(() => {
//         async function fetchCategories() {
//             try {
//                 const response = await fetch(
//                     "https://api.abcz.workers.dev/api/bazardor/categories"
//                 );

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch categories");
//                 }

//                 const data: Category[] = await response.json();
//                 setCategories(data);
//             } catch (error) {
//                 console.error("Failed to fetch categories:", error);
//             }
//         }

//         fetchCategories();
//     }, []);

//     // Close profile dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (
//                 profileRef.current &&
//                 !profileRef.current.contains(event.target as Node)
//             ) {
//                 setProfileOpen(false);
//             }
//         }

//         function handleEscape(event: KeyboardEvent) {
//             if (event.key === "Escape") {
//                 setProfileOpen(false);
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside);
//         document.addEventListener("keydown", handleEscape);

//         return () => {
//             document.removeEventListener(
//                 "mousedown",
//                 handleClickOutside
//             );
//             document.removeEventListener("keydown", handleEscape);
//         };
//     }, []);

//     // Sign out
//     async function handleSignOut() {
//         if (loggingOut) return;

//         setLoggingOut(true);

//         try {
//             const { error } = await authClient.signOut();

//             if (error) {
//                 console.error("Sign out failed:", error);
//                 setLoggingOut(false);
//                 return;
//             }

//             window.location.href = "/signin";
//         } catch (error) {
//             console.error("Sign out failed:", error);
//             setLoggingOut(false);
//         }
//     }

//     return (
//         <nav className="sticky top-0 z-50 bg-white">
//             <div className="mx-auto max-w-6xl px-4 py-4">
//                 {/* Top Row */}
//                 <div className="flex items-center justify-between gap-4">
//                     {/* Logo and Date */}
//                     <div className="shrink-0">
//                         <Link href="/">
//                             <h1 className="text-2xl font-bold">
//                                 <svg
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24"
//                                     fill="none"
//                                     stroke="#00843D"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     className="mr-1 inline-block h-6 w-6"
//                                 >
//                                     <circle cx="9" cy="20" r="1" />
//                                     <circle cx="19" cy="20" r="1" />
//                                     <path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L21 8H6" />
//                                 </svg>

//                                 <span className="text-[#1D271F]">
//                                     বাজার দর
//                                 </span>
//                             </h1>
//                         </Link>

//                         <p className="mt-1 text-sm text-[#1D271F]">
//                             {weekday} • {date}
//                         </p>
//                     </div>

//                     {/* Authentication */}
//                     <div className="flex min-w-0 items-center justify-end">
//                         {isPending ? (
//                             <span className="text-sm text-gray-500">
//                                 অপেক্ষা করো...
//                             </span>
//                         ) : session?.user ? (
//                             /* Logged-in user profile */
//                             <div
//                                 className="relative"
//                                 ref={profileRef}
//                             >
//                                 {/* Top-right profile button */}
//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setProfileOpen((prev) => !prev)
//                                     }
//                                     aria-expanded={profileOpen}
//                                     aria-haspopup="true"
//                                     aria-label="প্রোফাইল মেনু"
//                                     className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-gray-50"
//                                 >
//                                     {/* Google profile picture */}
//                                     <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">
//                                         {session.user.image ? (
//                                             <img
//                                                 src={session.user.image}
//                                                 alt="প্রোফাইল ছবি"
//                                                 referrerPolicy="no-referrer"
//                                                 className="h-full w-full object-cover"
//                                             />
//                                         ) : (
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="#05893E"
//                                                 strokeWidth="1.5"
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 className="h-6 w-6"
//                                             >
//                                                 <circle
//                                                     cx="12"
//                                                     cy="8"
//                                                     r="4"
//                                                 />
//                                                 <path d="M5 21a7 7 0 0 1 14 0" />
//                                             </svg>
//                                         )}
//                                     </div>

//                                     {/* Dynamic user name */}
//                                     <span className="max-w-[100px] truncate text-sm font-medium text-[#1D271F]">
//                                         {session.user.name || "ব্যবহারকারী"}
//                                     </span>

//                                     {/* Dropdown arrow */}
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="1.8"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""
//                                             }`}
//                                     >
//                                         <path d="m6 9 6 6 6-6" />
//                                     </svg>
//                                 </button>

//                                 {/* Figma-style dropdown card */}
//                                 {profileOpen && (
//                                     <div
//                                         role="menu"
//                                         className="absolute right-0 top-full z-[60] mt-2 w-[250px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
//                                     >
//                                         {/* Dynamic user information */}
//                                         <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
//                                             <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">
//                                                 {session.user.image ? (
//                                                     <img
//                                                         src={session.user.image}
//                                                         alt="প্রোফাইল ছবি"
//                                                         referrerPolicy="no-referrer"
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 24 24"
//                                                         fill="none"
//                                                         stroke="#05893E"
//                                                         strokeWidth="1.5"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         className="h-6 w-6"
//                                                     >
//                                                         <circle
//                                                             cx="12"
//                                                             cy="8"
//                                                             r="4"
//                                                         />
//                                                         <path d="M5 21a7 7 0 0 1 14 0" />
//                                                     </svg>
//                                                 )}
//                                             </div>

//                                             <div className="min-w-0 flex-1">
//                                                 <p className="truncate text-sm font-semibold text-[#1D271F]">
//                                                     {session.user.name ||
//                                                         "ব্যবহারকারী"}
//                                                 </p>

//                                                 <p className="mt-0.5 break-all text-xs text-gray-500">
//                                                     {session.user.email}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Dropdown menu items */}
//                                         <div className="p-2">
//                                             <Link
//                                                 href="/profile"
//                                                 role="menuitem"
//                                                 onClick={() =>
//                                                     setProfileOpen(false)
//                                                 }
//                                                 className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#1D271F] transition hover:bg-gray-50"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="1.7"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     className="h-4 w-4 text-gray-500"
//                                                 >
//                                                     <circle
//                                                         cx="12"
//                                                         cy="8"
//                                                         r="4"
//                                                     />
//                                                     <path d="M5 21a7 7 0 0 1 14 0" />
//                                                 </svg>

//                                                 আমার প্রোফাইল
//                                             </Link>

//                                             {/* Red sign-out button */}
//                                             {/* <button
//                                                 type="button"
//                                                 role="menuitem"
//                                                 onClick={handleSignOut}
//                                                 disabled={loggingOut}
//                                                 className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="1.8"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     className="h-4 w-4"
//                                                 >
//                                                     <path d="M10 17l5-5-5-5" />
//                                                     <path d="M15 12H3" />
//                                                     <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
//                                                 </svg>

//                                                 {loggingOut
//                                                     ? "লগআউট হচ্ছে..."
//                                                     : "সাইন আউট"}
//                                             </button> */}





//                                             {/* Red sign-out button */}
//                                             <button
//                                                 type="button"
//                                                 role="menuitem"
//                                                 onClick={handleSignOut}
//                                                 disabled={loggingOut}
//                                                 className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="1.8"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     className="h-4 w-4 shrink-0"
//                                                 >
//                                                     <path d="M9 14 4 9l5-5" />
//                                                     <path d="M4 9h10a5 5 0 0 1 5 5v1" />
//                                                 </svg>

//                                                 {loggingOut ? "লগআউট হচ্ছে..." : "সাইন আউট"}
//                                             </button>











//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             /* Not logged in */
//                             <div className="flex items-center gap-2 sm:gap-3">
//                                 <Link
//                                     href="/signin"
//                                     className="rounded-lg px-3 py-2 text-sm text-[#1D271F] transition hover:bg-gray-100 sm:px-4"
//                                 >
//                                     সাইন ইন
//                                 </Link>

//                                 <Link
//                                     href="/signup"
//                                     className="rounded-lg bg-[#05893E] px-3 py-2 text-sm text-white transition hover:bg-[#047533] sm:px-4"
//                                 >
//                                     সাইন আপ
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Dynamic Category Navigation */}
//                 <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3">
//                     {categories.map((category) => {
//                         const isActive =
//                             pathname === `/category/${category.slug}`;

//                         return (
//                             <Link
//                                 key={category.slug}
//                                 href={`/category/${category.slug}`}
//                                 className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition ${isActive
//                                         ? "bg-[#05893E] text-white"
//                                         : "text-[#1D271F] hover:bg-gray-100 hover:text-[#05893E]"
//                                     }`}
//                             >
//                                 {category.icon && (
//                                     <span className="mr-1">
//                                         {category.icon}
//                                     </span>
//                                 )}

//                                 {category.nameBn}
//                             </Link>
//                         );
//                     })}
//                 </div>
//             </div>
//         </nav>
//     );
// }



// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useEffect, useRef, useState } from "react";
// import { authClient } from "@/lib/auth-client";

// type Category = {
//     slug: string;
//     nameBn: string;
//     icon?: string;
// };

// export default function Navbar() {
//     const [date, setDate] = useState("");
//     const [weekday, setWeekday] = useState("");
//     const [categories, setCategories] = useState<Category[]>([]);
//     const [loggingOut, setLoggingOut] = useState(false);
//     const [profileOpen, setProfileOpen] = useState(false);

//     const pathname = usePathname();
//     const profileRef = useRef<HTMLDivElement>(null);

//     const { data: session, isPending } = authClient.useSession();

//     // Bengali date and weekday
//     useEffect(() => {
//         const today = new Date();

//         setDate(
//             today.toLocaleDateString("bn-BD", {
//                 day: "numeric",
//                 month: "long",
//                 year: "numeric",
//             })
//         );

//         setWeekday(
//             today.toLocaleDateString("bn-BD", {
//                 weekday: "long",
//             })
//         );
//     }, []);

//     // Fetch categories
//     useEffect(() => {
//         async function fetchCategories() {
//             try {
//                 const response = await fetch(
//                     "https://api.abcz.workers.dev/api/bazardor/categories"
//                 );

//                 if (!response.ok) {
//                     throw new Error("Failed to fetch categories");
//                 }

//                 const data: Category[] = await response.json();
//                 setCategories(data);
//             } catch (error) {
//                 console.error("Failed to fetch categories:", error);
//             }
//         }

//         fetchCategories();
//     }, []);

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event: MouseEvent) {
//             if (
//                 profileRef.current &&
//                 !profileRef.current.contains(event.target as Node)
//             ) {
//                 setProfileOpen(false);
//             }
//         }

//         function handleEscape(event: KeyboardEvent) {
//             if (event.key === "Escape") {
//                 setProfileOpen(false);
//             }
//         }

//         document.addEventListener("mousedown", handleClickOutside);
//         document.addEventListener("keydown", handleEscape);

//         return () => {
//             document.removeEventListener(
//                 "mousedown",
//                 handleClickOutside
//             );
//             document.removeEventListener("keydown", handleEscape);
//         };
//     }, []);

//     // Sign out
//     async function handleSignOut() {
//         if (loggingOut) return;

//         setLoggingOut(true);

//         try {
//             const { error } = await authClient.signOut();

//             if (error) {
//                 console.error("Sign out failed:", error);
//                 setLoggingOut(false);
//                 return;
//             }

//             window.location.href = "/signin";
//         } catch (error) {
//             console.error("Sign out failed:", error);
//             setLoggingOut(false);
//         }
//     }

//     return (
//         <nav className="sticky top-0 z-50 bg-white">
//             <div className="mx-auto max-w-6xl px-4 py-4">
//                 {/* Top Row */}
//                 <div className="flex items-center justify-between gap-4">
//                     {/* Logo and Date */}
//                     <div className="shrink-0">
//                         <Link
//                             href="/"
//                             className="flex items-center gap-2"
//                         >
//                             <div className="bg-green-700">
//                                 <span className="text-2xl">🛒</span>
//                             </div>

//                             <h1 className="text-2xl font-bold">
//                                 <span className="text-[#1D271F]">
//                                     বাজার দর
//                                 </span>
//                             </h1>
//                         </Link>

//                         <p className="mt-1 text-sm text-[#1D271F]">
//                             {weekday} • {date}
//                         </p>
//                     </div>

//                     {/* Authentication */}
//                     <div className="flex min-w-0 items-center justify-end">
//                         {isPending ? (
//                             <span className="text-sm text-gray-500">
//                                 অপেক্ষা করো...
//                             </span>
//                         ) : session?.user ? (
//                             <div
//                                 className="relative"
//                                 ref={profileRef}
//                             >
//                                 {/* Profile button */}
//                                 <button
//                                     type="button"
//                                     onClick={() =>
//                                         setProfileOpen((prev) => !prev)
//                                     }
//                                     aria-expanded={profileOpen}
//                                     aria-haspopup="true"
//                                     aria-label="প্রোফাইল মেনু"
//                                     className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-gray-50"
//                                 >
//                                     {/* Google profile picture */}
//                                     <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">
//                                         {session.user.image ? (
//                                             <img
//                                                 src={session.user.image}
//                                                 alt="প্রোফাইল ছবি"
//                                                 referrerPolicy="no-referrer"
//                                                 className="h-full w-full object-cover"
//                                             />
//                                         ) : (
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 viewBox="0 0 24 24"
//                                                 fill="none"
//                                                 stroke="#05893E"
//                                                 strokeWidth="1.5"
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 className="h-6 w-6"
//                                             >
//                                                 <circle
//                                                     cx="12"
//                                                     cy="8"
//                                                     r="4"
//                                                 />
//                                                 <path d="M5 21a7 7 0 0 1 14 0" />
//                                             </svg>
//                                         )}
//                                     </div>

//                                     {/* Dynamic user name */}
//                                     <span className="max-w-[100px] truncate text-sm font-medium text-[#1D271F]">
//                                         {session.user.name || "ব্যবহারকারী"}
//                                     </span>

//                                     {/* Dropdown arrow */}
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         viewBox="0 0 24 24"
//                                         fill="none"
//                                         stroke="currentColor"
//                                         strokeWidth="1.8"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${
//                                             profileOpen ? "rotate-180" : ""
//                                         }`}
//                                     >
//                                         <path d="m6 9 6 6 6-6" />
//                                     </svg>
//                                 </button>

//                                 {/* Profile dropdown card */}
//                                 {profileOpen && (
//                                     <div
//                                         role="menu"
//                                         className="absolute right-0 top-full z-[60] mt-2 w-[250px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"
//                                     >
//                                         {/* User information */}
//                                         <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">
//                                             <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">
//                                                 {session.user.image ? (
//                                                     <img
//                                                         src={session.user.image}
//                                                         alt="প্রোফাইল ছবি"
//                                                         referrerPolicy="no-referrer"
//                                                         className="h-full w-full object-cover"
//                                                     />
//                                                 ) : (
//                                                     <svg
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 24 24"
//                                                         fill="none"
//                                                         stroke="#05893E"
//                                                         strokeWidth="1.5"
//                                                         strokeLinecap="round"
//                                                         strokeLinejoin="round"
//                                                         className="h-6 w-6"
//                                                     >
//                                                         <circle
//                                                             cx="12"
//                                                             cy="8"
//                                                             r="4"
//                                                         />
//                                                         <path d="M5 21a7 7 0 0 1 14 0" />
//                                                     </svg>
//                                                 )}
//                                             </div>

//                                             <div className="min-w-0 flex-1">
//                                                 <p className="truncate text-sm font-semibold text-[#1D271F]">
//                                                     {session.user.name ||
//                                                         "ব্যবহারকারী"}
//                                                 </p>

//                                                 <p className="mt-0.5 break-all text-xs text-gray-500">
//                                                     {session.user.email}
//                                                 </p>
//                                             </div>
//                                         </div>

//                                         {/* Dropdown menu */}
//                                         <div className="p-2">
//                                             <Link
//                                                 href="/profile"
//                                                 role="menuitem"
//                                                 onClick={() =>
//                                                     setProfileOpen(false)
//                                                 }
//                                                 className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#1D271F] transition hover:bg-gray-50"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="1.7"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     className="h-4 w-4 text-gray-500"
//                                                 >
//                                                     <circle
//                                                         cx="12"
//                                                         cy="8"
//                                                         r="4"
//                                                     />
//                                                     <path d="M5 21a7 7 0 0 1 14 0" />
//                                                 </svg>

//                                                 আমার প্রোফাইল
//                                             </Link>

//                                             {/* Sign out */}
//                                             <button
//                                                 type="button"
//                                                 role="menuitem"
//                                                 onClick={handleSignOut}
//                                                 disabled={loggingOut}
//                                                 className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
//                                             >
//                                                 <svg
//                                                     xmlns="http://www.w3.org/2000/svg"
//                                                     viewBox="0 0 24 24"
//                                                     fill="none"
//                                                     stroke="currentColor"
//                                                     strokeWidth="1.8"
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     className="h-4 w-4 shrink-0"
//                                                 >
//                                                     <path d="M9 14 4 9l5-5" />
//                                                     <path d="M4 9h10a5 5 0 0 1 5 5v1" />
//                                                 </svg>

//                                                 {loggingOut
//                                                     ? "লগআউট হচ্ছে..."
//                                                     : "সাইন আউট"}
//                                             </button>
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         ) : (
//                             /* Not logged in */
//                             <div className="flex items-center gap-2 sm:gap-3">
//                                 <Link
//                                     href="/signin"
//                                     className="rounded-lg px-3 py-2 text-sm text-[#1D271F] transition hover:bg-gray-100 sm:px-4"
//                                 >
//                                     সাইন ইন
//                                 </Link>

//                                 <Link
//                                     href="/signup"
//                                     className="rounded-lg bg-[#05893E] px-3 py-2 text-sm text-white transition hover:bg-[#047533] sm:px-4"
//                                 >
//                                     সাইন আপ
//                                 </Link>
//                             </div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Dynamic Category Navigation */}
//                 <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3">
//                     {categories.map((category) => {
//                         const isActive =
//                             pathname === `/category/${category.slug}`;

//                         return (
//                             <Link
//                                 key={category.slug}
//                                 href={`/category/${category.slug}`}
//                                 className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition ${
//                                     isActive
//                                         ? "bg-[#05893E] text-white"
//                                         : "text-[#1D271F] hover:bg-gray-100 hover:text-[#05893E]"
//                                 }`}
//                             >
//                                 {category.icon && (
//                                     <span className="mr-1">
//                                         {category.icon}
//                                     </span>
//                                 )}

//                                 {category.nameBn}
//                             </Link>
//                         );
//                     })}
//                 </div>
//             </div>
//         </nav>
//     );
// }

"use client";



import Link from "next/link";

import { usePathname } from "next/navigation";

import { useEffect, useRef, useState } from "react";

import { authClient } from "@/lib/auth-client";



type Category = {

    slug: string;

    nameBn: string;

    icon?: string;

};



export default function Navbar() {

    const [date, setDate] = useState("");

    const [weekday, setWeekday] = useState("");

    const [categories, setCategories] = useState<Category[]>([]);

    const [loggingOut, setLoggingOut] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);



    const pathname = usePathname();

    const profileRef = useRef<HTMLDivElement>(null);



    const { data: session, isPending } = authClient.useSession();



    // Bengali date and weekday

    useEffect(() => {

        const today = new Date();



        setDate(

            today.toLocaleDateString("bn-BD", {

                day: "numeric",

                month: "long",

                year: "numeric",

            })

        );



        setWeekday(

            today.toLocaleDateString("bn-BD", {

                weekday: "long",

            })

        );

    }, []);



    // Fetch categories

    useEffect(() => {

        async function fetchCategories() {

            try {

                const response = await fetch(

                    "https://api.abcz.workers.dev/api/bazardor/categories"

                );



                if (!response.ok) {

                    throw new Error("Failed to fetch categories");

                }



                const data: Category[] = await response.json();

                setCategories(data);

            } catch (error) {

                console.error("Failed to fetch categories:", error);

            }

        }



        fetchCategories();

    }, []);



    // Close dropdown when clicking outside

    useEffect(() => {

        function handleClickOutside(event: MouseEvent) {

            if (

                profileRef.current &&

                !profileRef.current.contains(event.target as Node)

            ) {

                setProfileOpen(false);

            }

        }



        function handleEscape(event: KeyboardEvent) {

            if (event.key === "Escape") {

                setProfileOpen(false);

            }

        }



        document.addEventListener("mousedown", handleClickOutside);

        document.addEventListener("keydown", handleEscape);



        return () => {

            document.removeEventListener(

                "mousedown",

                handleClickOutside

            );

            document.removeEventListener("keydown", handleEscape);

        };

    }, []);



    // Sign out

    async function handleSignOut() {

        if (loggingOut) return;



        setLoggingOut(true);



        try {

            const { error } = await authClient.signOut();



            if (error) {

                console.error("Sign out failed:", error);

                setLoggingOut(false);

                return;

            }



            window.location.href = "/signin";

        } catch (error) {

            console.error("Sign out failed:", error);

            setLoggingOut(false);

        }

    }



    return (

        <nav className="sticky top-0 z-50 bg-white">

            <div className="mx-auto max-w-6xl px-4 py-4">

                {/* Top Row */}

                <div className="flex items-center justify-between gap-4">

                    {/* Logo and Date */}

                    <div className="shrink-0">

                        <Link

                            href="/"

                            className="flex items-center gap-2"

                        >

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#05893E]">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 40 40"
                                    fill="none"
                                    className="h-9 w-9"
                                    aria-hidden="true"
                                >
                                    <path
                                        d="M7 15h26l-3 14H10L7 15Z"
                                        fill="#087A35"
                                        stroke="#172B1D"
                                        strokeWidth="1.5"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M5 12h5l3 17h17"
                                        stroke="#172B1D"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12 19h19M13 23h17M14 27h15"
                                        stroke="#DDF4E3"
                                        strokeWidth="1.5"
                                    />
                                    <circle cx="14" cy="33" r="2.2" fill="#172B1D" />
                                    <circle cx="28" cy="33" r="2.2" fill="#172B1D" />
                                    <path
                                        d="M18 12c-1-4 2-7 5-8 1 4-1 7-5 8Z"
                                        fill="#DDF4E3"
                                    />
                                </svg>
                            </div>



                            <h1 className="text-2xl font-bold">

                                <span className="text-[#1D271F]">

                                    বাজার দর

                                </span>

                            </h1>

                        </Link>



                        <p className="mt-1 text-sm text-[#1D271F]">

                            {weekday} • {date}

                        </p>

                    </div>



                    {/* Authentication */}

                    <div className="flex min-w-0 items-center justify-end">

                        {isPending ? (

                            <span className="text-sm text-gray-500">

                                অপেক্ষা করো...

                            </span>

                        ) : session?.user ? (

                            <div

                                className="relative"

                                ref={profileRef}

                            >

                                {/* Profile button */}

                                <button

                                    type="button"

                                    onClick={() =>

                                        setProfileOpen((prev) => !prev)

                                    }

                                    aria-expanded={profileOpen}

                                    aria-haspopup="true"

                                    aria-label="প্রোফাইল মেনু"

                                    className="flex items-center gap-2 rounded-full px-2 py-1.5 transition hover:bg-gray-50"

                                >

                                    {/* Google profile picture */}

                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">

                                        {session.user.image ? (

                                            <img

                                                src={session.user.image}

                                                alt="প্রোফাইল ছবি"

                                                referrerPolicy="no-referrer"

                                                className="h-full w-full object-cover"

                                            />

                                        ) : (

                                            <svg

                                                xmlns="http://www.w3.org/2000/svg"

                                                viewBox="0 0 24 24"

                                                fill="none"

                                                stroke="#05893E"

                                                strokeWidth="1.5"

                                                strokeLinecap="round"

                                                strokeLinejoin="round"

                                                className="h-6 w-6"

                                            >

                                                <circle

                                                    cx="12"

                                                    cy="8"

                                                    r="4"

                                                />

                                                <path d="M5 21a7 7 0 0 1 14 0" />

                                            </svg>

                                        )}

                                    </div>



                                    {/* Dynamic user name */}

                                    <span className="max-w-[100px] truncate text-sm font-medium text-[#1D271F]">

                                        {session.user.name || "ব্যবহারকারী"}

                                    </span>



                                    {/* Dropdown arrow */}

                                    <svg

                                        xmlns="http://www.w3.org/2000/svg"

                                        viewBox="0 0 24 24"

                                        fill="none"

                                        stroke="currentColor"

                                        strokeWidth="1.8"

                                        strokeLinecap="round"

                                        strokeLinejoin="round"

                                        className={`h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ${

                                            profileOpen ? "rotate-180" : ""

                                        }`}

                                    >

                                        <path d="m6 9 6 6 6-6" />

                                    </svg>

                                </button>



                                {/* Profile dropdown card */}

                                {profileOpen && (

                                    <div

                                        role="menu"

                                        className="absolute right-0 top-full z-[60] mt-2 w-[250px] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg"

                                    >

                                        {/* User information */}

                                        <div className="flex items-center gap-3 border-b border-gray-100 px-4 py-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#E4F3E8]">

                                                {session.user.image ? (

                                                    <img

                                                        src={session.user.image}

                                                        alt="প্রোফাইল ছবি"

                                                        referrerPolicy="no-referrer"

                                                        className="h-full w-full object-cover"

                                                    />

                                                ) : (

                                                    <svg

                                                        xmlns="http://www.w3.org/2000/svg"

                                                        viewBox="0 0 24 24"

                                                        fill="none"

                                                        stroke="#05893E"

                                                        strokeWidth="1.5"

                                                        strokeLinecap="round"

                                                        strokeLinejoin="round"

                                                        className="h-6 w-6"

                                                    >

                                                        <circle

                                                            cx="12"

                                                            cy="8"

                                                            r="4"

                                                        />

                                                        <path d="M5 21a7 7 0 0 1 14 0" />

                                                    </svg>

                                                )}

                                            </div>



                                            <div className="min-w-0 flex-1">

                                                <p className="truncate text-sm font-semibold text-[#1D271F]">

                                                    {session.user.name ||

                                                        "ব্যবহারকারী"}

                                                </p>



                                                <p className="mt-0.5 break-all text-xs text-gray-500">

                                                    {session.user.email}

                                                </p>

                                            </div>

                                        </div>



                                        {/* Dropdown menu */}

                                        <div className="p-2">

                                            <Link

                                                href="/profile"

                                                role="menuitem"

                                                onClick={() =>

                                                    setProfileOpen(false)

                                                }

                                                className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-[#1D271F] transition hover:bg-gray-50"

                                            >

                                                <svg

                                                    xmlns="http://www.w3.org/2000/svg"

                                                    viewBox="0 0 24 24"

                                                    fill="none"

                                                    stroke="currentColor"

                                                    strokeWidth="1.7"

                                                    strokeLinecap="round"

                                                    strokeLinejoin="round"

                                                    className="h-4 w-4 text-gray-500"

                                                >

                                                    <circle

                                                        cx="12"

                                                        cy="8"

                                                        r="4"

                                                    />

                                                    <path d="M5 21a7 7 0 0 1 14 0" />

                                                </svg>



                                                আমার প্রোফাইল

                                            </Link>



                                            {/* Sign out */}

                                            <button

                                                type="button"

                                                role="menuitem"

                                                onClick={handleSignOut}

                                                disabled={loggingOut}

                                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"

                                            >

                                                <svg

                                                    xmlns="http://www.w3.org/2000/svg"

                                                    viewBox="0 0 24 24"

                                                    fill="none"

                                                    stroke="currentColor"

                                                    strokeWidth="1.8"

                                                    strokeLinecap="round"

                                                    strokeLinejoin="round"

                                                    className="h-4 w-4 shrink-0"

                                                >

                                                    <path d="M9 14 4 9l5-5" />

                                                    <path d="M4 9h10a5 5 0 0 1 5 5v1" />

                                                </svg>



                                                {loggingOut

                                                    ? "লগআউট হচ্ছে..."

                                                    : "সাইন আউট"}

                                            </button>

                                        </div>

                                    </div>

                                )}

                            </div>

                        ) : (

                            /* Not logged in */

                            <div className="flex items-center gap-2 sm:gap-3">

                                <Link

                                    href="/signin"

                                    className="rounded-lg px-3 py-2 text-sm text-[#1D271F] transition hover:bg-gray-100 sm:px-4"

                                >

                                    সাইন ইন

                                </Link>



                                <Link

                                    href="/signup"

                                    className="rounded-lg bg-[#05893E] px-3 py-2 text-sm text-white transition hover:bg-[#047533] sm:px-4"

                                >

                                    সাইন আপ

                                </Link>

                            </div>

                        )}

                    </div>

                </div>



                {/* Dynamic Category Navigation */}

                <div className="mt-4 flex items-center gap-2 overflow-x-auto border-t border-gray-100 pt-3">

                    {categories.map((category) => {

                        const isActive =

                            pathname === `/category/${category.slug}`;



                        return (

                            <Link

                                key={category.slug}

                                href={`/category/${category.slug}`}

                                className={`whitespace-nowrap rounded-lg px-4 py-2 font-semibold transition ${

                                    isActive

                                        ? "bg-[#05893E] text-white"

                                        : "text-[#1D271F] hover:bg-gray-100 hover:text-[#05893E]"

                                }`}

                            >

                                {category.icon && (

                                    <span className="mr-1">

                                        {category.icon}

                                    </span>

                                )}



                                {category.nameBn}

                            </Link>

                        );

                    })}

                </div>

            </div>

        </nav>

    );

}
