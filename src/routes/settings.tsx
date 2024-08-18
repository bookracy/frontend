import * as React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/constants";
import { useSettingsStore } from "@/stores/settingsStore";
import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const { booksPerSearch, setBooksPerSearch, language, setLanguage, backendURL } = useSettingsStore();
  const [error, setError] = React.useState<string | null>(null);

  const handleBooksPerSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (value < 1 || value > 11) {
      setError("Number must be between 1 and 11.");
    } else {
      setError(null);
      setBooksPerSearch(value);
    }
  };

  return (
    <div className="relative flex h-full justify-center">
      <div className="flex w-1/2 flex-col gap-8">
        {/* Language Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Application Language</CardTitle>
            <CardDescription>
              Language applied to search results, and maybe, just maybe the entire application{" "}
              <span role="img" aria-label="smirk">
                😏
              </span>
              .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setLanguage} defaultValue={language}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Language</SelectLabel>
                  {LANGUAGES.map((language) => (
                    <SelectItem key={language.value} value={language.value}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Books Per Search Input */}
        <Card>
          <CardHeader>
            <CardTitle>Books per Search</CardTitle>
            <CardDescription>Set the maximum number of books displayed per search.</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="number"
              value={booksPerSearch}
              onChange={handleBooksPerSearchChange}
              min={1}
              max={11}
              className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            {error && <p className="mt-2 text-red-500">{error}</p>}
          </CardContent>
        </Card>

        {/* Backend URL */}
        <Card>
          <CardHeader>
            <CardTitle>Backend Settings</CardTitle>
            <CardDescription className="flex gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Backend URL: {backendURL}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="text"
              disabled
              value={backendURL}
              readOnly
              className="flex h-10 w-full rounded-md border border-input bg-background px-4 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </CardContent>
        </Card>

        {/* Thumbnail Generation Switch */}
        <Card>
          <CardHeader>
            <CardTitle>Generate thumbnails</CardTitle>
            <CardDescription>Most of the time, books don't have thumbnails. You can enable this setting to generate them on the fly but it may slow down the page.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-2">
            <Switch id="thumbnail-generation" />
            <Label htmlFor="thumbnail-generation">Enable Thumbnails generation</Label>
          </CardContent>
        </Card>
      </div>

      <div className="absolute bottom-0 right-0 mb-2 mr-2 flex items-end">
        <p className="text-sm text-gray-400">
          Hostname: <span className="text-purple-500">{window.location.hostname}</span>
        </p>
      </div>
    </div>
  );
}

export { Settings };
