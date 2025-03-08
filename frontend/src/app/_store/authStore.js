// import { create } from "zustand";
// import { useEffect } from "react";

// const useUserAuthStore = create((set) => ({
//   user: null, // Default value to match SSR output

//   setUser: (userData) => {
//     if (typeof window !== "undefined") {
//       localStorage.setItem("user", JSON.stringify(userData));
//     }
//     set({ user: userData });
//   },

//   clearUser: () => {
//     if (typeof window !== "undefined") {
//       localStorage.removeItem("user");
//     }
//     set({ user: null });
//   },

//   loadUser: () => {
//     if (typeof window !== "undefined") {
//       const storedUser = JSON.parse(localStorage.getItem("user")) || null;
//       set({ user: storedUser });
//     }
//   },
// }));

// // Custom hook to load user data after hydration
// export const useUserAuth = () => {
//   const { loadUser } = useUserAuthStore();
  
//   useEffect(() => {
//     loadUser();
//   }, []);

//   return useUserAuthStore();
// };

// export default useUserAuth;
