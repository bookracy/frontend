import React, { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
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
} from "@/components/ui/tooltip";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/register")({
  component: Register,
});

const getCookieValue = (name) => {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const [cookieName, cookieValue] = cookies[i].split("=");
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return "";
};

async function verifyAuthKey(authKey, userId) {
  try {
    const url = "https://backend.bookracy.org/api/_secure/signup/verify";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ttkn: authKey, uid: userId }),
    });
    const data = await response.json();
    return data.stk;
  } catch (error) {
    console.error("Error verifying auth key:", error);
    return null;
  }
}

async function generateUser(signupToken, username) {
  try {
    const url = "https://backend.bookracy.org/api/_secure/signup/generate";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stk: signupToken,
        username: username,
      }),
    });
    const data = await response.json();
    return data.uuid;
  } catch (error) {
    console.error("Error generating user:", error);
    return null;
  }
}

function Register() {
  const navigate = useNavigate();
  const [generatedString, setGeneratedString] = useState("");
  const [isDisplayNameSet, setIsDisplayNameSet] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [uuiD, setUuiD] = useState("");
  const [signupToken, setSignupToken] = useState("");

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

  // new auth key shi i made up, rotates every hour and is validated server side
  useEffect(() => {
    const handleAuthVerification = async () => {
      const authKey = getCookieValue("authKey");
      console.log("authKey:", authKey);
      const userId = getCookieValue("userId");
      console.log("userId:", userId);
      const token = await verifyAuthKey(authKey, userId);
      if (token) {
        setSignupToken(token);
      }
    };

    handleAuthVerification();
  }, []);

  // THIS ISNT FKN WORKIN
  const handleContinueClick = async () => {
    if (isDisplayNameSet) {
      navigate("/login");
    }
    if (displayName && signupToken) {
      const userId = await generateUser(signupToken, displayName);
      if (userId) {
        setUuiD(userId);
        setIsDisplayNameSet(true);
      }
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uuiD).then(() => {
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
                          <Input value={uuiD} readOnly />
                          <button 
                            onClick={copyToClipboard} 
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:scale-110 transition-transform duration-200"
                          >
                            <Clipboard />
                          </button>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Your identifier acts as your username and password</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button className="w-full" onClick={handleContinueClick} disabled={!isCopied}>
                          Continue
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Copy your identifier to continue</p>
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
                        <p>Set a display name</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button onClick={handleContinueClick} disabled={displayName === ""}>
                    Continue
                  </Button>
                </>
              )}
            </CardDescription>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
