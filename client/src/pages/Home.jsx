import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import { useSelector } from "react-redux";
import OAuth from "../components/OAuth";
import { Button } from "flowbite-react";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col items-center justify-center px-6 py-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-green-500">Letter</span>Link
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Draft, save, and manage your letters effortlessly. Whether it's a
          formal document, a personal note, or an important email, keep
          everything organized in one place.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          {currentUser?._id ? (
            <Link to="/dashboard/?tab=create-letter">
              <Button color="dark" size="lg">
                Create Letter
              </Button>
            </Link>
          ) : (
            <OAuth btnSize="lg" btnText="Sign In" btnColor="dark" />
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <FeatureCard
          title="Save Drafts"
          description="Never lose your work again. Save drafts and continue editing whenever you need."
        />
        <FeatureCard
          title="Easy Editing"
          description="Make changes to your letters anytime with our simple and intuitive editor."
        />
        <FeatureCard
          title="Secure & Accessible"
          description="Your letters are safely stored and accessible from anywhere, anytime."
        />
      </div>
    </div>
  );
};

export default Home;
