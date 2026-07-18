import React, { useState } from "react";
import { usePortfolioData } from "../../contexts/PortfolioDataContext";
import { contactApi } from "../../services/api";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

const Contact = () => {
  const { profile, settings } = usePortfolioData();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState({
    submitting: false,
    success: null,
    error: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setStatus({ submitting: false, success: null, error: "Please fill out all fields" });
      return;
    }

    setStatus({ submitting: true, success: null, error: null });
    try {
      const res = await contactApi.submit(formData);
      if (res.success) {
        setStatus({ submitting: false, success: "Your message has been received! I'll contact you shortly.", error: null });
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        setStatus({ submitting: false, success: null, error: res.message || "Failed to submit message." });
      }
    } catch (err) {
      setStatus({
        submitting: false,
        success: null,
        error: err.response?.data?.message || err.message || "Something went wrong."
      });
    }
  };

  const contactInfo = [
    {
      icon: <FaEnvelope className="text-indigo-400" size={18} />,
      label: "Email Address",
      value: settings?.contact?.email || profile?.email || "kumarparteek701@gmail.com",
      link: `mailto:${settings?.contact?.email || profile?.email || "kumarparteek701@gmail.com"}`
    },
    {
      icon: <FaPhoneAlt className="text-indigo-400" size={18} />,
      label: "Phone Number",
      value: settings?.contact?.phone || profile?.phone || "+91-9350046554",
      link: `tel:${settings?.contact?.phone || profile?.phone || "+91-9350046554"}`
    },
    {
      icon: <FaMapMarkerAlt className="text-indigo-400" size={18} />,
      label: "Location",
      value: settings?.contact?.address || profile?.location || "Panipat, Haryana, India",
      link: "https://maps.google.com/?q=Panipat,Haryana,India"
    }
  ];

  return (
    <section id="contact" className="py-24 relative z-10 grid-bg-dots-darker">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest font-bold text-indigo-500 bg-indigo-950/30 px-3 py-1 rounded-full border border-indigo-500/10">
            Contact
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl mt-3 text-white">
            Get In Touch
          </h2>
          <div className="h-[2px] w-12 bg-indigo-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column - Form */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl relative overflow-hidden">
              <h3 className="font-display font-bold text-xl text-white mb-6">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Parteek Goyal"
                      required
                      className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-slate-200 text-sm focus:outline-none transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@domain.com"
                      required
                      className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-slate-200 text-sm focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="subject" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Subject Topic
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Internship opportunity / Freelance collaboration"
                    required
                    className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-slate-200 text-sm focus:outline-none transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Message Body
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Hello Parteek, I looked at your B.Tech Data Science project SchemeSathi and would love to..."
                    required
                    className="px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500/50 text-slate-200 text-sm focus:outline-none transition-all resize-none"
                  ></textarea>
                </div>

                {/* Status messages */}
                {status.success && (
                  <div className="p-4 rounded-xl bg-green-950/20 border border-green-500/30 text-green-400 text-sm font-medium">
                    {status.success}
                  </div>
                )}
                {status.error && (
                  <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 text-red-400 text-sm font-medium">
                    {status.error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status.submitting}
                  className="mt-2 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300"
                >
                  <FaPaperPlane size={13} />
                  {status.submitting ? "Sending message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Map & Details */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-8">
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-white/5 shadow-xl">
              <h3 className="font-display font-bold text-xl text-white mb-6">
                Contact Details
              </h3>

              <div className="flex flex-col gap-5">
                {contactInfo.map((info) => (
                  <a
                    key={info.label}
                    href={info.link}
                    target={info.label === "Location" ? "_blank" : "_self"}
                    rel="noopener noreferrer"
                    className="flex gap-4 items-center group"
                  >
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 shadow-md group-hover:border-indigo-500/35 transition-colors">
                      {info.icon}
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                        {info.label}
                      </span>
                      <span className="block text-sm sm:text-base font-bold text-white group-hover:text-indigo-400 transition-colors mt-0.5">
                        {info.value}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Google Map Box */}
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-xl flex-1 min-h-[220px] aspect-video sm:aspect-auto">
              <iframe
                title="Google Maps Location - Panipat, Haryana"
                src={settings?.contact?.mapEmbedUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111244.59604169524!2d76.89069929726563!3d29.3909062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dd46c757c919d%3A0xb35a14d59a850125!2sPanipat%2C%20Haryana!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"}
                className="w-full h-full border-0 grayscale opacity-80 hover:opacity-100 hover:grayscale-0 transition-all duration-700"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
