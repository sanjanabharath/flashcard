import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#fff",
          color: "#333",
          borderRadius: "8px",
          padding: "16px",
        },
        success: {
          duration: 3000,
          style: {
            background: "#f0fdf4",
            color: "#166534",
          },
        },
      }}
    />
  );
}
