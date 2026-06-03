import AppNavigator from "./src/navigation/AppNavigator";
import { AppearanceProvider } from "./src/context/AppearanceContext";

export default function App() {
  return (
    <AppearanceProvider>
      <AppNavigator />
    </AppearanceProvider>
  );
}