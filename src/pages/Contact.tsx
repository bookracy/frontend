import React, { useState } from "react";
import { Button } from "src/components/Button";
import { Banner } from "src/components/Banner";
import { Layout } from "src/components/Layout";

export const Contact = () => {
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:dev@bookracy.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">Contact us 📧</h1>
        <p className="mt-2 text-white">
          We at Bookracy are open to feedback and suggestions. If you have any questions or concerns, feel free to reach out to us.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-3">
          <input
            type="text"
            className="input w-5/12"
            placeholder="Subject:"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            className="w-9/12 h-32"
            placeholder="Email content..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <Button className="w-2/12">
            Send Email
          </Button>
        </form>
      </Banner>
    </Layout>
  );
};
