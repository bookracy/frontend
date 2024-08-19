import { useQuery } from "@tanstack/react-query";
import { ofetch } from "ofetch";

export const fetchWords = async () => {
  const url = "https://preeminent-fudge-2849a2.netlify.app/?destination=https://www.mit.edu/~ecprice/wordlist.100000";
  return ofetch<string>(url);
};

export const fetchWordsWithNumber = async () => {
  const words = (await fetchWords()).split("\n");
  const wordList = [];
  for (let i = 0; i < 2; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    wordList.push(words[randomIndex]);
  }
  const capitalizedWords = wordList.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const randomNumber = Math.floor(Math.random() * 101);
  return `${capitalizedWords.join("")}${randomNumber}`;
};

export const useRandomWordsWithNumber = () => {
  return useQuery({
    queryKey: ["words"],
    queryFn: fetchWordsWithNumber,
    staleTime: 0,
  });
};
