
import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search } from "lucide-react";

const navigationItems = [
  { name: "Dashboard", path: "/" },
  { name: "Patients", path: "/patients" },
  { name: "Doctors", path: "/doctors" },
  { name: "Appointments", path: "/appointments" },
  { name: "Medical Records", path: "/records" },
  { name: "Pharmacy", path: "/pharmacy" },
  { name: "Reports", path: "/reports" },
  { name: "Schedule", path: "/schedule" },
  { name: "Messages", path: "/messages" },
  { name: "Notifications", path: "/notifications" },
  { name: "Settings", path: "/settings" },
  { name: "Profile", path: "/profile" },
];

export function SearchCommand({ open, onOpenChange }) {
  const navigate = useNavigate();

  const handleSelect = React.useCallback((path) => {
    navigate(path);
    onOpenChange(false);
  }, [navigate, onOpenChange]);

  React.useEffect(() => {
    const down = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search across the application..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          {navigationItems.map((item) => (
            <CommandItem
              key={item.path}
              onSelect={() => handleSelect(item.path)}
              className="cursor-pointer"
            >
              <Search className="mr-2 h-4 w-4" />
              {item.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
