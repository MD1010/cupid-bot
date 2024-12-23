
import { useTheme } from "@/components/theme-provider";
import { Moon02Icon, Sun02Icon } from "hugeicons-react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <button className='absolute top-5 right-5' onClick={() => theme === "dark" ? setTheme("light") : setTheme("dark")}>
      {theme === "dark" ? <Sun02Icon/>: <Moon02Icon/>}
    </button>
  );
}
