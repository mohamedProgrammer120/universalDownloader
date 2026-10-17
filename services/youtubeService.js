const axios = require("axios");

async function fetchYouTubeData(url) {
  if (!url || typeof url !== "string") {
    throw new Error("A valid YouTube URL must be provided");
  }

  try {
    // Récupération des métadonnées via oEmbed (officiel et stable)
    const oembedRes = await axios.get(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      {
        timeout: 10000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        },
      }
    );

    const title = oembedRes.data?.title || "YouTube Video";
    const author = oembedRes.data?.author_name || "YouTube";
    const thumbnail = oembedRes.data?.thumbnail_url || null;

    // Extraire l'ID de la vidéo
    const videoIdMatch = url.match(
      /(?:v=|youtu\.be\/|shorts\/|embed\/)([a-zA-Z0-9_-]{11})/
    );
    const videoId = videoIdMatch?.[1] || null;

    return {
      success: true,
      type: "video",
      url,
      title,
      author,
      thumbnail: thumbnail
        ? thumbnail.replace("hqdefault", "maxresdefault")
        : videoId
        ? `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`
        : null,
      videoId,
      videos: [],
      audios: [],
      note: "Métadonnées récupérées avec succès. Le téléchargement direct YouTube est limité actuellement.",
    };
  } catch (err) {
    console.error("YouTube service error:", err.message);
    throw new Error("Impossible de récupérer les informations de cette vidéo YouTube");
  }
}

module.exports = { fetchYouTubeData };
