import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { AppRoutes } from "./routes/AppRoutes";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" reverseOrder={false} />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;