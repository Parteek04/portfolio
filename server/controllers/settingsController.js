import Setting from "../models/Setting.js";

// Helper to get or create settings
const getOrCreateSettings = async () => {
  let settings = await Setting.findOne();
  if (!settings) {
    settings = await Setting.create({
      visitorCount: 1,
      seo: {
        title: "Parteek Goyal | Software Engineer Portfolio",
        description: "B.Tech Computer Engineering (Data Science) Portfolio Website",
        keywords: "Parteek, Goyal, MERN, Data Science, YMCA",
        ogImage: "/images/og-image.png",
        siteUrl: "http://localhost:3000"
      },
      contact: {
        email: "kumarparteek701@gmail.com",
        phone: "+91-9350046554",
        address: "Panipat, Haryana, India",
        mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111244.59604169524!2d76.89069929726563!3d29.3909062!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dd46c757c919d%3A0xb35a14d59a850125!2sPanipat%2C%20Haryana!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
      },
      theme: {
        defaultMode: "dark",
        primaryAccent: "#6366f1",
        enableParticles: true,
        enableCustomCursor: true
      },
      analytics: {
        googleAnalyticsId: ""
      }
    });
  }
  return settings;
};

// @desc    Get current website settings
// @route   GET /api/settings
// @access  Public
export const getSettings = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update settings (Admin only)
// @route   PUT /api/settings
// @access  Private
export const updateSettings = async (req, res, next) => {
  try {
    let settings = await getOrCreateSettings();
    settings = await Setting.findByIdAndUpdate(settings._id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Increment visitor counter
// @route   POST /api/settings/visit
// @access  Public
export const incrementVisitorCount = async (req, res, next) => {
  try {
    const settings = await getOrCreateSettings();
    settings.visitorCount += 1;
    await settings.save();
    res.status(200).json({
      success: true,
      visitorCount: settings.visitorCount
    });
  } catch (error) {
    next(error);
  }
};
