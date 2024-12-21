import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { EpubReader } from "@/components/epub-reader/epub-reader";

export default function ReaderPage() {
  const router = useRouter();
  const { title, link, location } = router.query;

  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!title || !link) {
      router.push("/");
    }
  }, [title, link, router]);

  if (!title || !link) {
    return null;
  }

  return (
    <EpubReader
      title={title as string}
      link={link as string}
      open={isOpen}
      setIsOpen={setIsOpen}
      initialLocation={location as string}
    />
  );
}
