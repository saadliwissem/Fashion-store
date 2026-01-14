import React from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  Shield,
  Truck,
  Users,
  Star,
  Award,
  Globe,
  ShoppingBag,
  CheckCircle,
  Clock,
  Package,
  MessageSquare,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import Button from "../components/common/Button";

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Ahmed Ben Mahmoud",
      role: "CEO & Founder",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
      bio: "15+ years in fashion retail. Passionate about bringing the best of Tunisian fashion to the world.",
    },
    {
      id: 2,
      name: "Fatima El Amri",
      role: "Head of Design",
      image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w-400&h=400&fit=crop&crop=face",
      bio: "Former fashion designer in Paris. Now creating exclusive collections for DAR ENNAR Tunisia.",
    },
    {
      id: 3,
      name: "Karim Trabelsi",
      role: "Operations Director",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
      bio: "Logistics expert ensuring seamless delivery across all 24 governorates of Tunisia.",
    },
    {
      id: 4,
      name: "Amina Bouazizi",
      role: "Customer Experience",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
      bio: "Dedicated to providing 24/7 support and ensuring every customer feels valued.",
    },
  ];

  const milestones = [
    {
      year: "2018",
      title: "Founded",
      description: "Started with a small boutique in Tunis",
    },
    {
      year: "2019",
      title: "Online Launch",
      description: "Launched our e-commerce platform",
    },
    {
      year: "2020",
      title: "National Coverage",
      description: "Expanded delivery to all Tunisia",
    },
    {
      year: "2021",
      title: "50K Customers",
      description: "Reached 50,000 happy customers",
    },
    {
      year: "2022",
      title: "Award Winner",
      description: "Best E-commerce Fashion Store in Tunisia",
    },
    {
      year: "2023",
      title: "New Warehouse",
      description: "Opened 10,000m² distribution center",
    },
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Passion for Fashion",
      description:
        "We live and breathe fashion, curating only the best for our customers.",
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Quality",
      description:
        "Every product is quality-checked. Your satisfaction is guaranteed.",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Customer First",
      description:
        "Your needs guide every decision we make. We're here for you 24/7.",
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Local Pride",
      description:
        "Proudly Tunisian, showcasing the best of local and international fashion.",
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Reliable Service",
      description:
        "Fast, reliable delivery across Tunisia with real-time tracking.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Excellence",
      description:
        "Constantly improving to provide the best shopping experience.",
    },
  ];

  const stats = [
    {
      number: "50,000+",
      label: "Happy Customers",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "24",
      label: "Governorates Covered",
      icon: <MapPin className="w-6 h-6" />,
    },
    {
      number: "98%",
      label: "Satisfaction Rate",
      icon: <Star className="w-6 h-6" />,
    },
    {
      number: "24/7",
      label: "Customer Support",
      icon: <MessageSquare className="w-6 h-6" />,
    },
    {
      number: "5000+",
      label: "Products",
      icon: <ShoppingBag className="w-6 h-6" />,
    },
    {
      number: "3 Days",
      label: "Avg. Delivery",
      icon: <Truck className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full translate-y-48 -translate-x-48 opacity-20"></div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              More Than Just Fashion
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              We're a Tunisian story of passion, quality, and exceptional
              service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                className="bg-white text-primary-700 hover:bg-primary-50"
              >
                Shop Now
              </Button>
              <Button
                variant="outline"
                size="large"
                className="border-white text-white hover:bg-white/10"
              >
                Our Story
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Our Journey
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              From a Local Boutique to Tunisia's Favorite Fashion Store
            </h2>
            <p className="text-lg text-gray-600">
              Founded in 2018, DAR ENNAR Tunisia started as a small boutique in
              the heart of Tunis. Driven by a passion for fashion and a
              commitment to quality, we've grown into the nation's premier
              online fashion destination, serving customers across all 24
              governorates.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative max-w-6xl mx-auto">
            {/* Vertical line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary-200 via-primary-400 to-black"></div>

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative flex items-center ${
                    index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div
                    className={`w-1/2 ${
                      index % 2 === 0 ? "pr-12 text-right" : "pl-12"
                    }`}
                  >
                    <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-7000 rounded-full text-sm font-medium mb-3">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>

                  {/* Dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>

                  {/* Year on line */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-8">
                    <span className="text-lg font-bold text-primary-700">
                      {milestone.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              What We Stand For
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do, from selecting products
              to serving customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-neutral-100 rounded-xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold mb-2">{stat.number}</div>
                <div className="text-primary-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
              Meet Our Team
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              The Faces Behind DAR ENNAR
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A passionate team dedicated to bringing you the best fashion
              experience in Tunisia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div key={member.id} className="group">
                <div className="relative overflow-hidden rounded-2xl mb-6">
                  <div className="aspect-square overflow-hidden rounded-2xl">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-purple-600 font-medium mb-2">
                  {member.role}
                </p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Why We're Different
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Choose DAR ENNAR Tunisia?
              </h2>
            </div>

            <div className="space-y-6">
              {[
                {
                  icon: <CheckCircle className="w-6 h-6 text-emerald-500" />,
                  title: "Curated Selection",
                  description:
                    "Every product is handpicked by our fashion experts for quality and style.",
                },
                {
                  icon: <Clock className="w-6 h-6 text-blue-500" />,
                  title: "Fast Delivery",
                  description:
                    "Express delivery across Tunisia. Most orders arrive within 3 days.",
                },
                {
                  icon: <Package className="w-6 h-6 text-primary-500" />,
                  title: "Easy Returns",
                  description:
                    "30-day return policy. We make returns simple and hassle-free.",
                },
                {
                  icon: <MessageSquare className="w-6 h-6 text-pink-500" />,
                  title: "Tunisian Support",
                  description:
                    "24/7 customer service in Arabic, French, and English.",
                },
                {
                  icon: <Shield className="w-6 h-6 text-amber-500" />,
                  title: "Secure Shopping",
                  description:
                    "100% secure payment with SSL encryption and fraud protection.",
                },
                {
                  icon: <Award className="w-6 h-6 text-red-500" />,
                  title: "Award-Winning Service",
                  description:
                    "Recognized as Tunisia's Best E-commerce Fashion Store 2022.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex-shrink-0 mt-1">{item.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience Premium Fashion?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join over 50,000 satisfied customers who trust us for their
              fashion needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                className="bg-white text-primary-700 hover:bg-primary-50"
              >
                Start Shopping
              </Button>
              <Button
                variant="outline"
                size="large"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Call Us</h3>
              <p className="text-gray-600">+216 70 123 456</p>
              <p className="text-gray-600 text-sm">Mon-Sun: 8AM - 10PM</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Email Us</h3>
              <p className="text-gray-600">contact@DAR ENNAR.tn</p>
              <p className="text-gray-600 text-sm">Response within 2 hours</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Visit Us</h3>
              <p className="text-gray-600">Avenue Habib Bourguiba</p>
              <p className="text-gray-600 text-sm">Tunis, Tunisia</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
