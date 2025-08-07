import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SnowcoreBanner from "@/assets/ads/snowcore-purple.gif";

const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
export function SnowcoreModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenModal = getCookie("BR::snowcore-modal-seen");

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setCookie("BR::snowcore-modal-seen", "true", 7); // Expires in 1 week
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex flex-col items-center space-y-4 p-6">
          <a href="https://snowcore.io/ref?bookracy" target="_blank">
            <img src={SnowcoreBanner} alt="Snowcore" className="w-full max-w-sm rounded-lg" />
          </a>
          <p className="text-muted-foreground text-center">Thanks to Snowcore for sponsoring Bookracy.</p>
          <a href="https://snowcore.io/ref?bookracy" target="_blank">
            <Button className="text-foreground bg-primary text-center">Snowcore.io</Button>
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
