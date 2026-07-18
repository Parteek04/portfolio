import nodemailer from "nodemailer";
import Message from "../models/Message.js";

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }

    // Save message to MongoDB
    const newMessage = await Message.create({ name, email, subject, message });

    // Try sending email notification using nodemailer
    try {
      // Configuration details for nodemailer
      const mailHost = process.env.EMAIL_HOST || "smtp.gmail.com";
      const mailPort = parseInt(process.env.EMAIL_PORT) || 587;
      const mailUser = process.env.EMAIL_USER;
      const mailPass = process.env.EMAIL_PASS;
      const mailTo = process.env.EMAIL_RECEIVER || mailUser;

      if (mailUser && mailPass) {
        const transporter = nodemailer.createTransport({
          host: mailHost,
          port: mailPort,
          secure: mailPort === 465, // true for 465, false for other ports
          auth: {
            user: mailUser,
            pass: mailPass
          }
        });

        const mailOptions = {
          from: `"Portfolio Contact Form" <${mailUser}>`,
          to: mailTo,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <h3>New Message Received from Portfolio Contact Form</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Message:</strong></p>
            <p>${message.replace(/\n/g, "<br/>")}</p>
          `
        };

        transporter.sendMail(mailOptions)
          .then(() => console.log("Email notification sent successfully."))
          .catch((emailError) => console.error("Email sending failed:", emailError.message));
      } else {
        console.log("Nodemailer configuration missing in .env. Logging message content to console instead:");
        console.log(`[Message] From: ${name} (${email}) | Subject: ${subject} | Content: ${message}`);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError.message);
      // We don't fail the request if only the email fails, since the message was successfully saved to MongoDB
    }

    res.status(201).json({
      success: true,
      message: "Message received successfully!"
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all messages (Admin only)
// @route   GET /api/contact/messages
// @access  Private
export const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find().sort("-createdAt");
    res.status(200).json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark message as read (Admin only)
// @route   PUT /api/contact/messages/:id
// @access  Private
export const markAsRead = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    message.isRead = true;
    await message.save();

    res.status(200).json({
      success: true,
      message
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete message (Admin only)
// @route   DELETE /api/contact/messages/:id
// @access  Private
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      res.status(404);
      throw new Error("Message not found");
    }

    await message.deleteOne();

    res.status(200).json({
      success: true,
      message: "Message deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};
