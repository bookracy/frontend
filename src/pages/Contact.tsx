import React, { useState } from "react";
import { Button } from "@/components/Button";
import { Banner } from "@/components/Banner";
import { Layout } from "@/components/Layout";

type Category = "general" | "dmca" | "media" | "delete";

type SubCategory = {
  value: string;
  label: string;
};

type SubCategories = {
  [key in Category]: SubCategory[];
};

export const Contact: React.FC = () => {
  const [category, setCategory] = useState<Category | "">("");
  const [subCategory, setSubCategory] = useState("");
  const [userId, setUserId] = useState("");
  const [details, setDetails] = useState("");

  const categories: { value: Category | ""; label: string }[] = [
    { value: "", label: "Select a category" },
    { value: "general", label: "General Inquiry" },
    { value: "dmca", label: "DMCA" },
    { value: "media", label: "Media, Socials, Marketing, Press, Collaboration" },
    { value: "delete", label: "Delete my Data / Information" },
  ];

  const subCategories: SubCategories = {
    general: [
      { value: "feedback", label: "Feedback" },
      { value: "suggestion", label: "Suggestion" },
      { value: "question", label: "Question" },
    ],
    dmca: [
      { value: "takedown", label: "Takedown Request" },
      { value: "counter", label: "Counter Notice" },
    ],
    media: [
      { value: "press", label: "Press Inquiry" },
      { value: "collab", label: "Collaboration Proposal" },
      { value: "marketing", label: "Marketing Opportunity" },
    ],
    delete: [
      { value: "account", label: "Delete Account" },
      { value: "data", label: "Delete Specific Data" },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `[${category.toUpperCase()}] ${subCategory}`;
    let body = `Category: ${category}\nSub-category: ${subCategory}\n\n`;

    if (category === "delete") {
      body += `User ID: ${userId}\n\n`;
    }

    body += `Details:\n${details}`;

    window.location.href = `mailto:dev@bookracy.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">Contact Bookracy 📚📧</h1>
        <p className="mt-2 text-white">
          We value your feedback and are here to assist you. Please use the form below to reach out to us about any questions, concerns, or suggestions you may have.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
          <select
            className="w-full md:w-8/12 p-2 rounded mb-4 md:mb-0 md:mr-4 bg-[#302e2e]"  
            value={category}
            onChange={(e) => {
              setCategory(e.target.value as Category);
              setSubCategory("");
            }}
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>

          {category && (
            <select
              className="w-full md:w-8/12 p-2 rounded bg-[#302e2e]"
              value={subCategory}
              onChange={(e) => setSubCategory(e.target.value)}
            >
              <option value="">Select a sub-category</option>
              {subCategories[category as Category].map((subCat) => (
                <option key={subCat.value} value={subCat.value}>
                  {subCat.label}
                </option>
              ))}
            </select>
          )}

          {category === "delete" && (
            <input
              type="text"
              className="w-full md:w-8/12 p-2 rounded"
              placeholder="User ID or Information"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
          )}

          <textarea
            className="w-full md:w-10/12 h-32 p-2 rounded"
            placeholder="Please provide details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />

          <Button className="w-full md:w-4/12 cursor-pointer" disabled={!category || !subCategory || !details}>
            Send Email
          </Button>
        </form>
      </Banner>
    </Layout>
  );
};