import { Button } from "@/components/ui/button";

import { useTheme } from "@/components/theme-provider";
import { Switch } from "./ui/switch";
import { Moon02Icon, Sun02Icon } from "hugeicons-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button className='absolute top-5 right-5 text-primary' onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}>
      {theme === "dark" ? <Sun02Icon/>: <Moon02Icon/>}
    </button>
  );
}
