// // AuthService.js (Nuevo archivo para el servicio)
// import { getAuth } from "firebase/auth";

// export const getTokenFromFirebase = async () => {
//   const auth = getAuth();
//   const user = auth.currentUser;

//   if (user) {
//     return await user.getIdToken();
//   } else {
//     throw new Error("User is not authenticated");
//   }
// };

// export const sendTokenToBackend = async (token: string) => {
//   try {
//     const url = "http://127.0.0.1:5000/devices/battery?deviceId=18&setType=EnergyAndPowerPv&period=Month?Date=2024-02";
//     const response = await fetch(url, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//       body: JSON.stringify({ token }),
//     });

//     const data = await response.json();
//     console.log("Respuesta del backend:", data);
//   } catch (error) {
//     console.error("Error al enviar token al backend:", error);
//   }
// };

// export const sendTokenToBackend = async (url: string, method: string, token: string) => {
//   try {
//     const response = await fetch(url, {
//       method: method,
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": `Bearer ${token}`,
//       },
//     });

//     const data = await response.json();
//     console.log("Respuesta del backend:", data);
//   } catch (error) {
//     console.error("Error al enviar token al backend:", error);
//   }
// };