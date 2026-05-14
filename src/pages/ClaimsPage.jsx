// pages/ClaimsPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ArrowLeft, Filter, Search } from "lucide-react";
import Button from "../components/common/Button";
import { claimAPI } from "../services/api";
import toast from "react-hot-toast";
import ClaimsList from "../components/claims/ClaimsList";

const ClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClaims();
  }, [filter]);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const params = { limit: 100 };
      if (filter !== "all") {
        params.status = filter;
      }
      const response = await claimAPI.getUserClaims(params);

      // Extract claims data safely
      let claimsData =
        response.data?.data ||
        response.data?.claims ||
        (Array.isArray(response.data) ? response.data : []);

      setClaims(claimsData);
    } catch (error) {
      console.error("Failed to fetch claims:", error);
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  // Apply search filter
  const filteredClaims = claims.filter((claim) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      claim.fragment?.name?.toLowerCase().includes(searchLower) ||
      claim.claimId?.toLowerCase().includes(searchLower) ||
      claim._id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back Button */}
        <div className="mb-6">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">
            My Fragment Claims
          </h1>
          <p className="text-gray-600 mt-2">
            Track all your claimed fragments and their status
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by fragment name or claim ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "all"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("pending")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "pending"
                    ? "bg-yellow-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setFilter("confirmed")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "confirmed"
                    ? "bg-primary-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setFilter("processing")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "processing"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Processing
              </button>
              <button
                onClick={() => setFilter("shipped")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "shipped"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Shipped
              </button>
              <button
                onClick={() => setFilter("delivered")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === "delivered"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Delivered
              </button>
            </div>
          </div>
        </div>

        {/* Claims List */}
        <ClaimsList
          claims={filteredClaims}
          loading={loading}
          onBack={() => {}}
          filter={filter}
          setFilter={setFilter}
          search={search}
          setSearch={setSearch}
          isFullPage={true}
        />

        {/* Empty State with CTA */}
        {!loading && filteredClaims.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Claims Found
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? `No claims match "${search}". Try a different search.`
                : "You haven't claimed any fragments yet."}
            </p>
            <Link to="/mysteries">
              <Button>Explore Mysteries</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimsPage;
