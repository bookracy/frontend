import React, { useEffect, useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clipboard } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: Register,
});

function Register() {
  const [generatedString, setGeneratedString] = useState("");
  const [isDisplayNameSet, setIsDisplayNameSet] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleContinueClick = () => {
    setIsDisplayNameSet(true);
  };

  useEffect(() => {
    const fetchWordsAndGenerateString = async () => {
      try {
        const url = "https://preeminent-fudge-2849a2.netlify.app/?destination=https://www.mit.edu/~ecprice/wordlist.100000";
        const response = await fetch(url);
        const text = await response.text();
        const words = text.split("\n");
        const wordList = [];
        for (let i = 0; i < 2; i++) {
          const randomIndex = Math.floor(Math.random() * words.length);
          wordList.push(words[randomIndex]);
        }
        const capitalizedWords = wordList.map(word => word.charAt(0).toUpperCase() + word.slice(1));
        const randomNumber = Math.floor(Math.random() * 101);
        const finalString = `${capitalizedWords.join("")}${randomNumber}`;
        console.log("Generated string:", finalString);
        setGeneratedString(finalString);
      } catch (error) {
        console.error("Error fetching the word list:", error);
      }
    };

    fetchWordsAndGenerateString();
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText("1234 5678 9000").then(() => {
      console.log("Copied to clipboard");
      setIsCopied(true);
    }).catch((error) => {
      console.error("Error copying to clipboard:", error);
    });
  };

  return (
    <div className="flex h-full w-full justify-center items-center">
      <Card className="w-full h-full md:w-1/3">
        <CardHeader>
          <div className="flex flex-col gap-4">
            <CardTitle>Register</CardTitle>
            <CardDescription className="flex flex-col gap-3">
              {isDisplayNameSet ? (
                <>
                  <Label>Generated Identifier</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center justify-center relative">
                          <Input value="1234 5678 9000" readOnly />
                          <button 
                            onClick={copyToClipboard} 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                          >
                            <Clipboard />
                          </button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Your identifier acts as your username and password
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                       <Button className="w-full" onClick={handleContinueClick} disabled={!isCopied}>Continue</Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Copy your identifier to continue
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              ) : (
                <>
                  <Label>Display Name</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center justify-center">
                        <Input
                          placeholder={generatedString}
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                        />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Set a display name
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button onClick={handleContinueClick} disabled={displayName === ""}>Continue</Button>
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}