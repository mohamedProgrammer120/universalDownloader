const axios = require("axios");

async function fetchYouTubeData(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid YouTube URL must be provided");
  }

  try {
    // Méthode alternative plus fiable (utilise un autre endpoint public)
    const { data } = await axios.get("https://api.cobalt.tools/", {
      params: { url },
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
      },
      timeout: 15000,
      validateStatus: () => true,
    });

    // Si cobalt répond bien
    if (data && (data.status === "tunnel" || data.status === "redirect" || data.status === "stream")) {
      return {
        type: "video",
        url,
        title: data.filename || "YouTube Video",
        thumbnail: null,
        videos: [
          {
            quality: "best",
            url: data.url,
            format: "mp4",
          },
        ],
        audios: [],
      };
    }

    // Fallback : essayer une autre source
    const oembed = await axios.get(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { timeout: 8000 }
    );

    return {
      type: "video",
      url,
      title: oembed.data?.title || "YouTube Video",
      thumbnail: oembed.data?.thumbnail_url || null,
      videos: [],
      audios: [],
      note: "Metadata only - download link unavailable with current sources",
    };
  } catch (err) {
    console.error("YouTube fetch failed:", err.message);
    throw new Error("Impossible de récupérer la vidéo YouTube actuellement");
  }
}

module.exports = { fetchYouTubeData };
