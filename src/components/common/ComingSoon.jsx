import React from "react";
import { Construction } from "lucide-react";

const ComingSoon = ({ pageName }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Construction className="w-10 h-10 text-amber-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          {pageName || "Page"} Coming Soon
        </h2>
        <p className="text-gray-600 mb-6">
          We're working hard to bring you this feature. Check back soon!
        </p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
