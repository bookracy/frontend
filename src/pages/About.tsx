import Button from "../components/Button";
import Banner from "../components/Banner";
import Layout from "../components/Layout";

const Contact = () => {
  return (
    <Layout>
      <Banner>
        <h1 className="text-2xl text-white">About us 📚</h1>
        <div className="flex flex-col gap-2">
          <p className="mt-2 text-white">
            Bookracy is a free and open-source web application that allows you to read and download your favorite books, comics, and manga.
          </p>
          <div className="bg-banner-secondary p-2 rounded-[0.2em]">
            "Knowledge should flow freely like a river, nourishing all who seek it, for wisdom is a gift that should not be withheld."
          </div>
          <Button 
            className="bg-button-accent hover:bg-button-accentHover w-[11em] h-[2.5em] flex items-center justify-center" 
            onClick={() => window.open("/featured", "_blank")}
          >
            Explore Library
          </Button>
        </div>
      </Banner>
    </Layout>
  );
};

export default Contact;
