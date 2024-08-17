import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/constants";
import { useSettingsStore } from "@/stores/settingsStore";
import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/contact")({
  component: Contact,
});

function Contact() {
  const { booksPerSearch, setBooksPerSearch, language, setLanguage, backendURL, setBackendURL } = useSettingsStore();
  return (
    <div className="flex h-full justify-center">
      <div className="flex flex-col gap-5 w-full">
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>
              idk some yap
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
