import React, { useState, useEffect } from "react";
import { Layout } from "?/components/Layout";
import { Banner } from "?/components/Banner";
import { Clicklink } from "?/components/Hyperlink";

export const Discord: React.FC = () => {
  const [countdown, setCountdown] = useState(5);
  const [isStopped, setIsStopped] = useState(false);

  useEffect(() => {
    if (isStopped) return;

    const timer = setTimeout(() => {
      window.location.href = "https://discord.gg/X5kCn84KaQ";
    }, countdown * 1000);

    const interval = setInterval(() => {
      setCountdown(prevCountdown => prevCountdown - 1);
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [isStopped, countdown]);

  const handleStopClick = () => {
    if (isStopped) {
      setCountdown(5);
    }
    setIsStopped(!isStopped);
  };

  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">Bookracy Discord 💬</h1>
        <div className="flex flex-col mt-2">
          <p>
            {isStopped ? "Redirect halted." : `Redirecting you to the Bookracy Discord server in ${countdown} seconds...`}
          </p>
          <Clicklink onClick={handleStopClick}>[{isStopped ? "Start" : "Stop"}]</Clicklink>
        </div>
      </Banner>
    </Layout>
  );
}
