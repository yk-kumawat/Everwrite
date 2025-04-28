import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import { CssVarsProvider } from "@mui/joy/styles";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <CssVarsProvider>
      <Toaster
        position="top-center"
        reverseOrder={true}
      />
      <AppRoutes />
    </CssVarsProvider>
  );
}

export default App;
