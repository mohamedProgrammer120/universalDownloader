const snapsave = require("metadownloader");
const axios = require("axios");

async function facebookInsta(url) {
  if (!url || typeof url !== "string") {
    throw new Error("URL manquante ou invalide");
  }

  try {
    // 1. Essai avec metadownloader (snapsave)
    const result = await snapsave(url);

    // Vérifie si le résultat contient bien des médias
    if (result && (result.url || result.media || result.video || Array.isArray(result))) {
      return {
        status: true,
        developer: "@Milan Bhandari",
        data: result,
      };
    }

    // Si le résultat est vide ou invalide
    throw new Error("Aucun média trouvé avec metadownloader");
  } catch (error) {
    console.error("metadownloader failed:", error.message);

    // 2. Fallback simple pour Instagram (oEmbed)
    if (url.includes("instagram.com")) {
      try {
        const oembedUrl = `https://api.instagram.com/oembed?url=${encodeURIComponent(url)}`;
        const { data } = await axios.get(oembedUrl, {
          timeout: 8000,
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          },
        });

        return {
          status: true,
          developer: "@Milan Bhandari",
          title: data.title || null,
          author: data.author_name || null,
          thumbnail: data.thumbnail_url || null,
          note: "Métadonnées uniquement (lien de téléchargement non disponible)",
        };
      } catch (oembedError) {
        console.error("Instagram oEmbed failed:", oembedError.message);
      }
    }

    // 3. Erreur finale
    throw new Error(
      "Impossible de récupérer le média Instagram/Facebook. " +
        "Les liens /share/ ou protégés échouent souvent. Essayez un lien Reel ou post public direct."
    );
  }
}

module.exports = facebookInsta;
