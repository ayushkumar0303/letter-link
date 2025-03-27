import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-lg text-gray-600 mt-2">Page Not Found</p>
      <Link
        to="/"
        className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Go Back Home
      </Link>
    </div>
  );
}
