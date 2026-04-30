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
  Puzzle,
  Sparkles,
  Target,
  Gift,
  Crown,
  Zap,
  Coffee,
  Store,
  Rocket,
  Bell,
  TrendingUp,
  ShoppingCart,
  Factory,
  Ship,
  Lock,
  Unlock,
  Eye,
  MessageCircle,
  Users as UsersIcon,
} from "lucide-react";
import Button from "../components/common/Button";

const AboutUs = () => {
  const steps = [
    {
      number: "01",
      title: "Browse Puzzles by Your Hobby",
      description:
        "From anime and gaming to movies and sports - find a mystery that excites you.",
      icon: <Eye className="w-8 h-8" />,
      color: "bg-blue-100 text-blue-600",
    },
    {
      number: "02",
      title: "Buy a Fragment",
      description:
        "Purchase a fragment (limited edition clothing piece) from the puzzle. Each fragment is unique and no one else can buy the same one.",
      icon: <ShoppingCart className="w-8 h-8" />,
      color: "bg-primary-100 text-primary-600",
    },
    {
      number: "03",
      title: "Wait for All Fragments to Sell",
      description:
        "Production only starts when ALL fragments of a puzzle are sold. You can track progress and get notifications.",
      icon: <Bell className="w-8 h-8" />,
      color: "bg-yellow-100 text-yellow-600",
    },
    {
      number: "04",
      title: "Manufacturing Based on Your Size",
      description:
        "Once fully sold, we collect sizes and gender preferences from all owners and manufacture each piece specifically for them.",
      icon: <Factory className="w-8 h-8" />,
      color: "bg-green-100 text-green-600",
    },
    {
      number: "05",
      title: "Connect with Other Owners",
      description:
        "Access owner profiles, chat with fellow fragment holders, and collaborate to solve the mystery.",
      icon: <UsersIcon className="w-8 h-8" />,
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      number: "06",
      title: "Solve the Puzzle & Win Rewards",
      description:
        "Work together, share clues, solve the mystery, and claim amazing prizes based on difficulty level.",
      icon: <Gift className="w-8 h-8" />,
      color: "bg-red-100 text-red-600",
    },
  ];

  const features = [
    {
      icon: <Puzzle className="w-6 h-6" />,
      title: "Exclusive Ownership",
      description:
        "Each fragment is ONE OF A KIND. Once you buy it, no one else can ever own that specific piece.",
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Real-Time Tracking",
      description:
        "See exactly how many fragments remain, track production status, and get notified when your puzzle is ready.",
    },
    {
      icon: <UsersIcon className="w-6 h-6" />,
      title: "Owner Community",
      description:
        "View profiles of other fragment owners, send messages, and build your puzzle-solving team.",
    },
    {
      icon: <Gift className="w-6 h-6" />,
      title: "Random Fragment Drops",
      description:
        "Buy regular clothing and you might discover a hidden fragment - for free! Common (40%), Rare (5%), or Legendary (1%).",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Made-to-Order Quality",
      description:
        "We don't manufacture until we know your exact size and preferences. Every piece is made specifically for YOU.",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Real Rewards",
      description:
        "Cash prizes, luxury hotel stays, exclusive merchandise, and unforgettable experiences await the solvers.",
    },
  ];

  const raritySystem = [
    {
      rarity: "Common",
      chance: "40%",
      color: "bg-gray-100 text-gray-700",
      border: "border-gray-300",
      description: "Randomly appears in normal purchases",
    },
    {
      rarity: "Rare",
      chance: "5%",
      color: "bg-primary-100 text-primary-700",
      border: "border-primary-300",
      description: "Special fragments with better rewards",
    },
    {
      rarity: "Legendary",
      chance: "1%",
      color: "bg-yellow-100 text-yellow-700",
      border: "border-yellow-400",
      description: "Ultra-rare fragments, biggest prizes",
    },
  ];

  const examplePuzzle = {
    name: "One Piece: Straw Hat Crew",
    fragments: 10,
    progress: 7,
    owners: [
      {
        name: "Monkey D. Luffy",
        fragment: "Captain's Hoodie",
        rarity: "legendary",
      },
      { name: "Roronoa Zoro", fragment: "Swordsman Jacket", rarity: "rare" },
      { name: "Nami", fragment: "Navigator's Shirt", rarity: "common" },
    ],
    reward: "Trip to Tokyo Tower + $10,000 + Exclusive Merch",
  };

  const faqs = [
    {
      q: "When do you start making the clothes?",
      a: "We ONLY start manufacturing once ALL fragments of a puzzle have been purchased. This ensures we know exactly how many pieces to make and each owner's size preferences.",
    },
    {
      q: "Can I buy a fragment after someone else already bought it?",
      a: "No! Each fragment is unique and can only be owned by ONE person. When it's gone, it's gone forever.",
    },
    {
      q: "How do I get a fragment for free?",
      a: "When you buy any regular clothing from our store, there's a chance (up to 40%) that your package contains a hidden fragment from a random puzzle!",
    },
    {
      q: "Can I see who else owns fragments from my puzzle?",
      a: "Yes! Once you own a fragment, you can view profiles of other owners (if they choose to be visible) and contact them to collaborate.",
    },
    {
      q: "What if I buy a fragment and the puzzle never sells out?",
      a: "We guarantee all puzzles will eventually sell. However, if a puzzle is inactive for 6+ months, you'll get a full refund and keep the clothing when manufactured.",
    },
    {
      q: "How do I solve the mystery?",
      a: "Each puzzle has unique clues that reveal over time. Owners work together in private chat rooms, share discoveries, and submit solutions to claim rewards.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500 rounded-full -translate-y-32 translate-x-32 opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black rounded-full translate-y-48 -translate-x-48 opacity-20"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4">
                <Puzzle className="w-16 h-16" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-primary-300">PUZZLE</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-200 mb-6">
              Where Every Purchase is a Mystery Waiting to Be Solved
            </p>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-10">
              We sell premium clothing that doubles as collectible puzzle
              pieces. Buy fragments, connect with other owners, solve mysteries
              together, and win incredible rewards.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="large"
                className="bg-white text-primary-700 hover:bg-primary-50"
              >
                Explore Puzzles
              </Button>
              <Button
                variant="outline"
                size="large"
                className="border-white text-white hover:bg-white/10"
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Simple Explanation */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Exactly Do We Do?
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              We create{" "}
              <span className="font-bold text-primary-600">
                interactive clothing collections
              </span>{" "}
              called "Enigmas". Each Enigma contains multiple "Fragments" -
              limited edition clothing pieces.
              <span className="block mt-3">
                Buy fragments, find other owners, solve the mystery together,
                and win amazing prizes.
              </span>
              <span className="block mt-2 text-primary-600 font-medium">
                Production only starts when ALL fragments are sold - and we make
                each piece based on YOUR size and preferences.
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* How It Works - Detailed Steps */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Step by Step
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              How PUZZLE Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From browsing to winning - here's your complete journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color}`}
                  >
                    {step.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-200">-</div>
                  <div className="text-2xl font-bold text-primary-600">
                    {step.number}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Example */}
      <section className="py-20 bg-gradient-to-r from-primary-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
                Real Example
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                See It in Action
              </h2>
              <p className="text-lg text-gray-600">
                Here's how a real puzzle works on our platform
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-primary-100">
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">
                  {examplePuzzle.name}
                </h3>
                <p className="text-primary-200">
                  {examplePuzzle.fragments} Total Fragments
                </p>
              </div>

              <div className="p-6">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Fragments Sold</span>
                    <span>
                      {examplePuzzle.progress} / {examplePuzzle.fragments}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 rounded-full h-3 transition-all"
                      style={{
                        width: `${
                          (examplePuzzle.progress / examplePuzzle.fragments) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                  <p className="text-sm text-orange-600 mt-2 flex items-center gap-1">
                    <Bell className="w-4 h-4" />
                    {examplePuzzle.fragments - examplePuzzle.progress} more
                    purchases needed to start production
                  </p>
                </div>

                {/* Owners List */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <UsersIcon className="w-5 h-5" />
                    Current Fragment Owners
                  </h4>
                  <div className="space-y-2">
                    {examplePuzzle.owners.map((owner, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {owner.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {owner.fragment}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            owner.rarity === "legendary"
                              ? "bg-yellow-100 text-yellow-700"
                              : owner.rarity === "rare"
                              ? "bg-primary-100 text-primary-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {owner.rarity.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-3 text-primary-600 text-sm hover:text-primary-700 flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    View all owners
                  </button>
                </div>

                {/* Reward */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl border border-yellow-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-5 h-5 text-yellow-600" />
                    <h4 className="font-bold text-gray-900">Grand Prize</h4>
                  </div>
                  <p className="text-gray-700">{examplePuzzle.reward}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    * Prize unlocks when all fragments are sold AND the mystery
                    is solved
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Random Fragment Distribution */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              Lucky Discovery
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              You Might Get a Fragment for FREE
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every time you buy regular clothing from our store, you have a
              chance to discover a hidden fragment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {raritySystem.map((item) => (
              <div
                key={item.rarity}
                className={`text-center p-6 rounded-2xl border-2 ${item.border} bg-white`}
              >
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${item.color}`}
                >
                  <span className="text-2xl font-bold">{item.chance}</span>
                </div>
                <h3
                  className={`text-xl font-bold mb-2 ${
                    item.color.split(" ")[1]
                  }`}
                >
                  {item.rarity}
                </h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              <strong>Example:</strong> Buy 10 regular hoodies → 40% chance one
              of them is actually a rare puzzle fragment!
            </p>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-4">
              What Makes Us Unique
            </span>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why PUZZLE is Different
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to know about PUZZLE
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group border border-gray-200 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none hover:bg-gray-50">
                  <h3 className="font-semibold text-gray-900 pr-4">{faq.q}</h3>
                  <div className="text-primary-600 group-open:rotate-180 transition-transform">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </summary>
                <div className="px-5 pb-5 pt-0 text-gray-600 border-t border-gray-100">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-primary-700 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h2>
          <p className="text-xl text-primary-200 mb-8 max-w-2xl mx-auto">
            Find a puzzle that matches your hobby. Buy fragments. Connect with
            others. Solve mysteries. Win prizes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="large"
              className="bg-white text-primary-700 hover:bg-primary-50"
            >
              Browse Enigmas
            </Button>
            <Button
              variant="outline"
              size="large"
              className="border-white text-white hover:bg-white/10"
            >
              View Active Puzzles
            </Button>
          </div>
          <p className="text-sm text-primary-300 mt-8">
            New puzzles added weekly • Physical store coming soon
          </p>
        </div>
      </section>

      {/* Footer Contact */}
      <section className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Contact Us</h3>
              <p className="text-gray-400">+216 XX XXX XXX</p>
              <p className="text-gray-500 text-sm">Mon-Sun: 9AM - 9PM</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-400">hello@puzzle.com</p>
              <p className="text-gray-500 text-sm">24h Response Time</p>
            </div>

            <div>
              <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-2">Store Status</h3>
              <p className="text-gray-400">Online Worldwide</p>
              <p className="text-gray-500 text-sm">
                Physical Store: Coming 2025
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Missing Trophy component
const Trophy = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9H4.5C3.5 9 3 8.5 3 7.5V6C3 5 3.5 4.5 4.5 4.5H6M18 9H19.5C20.5 9 21 8.5 21 7.5V6C21 5 20.5 4.5 19.5 4.5H18" />
    <path d="M12 13V19M8 21H16" />
    <path d="M12 13C9.5 13 7 11 7 7V4H17V7C17 11 14.5 13 12 13Z" />
  </svg>
);

const ChevronDown = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default AboutUs;
