const axios = require("axios");
const cheerio = require("cheerio");
const qs = require("qs");

async function fetchTikTokData(videoUrl) {
  try {
    // On essaie d'abord ssstik
    const body = qs.stringify({
      id: videoUrl,
      locale: "en",
      tt: "dHl6Ylg4",
    });

    const res = await axios.post("https://ssstik.io/abc?url=dl", body, {
      headers: {
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        referer: "https://ssstik.io/en",
        "hx-request": "true",
        "hx-target": "target",
        "hx-trigger": "_gcaptcha_pt",
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);

    const title =
      $("#avatar_and_text h2").text().trim() ||
      $("#avatarAndTextUsual h2").text().trim() ||
      null;

    const thumbnail =
      $(".result_author").attr("src") ||
      $("#mainpicture").attr("src") ||
      null;

    const downloads = [];

    $("a.download_link").each((_, el) => {
      const text = $(el).text().replace(/\s+/g, " ").trim();
      const href = $(el).attr("href");

      if (href && href !== "#" && href.startsWith("http")) {
        downloads.push({
          text: text || "Download",
          url: href,
        });
      }
    });

    // Si aucun lien trouvé, on essaie une autre source
    if (downloads.length === 0) {
      throw new Error("Aucun lien trouvé via ssstik");
    }

    return {
      status: true,
      title,
      thumbnail,
      downloads,
    };
  } catch (error) {
    console.error("TikTok fetch failed:", error.message);
    throw new Error(`Impossible de récupérer la vidéo TikTok : ${error.message}`);
  }
}

module.exports = { fetchTikTokData };
