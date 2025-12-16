import React, { useState, useEffect } from "react";
import { authAPI, productsAPI } from "../services/api";

const TestConnection = () => {
  const [status, setStatus] = useState("Testing...");
  const [health, setHealth] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      // Test 1: Health check
      const healthRes = await fetch("http://localhost:5000/api/health");
      const healthData = await healthRes.json();
      setHealth(healthData);

      // Test 2: Public products endpoint
      const productsRes = await productsAPI.getAll({ limit: 3 });
      setProducts(productsRes.data.products || []);

      // Test 3: Try login with seeded admin
      try {
        const loginRes = await authAPI.login({
          email: "admin@fashionstore.tn",
          password: "Admin@123",
        });
        setStatus(`✅ Connected! Admin login successful`);

        // Store token for further tests
        localStorage.setItem("token", loginRes.data.token);
      } catch (loginErr) {
        setStatus(`✅ Connected! (Admin login failed: ${loginErr.message})`);
      }
    } catch (error) {
      setStatus(`❌ Connection failed: ${error.message}`);
      console.error("Connection test error:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Backend Connection Test</h2>

      <div className="mb-4">
        <div
          className={`p-3 rounded-lg ${
            status.includes("✅")
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          <strong>Status:</strong> {status}
        </div>
      </div>

      {health && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <h3 className="font-semibold mb-2">Health Check:</h3>
          <pre className="text-sm">{JSON.stringify(health, null, 2)}</pre>
        </div>
      )}

      {products.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">
            Sample Products ({products.length}):
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product._id} className="p-3 border rounded-lg">
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-sm text-gray-500">SKU: {product.sku}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Next Steps:</h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Ensure backend is running on port 5000</li>
          <li>Check browser console for CORS errors</li>
          <li>Verify MongoDB connection in backend logs</li>
          <li>Test login with: admin@fashionstore.tn / Admin@123</li>
        </ol>
      </div>
    </div>
  );
};

export default TestConnection;
