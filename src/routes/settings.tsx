import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LANGUAGES } from "@/constants";
import { useSettingsStore } from "@/stores/settings";
import { createFileRoute } from "@tanstack/react-router";
import { Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const settingsFormSchema = z.object({
  language: z.string(),
  backendURL: z.string().url(),
  thumbnailGeneration: z.boolean(),
});

export const Route = createFileRoute("/settings")({
  component: Settings,
});

function Settings() {
  const [showSave, setShowSave] = useState(false);
  const { language, backendURL } = useSettingsStore();

  const form = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      language,
      backendURL,
      thumbnailGeneration: false,
    },
  });

  useEffect(() => {
    const subscription = form.watch((_, { type }) => {
      if (type === "change") {
        setShowSave(true);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [form]);

  const handleSubmit = () => {
    form.handleSubmit((data) => {
      useSettingsStore.setState({ language: data.language, backendURL: data.backendURL });
      toast.success("Settings saved successfully", { position: "top-right" });
      setShowSave(false);
    })();
  };

  return (
    <div className="flex flex-1 justify-center">
      <Form {...form}>
        <form className="flex w-full flex-col gap-8 md:w-1/2">
          <Card>
            <CardHeader>
              <CardTitle>Application Language</CardTitle>
              <CardDescription>Language applied to search results and the application. This setting is a work in progress.</CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value} disabled>
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Backend Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="backendURL"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-purple-500" />
                      Backend URL
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate thumbnails</CardTitle>
              <CardDescription>
                Most of the time, books don't have thumbnails. You can enable this setting to generate them on the fly but it may slow down the page. This setting is a work in progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center space-x-2">
              <FormField
                control={form.control}
                name="thumbnailGeneration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enable Thumbnails generation</FormLabel>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} className="flex" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
        </form>
      </Form>

      <div
        className={cn("absolute bottom-0 z-40 flex w-full items-center gap-8 rounded-t-xl bg-slate-50 px-8 py-2 opacity-0 transition-all duration-300 ease-in-out dark:bg-stone-800 md:py-4", {
          "opacity-100": showSave,
        })}
      >
        <h1 className="flex-1 text-base font-bold md:text-xl">Save settings</h1>

        <Button
          variant="destructive"
          onClick={() => {
            form.reset();
            setShowSave(false);
          }}
          className="w-32"
        >
          Reset
        </Button>
        <Button className="w-32" onClick={handleSubmit}>
          Save
        </Button>
      </div>

      <div className="absolute bottom-0 right-4">
        <p className="text-gray-400">
          Hostname: <span className="text-purple-500">{window.location.hostname}</span>
        </p>
      </div>
    </div>
  );
}
