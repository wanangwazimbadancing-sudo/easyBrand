import Content from "../models/Content.js";

const createContent = async (req, res) => {
  try {
    const { title, description, category, videoUrl, thumbnail, duration, content, author, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const newContent = await Content.create({
      title,
      description,
      category,
      videoUrl,
      thumbnail,
      duration,
      content,
      author,
      status,
    });

    return res.status(201).json({
      success: true,
      message: "Content created successfully",
      content: newContent,
    });
  } catch (error) {
    console.error("Create content error:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating content",
    });
  }
};

const getAllContent = async (req, res) => {
  try {
    const contents = await Content.find({}).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: contents.length,
      contents,
    });
  } catch (error) {
    console.error("Fetch content error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch content",
    });
  }
};

const getContentById = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    return res.status(200).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Fetch content error:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch content",
    });
  }
};

const updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, category, videoUrl, thumbnail, duration, content, author, status } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      {
        title,
        description,
        category,
        videoUrl,
        thumbnail,
        duration,
        content,
        author,
        status,
      },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content updated successfully",
      content: updatedContent,
    });
  } catch (error) {
    console.error("Update content error:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating content",
    });
  }
};

const deleteContent = async (req, res) => {
  try {
    const { id } = req.params;

    const content = await Content.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete content error:", error);
    return res.status(500).json({
      success: false,
      message: "Error deleting content",
    });
  }
};

export { createContent, getAllContent, getContentById, updateContent, deleteContent };
