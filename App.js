import AppNavigator from "./src/navigation/AppNavigator";
import { AppearanceProvider } from "./src/context/AppearanceContext";
import { BedjetProvider } from "./src/context/BedjetContext";

export default function App() {
  return (
    <AppearanceProvider>
      <BedjetProvider>
        <AppNavigator />
      </BedjetProvider>
    </AppearanceProvider>
  );
}