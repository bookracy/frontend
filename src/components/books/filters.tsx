import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { LayoutGrid, LayoutList } from "lucide-react";
import { cn } from "@/lib/utils";

interface PerPageSelectProps {
  perPage: number;
  setPerPage: (perPage: number) => void;
}

const PER_PAGE_OPTIONS = [5, 10, 15, 30, 50] as const;

export function PerPageSelect({ perPage, setPerPage }: PerPageSelectProps) {
  return (
    <Select defaultValue={perPage.toString()} value={perPage.toString()} onValueChange={(value) => setPerPage(Number(value))}>
      <SelectTrigger className="h-11 w-[80px]">
        <SelectValue placeholder="Select per page" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Per page</SelectLabel>
          {PER_PAGE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface FileTypeSelectProps {
  fileType: string
  setFileType: (fileType: string) => void;
}

const FILE_TYPE_OPTIONS = ["ALL", "EPUB", "PDF", "AWZ3"] as const;

export function FileTypeSelect({ fileType, setFileType }: FileTypeSelectProps) {
  return (
    <Select defaultValue={fileType} value={fileType.toString()} onValueChange={(value) => setFileType(value)}>
      <SelectTrigger className="h-11 w-[80px]">
        <SelectValue placeholder="Select file type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>File type</SelectLabel>
          {FILE_TYPE_OPTIONS.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

interface ResultViewSelectProps {
  view: ResultViewOptions;
  setView: (view: ResultViewOptions) => void;
}

export type ResultViewOptions = "list" | "grid";

export function ResultViewSelect({ view, setView }: ResultViewSelectProps) {
  return (
    <div className="relative inline-flex rounded-md bg-background p-1">
      <div
        className={cn("absolute inset-1 w-[calc(50%-7px)] rounded bg-primary transition-all duration-200 ease-in-out", {
          "translate-x-0": view === "list",
          "translate-x-[calc(100%+6px)]": view === "grid",
        })}
        aria-hidden="true"
      />
      <Button
        variant="ghost"
        size="sm"
        className={cn("relative flex flex-1 items-center justify-center text-sm font-medium transition-colors duration-200 hover:bg-transparent", {
          "text-primary-foreground": view === "list",
          "text-muted-foreground": view === "grid",
        })}
        onClick={() => setView("list")}
        aria-pressed={view === "list"}
      >
        <LayoutList className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={cn("relative flex flex-1 items-center justify-center text-sm font-medium transition-colors duration-200 hover:bg-transparent", {
          "text-primary-foreground": view === "grid",
          "text-muted-foreground": view === "list",
        })}
        onClick={() => setView("grid")}
        aria-pressed={view === "grid"}
      >
        <LayoutGrid className="h-4 w-4" />
      </Button>
    </div>
  );
}

export interface FilterProps {
  filters: {
    view: ResultViewOptions;
    perPage: number;
    fileType: string;
  };
  setFilters: (filters: { view: ResultViewOptions; perPage: number; fileType: string; }) => void;
}

export function Filters({ filters, setFilters }: FilterProps) {
  return (
    <div className="flex w-full justify-end gap-4">
      <ResultViewSelect view={filters.view} setView={(view) => setFilters({ ...filters, view })} />
      <PerPageSelect perPage={filters.perPage} setPerPage={(perPage) => setFilters({ ...filters, perPage })} />
      <FileTypeSelect fileType={filters.fileType} setFileType={(fileType) => setFilters({ ...filters, fileType })} />
    </div>
  );
}
