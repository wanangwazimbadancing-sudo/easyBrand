import Contact from "../models/Contact.js";

const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

 const contact = await   Contact.create({name, email, message });

    return res.status(201).json({
      success: true,
      message:"Your message has been sent successfully. We'll get back to you within 24 hours.",
        contact
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};




const fetchMessages = async (req, res) => {
  try {
    const messages = await Contact.find({})
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: messages.length,
      messages,
    });
  } catch (error) {
    console.error("Fetch messages error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch messages.",
    });
  }
};

export { submitContactForm,fetchMessages };