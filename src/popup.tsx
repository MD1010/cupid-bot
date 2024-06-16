import "@/style.css";
import "../globals.css";
import "./popupStyle.css"

import { FiltersForm } from "@/components/cupid-filters-form";
import { Switch } from "./components/ui/switch";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from './components/mode-toggle';

function IndexPopup() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex w-[600px] bg-background overflow-x-hidden">
        <ModeToggle/>
        <FiltersForm />
      </div>
    </ThemeProvider>
  );
}

export default IndexPopup;
