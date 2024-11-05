import React, { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconButton } from "@/components/ui/icon-button";
import { ArrowUpFromLine } from "lucide-react";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/upload")({
  component: Upload,
  beforeLoad: () => {
    if (import.meta.env.PROD) throw redirect({ to: "/", search: { q: "" } });
  },
});

function Upload() {
  const [step, setStep] = useState(1);
  const [stage, setStage] = useState(1);
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const handleBookFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setBookFile(event.target.files[0]);
    }
  };

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setCoverFile(event.target.files[0]);
    }
  };

  const handleNext = () => {
    const newStep = step + 1;
    setStep(newStep);
    setStage(newStep > 6 ? 2 : 1);
  };

  const handleBack = () => {
    const newStep = step - 1;
    setStep(newStep);
    setStage(newStep > 6 ? 2 : 1);
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-fit">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upload a Book</CardTitle>
            <Label className="text-gray-700 dark:text-gray-400">Stage #{stage}</Label>
          </div>
          <CardDescription className="pt-3">
            {step === 1 && (
              <div>
                <Label className="pl-1">Book Title</Label>
                <Input placeholder="A Scanner Darkly" title="Book Title" className="w-72" />
              </div>
            )}
            {step === 2 && (
              <div>
                <Label className="pl-1">Author</Label>
                <Input placeholder="Philip K Dick" title="Author" className="w-72" />
              </div>
            )}
            {step === 3 && (
              <div>
                <Label className="pl-1">Publisher</Label>
                <Input placeholder="Doubleday & Company" title="Publisher" className="w-72" />
              </div>
            )}
            {step === 4 && (
              <div>
                <Label className="pl-1">Year Published</Label>
                <Input placeholder="1977" title="Year Published" className="w-72" />
              </div>
            )}
            {step === 5 && (
              <div>
                <Label className="pl-1">File Format</Label>
                <Input placeholder="epub" title="File Format" className="w-72" />
              </div>
            )}
            {step === 6 && (
              <div className="flex flex-col gap-3">
                <div>
                  <Label className="pl-1">Book Upload</Label>
                  <Input
                    onChange={handleBookFileChange}
                    className="h-11 w-72 items-center"
                    type="file"
                    iconRight={
                      <IconButton>
                        <ArrowUpFromLine />
                      </IconButton>
                    }
                  />
                </div>
                <div>
                  <Label className="pl-1">Cover Image Upload</Label>
                  <Input
                    onChange={handleCoverFileChange}
                    className="h-11 w-72 items-center"
                    type="file"
                    iconRight={
                      <IconButton>
                        <ArrowUpFromLine />
                      </IconButton>
                    }
                  />
                </div>
              </div>
            )}
            {step === 7 && (
              <div>
                <p className="pl-1">
                  Yay, all necessary file information has been entered!
                  <br />
                  All data from here on is <strong>optional</strong>.
                </p>
              </div>
            )}
            {step === 8 && (
              <div>
                <Label className="pl-1">Series</Label>
                <Input placeholder="science fiction, dystopian, thriller" title="Series" className="w-72" />
              </div>
            )}
            {step === 9 && (
              <div>
                <Label className="pl-1">ISBN</Label>
                <Input placeholder="9788834718674" title="ISBN" className="w-72" />
              </div>
            )}
            {step === 10 && (
              <div>
                <Label className="pl-1">CID</Label>
                <Input placeholder="A IPFS node upload of the book" title="CID" className="w-72" />
              </div>
            )}
            {step === 11 && (
              <div>
                <Label className="pl-1">Other Titles</Label>
                <Input placeholder="Scanner Darkly" title="Other titles" className="w-72" />
              </div>
            )}
            {step === 12 && (
              <div>
                <Label className="pl-1">Description</Label>
                <Textarea placeholder="Description" title="Description" className="w-72" />
              </div>
            )}
            {step === 13 && (
              <div>
                <p className="pl-1">
                  You have completed all the necessary steps to upload a book,
                  <br />
                  your submission will be reviewed by our team shortly!
                </p>
              </div>
            )}
            <div className="flex justify-between">
              {step > 1 ? (
                <Button onClick={handleBack} className="mt-4">
                  Back
                </Button>
              ) : (
                <div className="flex-grow"></div>
              )}
              {step < 13 && (
                <Button onClick={handleNext} className={`mt-4 ${step <= 1 ? "ml-auto" : ""}`}>
                  Next
                </Button>
              )}
              {step === 13 && <Button className={`mt-4 ${step <= 1 ? "ml-auto" : ""}`}>Finish</Button>}
            </div>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
