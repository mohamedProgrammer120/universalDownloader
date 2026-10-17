const axios = require("axios");

async function fetchYouTubeData(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid YouTube URL must be provided");
  }

  try {
    // 1. On récupère d'abord les métadonnées via oEmbed (très fiable)
    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      {
        timeout: 8000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      }
    );

    const title = oembedRes.data?.title || "YouTube Video";
    const author = oembedRes.data?.author_name || "YouTube";
    const thumbnail = oembedRes.data?.thumbnail_url || null;

    // 2. Pour le moment on renvoie les métadonnées
    // (le vrai lien de téléchargement YouTube est plus compliqué sans scraper fiable)
    return {
      success: true,
      title,
      author,
      thumbnail,
      url,
      note: "Métadonnées récupérées. Le téléchargement direct YouTube est temporairement limité.",
      videos: [],
      audios: [],
    };
  } catch (err) {
    console.error("YouTube service error:", err.message);
    throw new Error("Impossible de récupérer les informations de cette vidéo YouTube");
  }
}

module.exports = { fetchYouTubeData };
