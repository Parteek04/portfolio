import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    visitorCount: { type: Number, default: 0 },
    seo: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      siteUrl: { type: String, default: "" }
    },
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      mapEmbedUrl: { type: String, default: "" }
    },
    theme: {
      defaultMode: { type: String, default: "dark" },
      primaryAccent: { type: String, default: "#6366f1" },
      enableParticles: { type: Boolean, default: true },
      enableCustomCursor: { type: Boolean, default: true }
    },
    analytics: {
      googleAnalyticsId: { type: String, default: "" }
    }
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;
