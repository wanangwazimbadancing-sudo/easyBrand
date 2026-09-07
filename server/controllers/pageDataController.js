import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../data");

// Ensure data directory exists
const ensureDataDir = async () => {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
};

// Get page data by type
export const getPageData = async (req, res) => {
  try {
    await ensureDataDir();
    const { dataType } = req.params;

    const validTypes = ["plans", "videos", "contact", "faqs"];
    if (!validTypes.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data type",
      });
    }

    const filePath = path.join(DATA_DIR, `${dataType}.json`);

    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      const data = JSON.parse(fileContent);
      return res.json({
        success: true,
        [dataType]: data,
      });
    } catch (err) {
      // File doesn't exist yet, return default empty structure
      return res.json({
        success: true,
        [dataType]: [],
      });
    }
  } catch (error) {
    console.error("Error getting page data:", error);
    res.status(500).json({
      success: false,
      message: "Error retrieving page data",
    });
  }
};

// Update page data by type
export const updatePageData = async (req, res) => {
  try {
    await ensureDataDir();
    const { dataType } = req.params;
    const data = req.body[dataType] || req.body;

    const validTypes = ["plans", "videos", "contact", "faqs"];
    if (!validTypes.includes(dataType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid data type",
      });
    }

    const filePath = path.join(DATA_DIR, `${dataType}.json`);

    // Write data to file
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    res.json({
      success: true,
      message: `${dataType} updated successfully`,
    });
  } catch (error) {
    console.error("Error updating page data:", error);
    res.status(500).json({
      success: false,
      message: "Error updating page data",
    });
  }
};
