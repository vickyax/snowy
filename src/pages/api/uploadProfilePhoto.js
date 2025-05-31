import supabase from "@/utils/supabaseServer";
import Busboy from "busboy";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const busboy = Busboy({ headers: req.headers });
  let fileBuffer = [];
  let filePath = "";

  let hasFile = false;

  busboy.on("file", (name, file, info) => {
    hasFile = true;
    file.on("data", (data) => fileBuffer.push(data));
    file.on("end", () => {});
  });

  busboy.on("field", (name, val) => {
    if (name === "path") filePath = val;
  });

  busboy.on("finish", async () => {
    if (!hasFile || !filePath) {
      res.status(400).json({ error: "No file or path provided" });
      return;
    }
    const buffer = Buffer.concat(fileBuffer);
    const { data, error } = await supabase.storage
      .from("profile-photos")
      .upload(filePath, buffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) return res.status(500).json({ error: error.message });

    const { data: publicUrlData } = supabase.storage
      .from("profile-photos")
      .getPublicUrl(filePath);

    return res.status(200).json({ url: publicUrlData.publicUrl });
  });

  req.pipe(busboy);
}