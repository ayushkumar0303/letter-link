import { Footer } from "flowbite-react";
// import { Link } from "react-router-dom";

function FooterComp() {
  return (
    <Footer className="bg-gray-800 text-gray-400 p-4 rounded-none">
      <div className="w-full flex flex-col md:flex-row justify-between items-center">
        <span className="text-lg font-semibold text-green-400">
          Letter<span className="text-white">Link</span>
        </span>

        <span className="text-sm mt-2 md:mt-0">
          © {new Date().getFullYear()} LetterLink. All rights reserved.
        </span>
      </div>
    </Footer>
  );
}

export default FooterComp;
