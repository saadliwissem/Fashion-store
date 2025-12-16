export const orders = [
  {
    id: "ORD-2024-001",
    customer: {
      id: "CUST-001",
      name: "Ahmed Ben Ali",
      email: "ahmed.benali@example.com",
      phone: "+216 20 123 456",
    },
    items: [
      {
        id: 1,
        name: "Premium Cotton T-Shirt",
        sku: "FS-MEN-001-BLUE-M",
        price: 29.99,
        quantity: 2,
        color: "Navy Blue",
        size: "M",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
      },
      {
        id: 2,
        name: "Designer Denim Jacket",
        sku: "FS-WOM-003-DARK-M",
        price: 89.99,
        quantity: 1,
        color: "Dark Wash",
        size: "M",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      },
    ],
    shippingAddress: {
      name: "Ahmed Ben Ali",
      street: "123 Rue Habib Bourguiba",
      city: "Tunis",
      governorate: "Tunis",
      zipCode: "1000",
      country: "Tunisia",
      phone: "+216 20 123 456",
    },
    billingAddress: {
      sameAsShipping: true,
    },
    payment: {
      method: "credit_card",
      status: "paid",
      transactionId: "TXN-001234",
      amount: 149.97,
      currency: "DT",
      paidAt: "2024-12-01 14:30:00",
    },
    shipping: {
      method: "express",
      carrier: "Tunisie Post",
      trackingNumber: "TN123456789",
      cost: 15.0,
      estimatedDelivery: "2024-12-03",
      status: "in_transit",
    },
    totals: {
      subtotal: 149.97,
      shipping: 15.0,
      tax: 10.5,
      discount: 0.0,
      total: 175.47,
    },
    status: "processing",
    createdAt: "2024-12-01 14:20:00",
    updatedAt: "2024-12-01 15:45:00",
    notes: "Customer requested gift wrapping",
    tags: ["express", "gift"],
  },
  // Add more orders as needed...
];
