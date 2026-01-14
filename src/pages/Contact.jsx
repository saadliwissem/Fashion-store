import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  HelpCircle,
  User,
  Calendar,
} from "lucide-react";
import Button from "../components/common/Button";
import toast from "react-hot-toast";

const ContactUs = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Contact form submitted:", data);
      setIsSubmitted(true);
      reset();
      toast.success("Message sent successfully! We'll contact you soon.");

      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      details: ["+216 70 123 456", "+216 71 987 654"],
      description: "Call us for immediate assistance",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      actionText: "Call Now",
      action: () => window.open("tel:+21670123456"),
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      details: ["contact@DAR ENNAR.tn", "support@DAR ENNAR.tn"],
      description: "We reply within 2 hours",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      actionText: "Send Email",
      action: () => window.open("mailto:contact@DAR ENNAR.tn"),
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Working Hours",
      details: ["Monday - Sunday: 8AM - 10PM", "Ramadan: 10AM - 2AM"],
      description: "24/7 online support available",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
      actionText: "Chat Now",
      action: () => {
        toast.success("Live chat will open in a new window");
        // In production: window.open('/chat', '_blank')
      },
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Store",
      details: ["Avenue Habib Bourguiba", "Tunis, Tunisia"],
      description: "Free parking available",
      color: "text-rose-600",
      bgColor: "bg-rose-100",
      actionText: "Get Directions",
      action: () =>
        window.open(
          "https://www.google.com/maps/search/?api=1&query=Avenue+Habib+Bourguiba+Tunis+Tunisia",
          "_blank"
        ),
    },
  ];

  const departments = [
    {
      name: "Customer Support",
      email: "support@DAR ENNAR.tn",
      phone: "+216 70 111 222",
      description: "Order issues, returns, and general inquiries",
    },
    {
      name: "Sales & Partnerships",
      email: "sales@DAR ENNAR.tn",
      phone: "+216 70 333 444",
      description: "Wholesale, corporate orders, and partnerships",
    },
    {
      name: "Technical Support",
      email: "tech@DAR ENNAR.tn",
      phone: "+216 70 555 666",
      description: "Website issues, account problems, and technical queries",
    },
    {
      name: "Careers",
      email: "careers@DAR ENNAR.tn",
      phone: "+216 70 777 888",
      description: "Job opportunities and internship inquiries",
    },
  ];

  const socialLinks = [
    {
      platform: "Facebook",
      icon: <Facebook className="w-5 h-5" />,
      handle: "@DAR ENNARTN",
      url: "https://facebook.com",
      color: "hover:bg-blue-100 hover:text-blue-600",
    },
    {
      platform: "Instagram",
      icon: <Instagram className="w-5 h-5" />,
      handle: "@DAR ENNAR_TN",
      url: "https://instagram.com",
      color: "hover:bg-pink-100 hover:text-pink-600",
    },
    {
      platform: "Twitter",
      icon: <Twitter className="w-5 h-5" />,
      handle: "@DAR ENNARTN",
      url: "https://twitter.com",
      color: "hover:bg-sky-100 hover:text-sky-600",
    },
    {
      platform: "LinkedIn",
      icon: <Linkedin className="w-5 h-5" />,
      handle: "DAR ENNAR Tunisia",
      url: "https://linkedin.com",
      color: "hover:bg-blue-100 hover:text-blue-600",
    },
  ];

  const faqs = [
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via SMS and email. You can also track it from your account dashboard.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy. Items must be unworn with original tags. Returns are free and processed within 3-5 business days.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only ship within Tunisia. We're planning to expand to neighboring countries soon.",
    },
    {
      question: "How can I change my delivery address?",
      answer:
        "You can update your address from your account settings or contact our support team before your order ships.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-500 to-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-48 -translate-x-48"></div>
        </div>

        <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              We're Here to Help
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 mb-8">
              Get in touch with our friendly team. We're always happy to assist
              you.
            </p>
            <div className="flex items-center justify-center gap-2 text-primary-100">
              <MessageSquare className="w-5 h-5" />
              <span>Average response time: 15 minutes</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-6"
              >
                <div
                  className={`w-14 h-14 ${method.bgColor} rounded-xl flex items-center justify-center ${method.color} mb-6`}
                >
                  {method.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {method.title}
                </h3>
                <div className="space-y-2 mb-4">
                  {method.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-700">
                      {detail}
                    </p>
                  ))}
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  {method.description}
                </p>
                <Button
                  variant="outline"
                  onClick={method.action}
                  className={`w-full ${method.color.replace(
                    "text-",
                    "text-"
                  )} border-gray-200 hover:${method.bgColor}`}
                >
                  {method.actionText}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">
                  <Send className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you ASAP
                  </p>
                </div>
              </div>

              {isSubmitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-medium text-emerald-800">
                        Message sent successfully!
                      </p>
                      <p className="text-emerald-700 text-sm">
                        Thank you for contacting us. We'll respond within 2
                        hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register("firstName", {
                          required: "First name is required",
                        })}
                        type="text"
                        className="input-modern pl-10"
                        placeholder="Ahmed"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      {...register("lastName", {
                        required: "Last name is required",
                      })}
                      type="text"
                      className="input-modern"
                      placeholder="Ben Ali"
                    />
                    {errors.lastName && (
                      <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: "Invalid email address",
                          },
                        })}
                        type="email"
                        className="input-modern pl-10"
                        placeholder="you@example.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        {...register("phone")}
                        type="tel"
                        className="input-modern pl-10"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    {...register("subject", {
                      required: "Please select a subject",
                    })}
                    className="input-modern w-full"
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Select a topic
                    </option>
                    <option value="order">Order Inquiry</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Exchanges</option>
                    <option value="product">Product Questions</option>
                    <option value="account">Account Issues</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && (
                    <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    {...register("message", {
                      required: "Message is required",
                      minLength: {
                        value: 20,
                        message:
                          "Please provide more details (at least 20 characters)",
                      },
                    })}
                    rows={6}
                    className="input-modern w-full resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                  <p className="text-sm text-gray-500">
                    We typically respond within 2 hours during business hours
                  </p>
                </div>
              </form>
            </div>

            {/* Departments Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Contact Specific Departments
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {departments.map((dept, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:border-primary-300 transition-colors"
                  >
                    <h4 className="font-bold text-gray-900 mb-2">
                      {dept.name}
                    </h4>
                    <p className="text-gray-600 text-sm mb-4">
                      {dept.description}
                    </p>
                    <div className="space-y-2">
                      <a
                        href={`mailto:${dept.email}`}
                        className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm"
                      >
                        <Mail className="w-4 h-4" />
                        {dept.email}
                      </a>
                      <a
                        href={`tel:${dept.phone.replace(/\s+/g, "")}`}
                        className="flex items-center gap-2 text-gray-700 hover:text-gray-900 text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        {dept.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* FAQ Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  Quick Answers
                </h3>
              </div>

              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-gray-600 text-sm">{faq.answer}</p>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-6"
                onClick={() => window.open("/faq", "_blank")}
              >
                View All FAQs
              </Button>
            </div>

            {/* Social Media */}
            <div className="bg-gradient-to-br from-primary-50 to-neutral-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Connect With Us
              </h3>
              <p className="text-gray-600 mb-6">
                Follow us on social media for the latest updates, fashion tips,
                and exclusive offers.
              </p>

              <div className="space-y-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 transition-all hover:shadow-md ${social.color}`}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center">
                      {social.icon}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {social.platform}
                      </p>
                      <p className="text-sm text-gray-500">{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Store Hours */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Store Hours</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-700">Monday - Friday</span>
                  <span className="font-medium">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-700">Saturday</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-gray-700">Sunday</span>
                  <span className="font-medium">10:00 AM - 5:00 PM</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Ramadan Hours</span>
                  <span className="font-medium">10:00 AM - 2:00 AM</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 rounded-lg">
                <p className="text-sm text-amber-800">
                  <span className="font-medium">Note:</span> Online orders are
                  processed 24/7. Physical store hours may vary on holidays.
                </p>
              </div>
            </div>

            {/* Map Location */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Our Main Store
                </h3>
                <p className="text-gray-600 mb-4">
                  Visit our flagship store in the heart of Tunis. Free parking
                  available.
                </p>
                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <MapPin className="w-5 h-5 text-primary-600" />
                  <span>Avenue Habib Bourguiba, Tunis, Tunisia</span>
                </div>
              </div>
              <div className="h-64 bg-gray-200 relative">
                {/* In production, use a real map component like Google Maps */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-primary-100">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-primary-600 mx-auto mb-3" />
                    <p className="font-medium text-gray-700">Interactive Map</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Click to view in Google Maps
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    window.open(
                      "https://www.google.com/maps/search/?api=1&query=Avenue+Habib+Bourguiba+Tunis+Tunisia",
                      "_blank"
                    )
                  }
                  className="absolute inset-0 w-full h-full"
                  aria-label="Open in Google Maps"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <section className="bg-gradient-to-r from-primary-600 to-black text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-primary-100 mb-8">
              Subscribe to our newsletter for exclusive offers, fashion tips,
              and updates.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
              />
              <Button className="bg-white text-primary-700 hover:bg-primary-50 whitespace-nowrap">
                Subscribe
              </Button>
            </div>
            <p className="text-primary-200 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactUs;
