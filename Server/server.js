const express = require('express');
const cors = require('cors');
const ytDlp = require('youtube-dl-exec');
const ytSearch = require('yt-search');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// Ensure temp directory exists
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

console.log("-----------------------------------------");
console.log("🎵 Roblox YouTube Audio Middleman Server");
console.log("-----------------------------------------");

// 1. Search Endpoint
app.get('/search', async (req, res) => {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Missing query parameter" });

    console.log(`[🔎] Searching YouTube for: "${query}"`);

    try {
        const searchResults = await ytSearch(query);
        const firstResult = searchResults.videos[0];

        if (!firstResult) {
            console.log(`[❌] No results found for: ${query}`);
            return res.status(404).json({ error: "No results found" });
        }

        console.log(`[✅] Found: ${firstResult.title} (${firstResult.duration.timestamp})`);
        
        // Return the video data and ID immediately
        res.json({
            title: firstResult.title,
            author: firstResult.author.name,
            videoId: firstResult.videoId,
            url: firstResult.url,
            duration: firstResult.duration.seconds,
            thumbnail: firstResult.thumbnail // Send image URL back!
        });

    } catch (err) {
        console.error(`[❌] Search Error:`, err);
        res.status(500).json({ error: "Search failed" });
    }
});

// 1.5 Playlist Endpoint
app.get('/playlist', async (req, res) => {
    let url = req.query.url;
    if (!url) return res.status(400).json({ error: "Missing url parameter" });

    // Extract ONLY the list ID so yt-dlp doesn't get confused by "watch?v="
    const listIdMatch = url.match(/list=([a-zA-Z0-9_-]+)/);
    if (listIdMatch) {
        url = `https://www.youtube.com/playlist?list=${listIdMatch[1]}`;
    }

    console.log(`[🎶] Fetching Playlist: "${url}"`);

    try {
        const output = await ytDlp(url, {
            dumpSingleJson: true,
            flatPlaylist: true
        });
        
        if (!output.entries || output.entries.length === 0) {
             return res.status(404).json({ error: "Playlist is empty or invalid" });
        }
        
        const videos = output.entries.map(item => ({
            title: item.title,
            author: item.uploader || item.channel || "Unknown",
            videoId: item.id,
            url: `https://www.youtube.com/watch?v=${item.id}`,
            duration: item.duration || 0,
            thumbnail: item.thumbnails ? item.thumbnails[0].url : `https://img.youtube.com/vi/${item.id}/hqdefault.jpg`
        }));

        console.log(`[✅] Found Playlist: ${output.title} (${videos.length} tracks)`);
        
        res.json({
            playlistName: output.title,
            videos: videos
        });

    } catch (err) {
        console.error(`[❌] Playlist Error:`, err.message);
        res.status(500).json({ error: "Playlist fetch failed" });
    }
});

// 2. Download/Proxy Endpoint
// Roblox will call this URL: http://localhost:3000/audio/VIDEOID?bass=true
app.get('/audio/:videoId', async (req, res) => {
    const videoId = req.params.videoId;
    const bass = req.query.bass === 'true'; // Check if Bass Boost toggle is on!
    const url = `https://www.youtube.com/watch?v=${videoId}`;

    try {
        console.log(`[⬇️] Roblox requested audio for Video ID: ${videoId}`);
        
        const filePath = path.join(tempDir, `${videoId}.mp3`);

        // If it's already downloaded, serve it instantly!
        if (fs.existsSync(filePath)) {
            console.log(`[⚡] Found cached ${videoId}.mp3, serving instantly...`);
            return res.download(filePath, `${videoId}.mp3`);
        }

        console.log(`[⏳] Downloading and encoding MP3... this may take 5-10 secs.`);
        
        const subprocessOptions = {
            output: `"${filePath.replace('.mp3', '')}"`, 
            quiet: true, 
            extractAudio: true,
            audioFormat: 'mp3',
            format: 'bestaudio'
        };

        // BASS BOOST EQ FILTER TRICK:
        // By injecting args to ffmpeg, we can equalize the bass frequencies!
        if (bass) {
            console.log(`[🔊] BASS BOOST ENABLED FOR ${videoId}!`);
            subprocessOptions['postprocessorArgs'] = 'ffmpeg:-af "equalizer=f=60:width_type=h:width=50:g=15"';
            // Also append a suffix so we don't accidentally serve a non-bass-boosted cached version
            filePath = filePath.replace('.mp3', '_bass.mp3');
            subprocessOptions.output = `"${filePath.replace('_bass.mp3', '_bass')}"`;
        }
        
        const subprocess = ytDlp.exec(url, subprocessOptions);

        subprocess.on('close', (code) => {
            if (code === 0 && fs.existsSync(filePath)) {
                console.log(`[✅] Finished encoding ${videoId}.mp3! Serving to Roblox...`);
                res.download(filePath, `${videoId}.mp3`, (err) => {
                    if (!err) {
                        // Automatically delete the file after it finishes sending to Roblox
                        fs.unlink(filePath, (unlinkErr) => {
                            if (unlinkErr) console.error(`[⚠️] Failed to delete cache:`, unlinkErr);
                            else console.log(`[🧹] Successfully cleaned up ${videoId}.mp3 to save space!`);
                        });
                    }
                });
            } else {
                console.error(`[❌] yt-dlp failed to create MP3 or exited with code ${code}`);
                res.status(500).send("Error generating MP3");
            }
        });

        subprocess.stderr.on('data', (data) => {
            // Optional: you can log this if you want to see ffmpeg/yt-dlp errors
            // console.error(`[⚠️] yt-dlp stderr:`, data.toString());
        });

    } catch (err) {
        console.error(`[❌] Download Error:`, err);
        res.status(500).send("Error downloading audio");
    }
});

// 3. Thumbnail Proxy Endpoint
// Roblox blocked cross-origin image loads from youtube.com, so we proxy the JPG!
const https = require('https');

app.get('/thumbnail', (req, res) => {
    const imageUrl = req.query.url;
    if (!imageUrl) return res.status(400).send("Missing URL");

    https.get(imageUrl, (imageRes) => {
        if (imageRes.statusCode !== 200) {
            return res.status(imageRes.statusCode).send("Failed to fetch image");
        }
        res.setHeader('Content-Type', 'image/jpeg');
        imageRes.pipe(res);
    }).on('error', (err) => {
        console.error(`[❌] Image Proxy Error:`, err.message);
        res.status(500).send("Proxy failed");
    });
});

app.listen(PORT, () => {
    console.log(`[🚀] Server is running on http://localhost:${PORT}`);
    console.log(`[✅] Ready for Roblox to connect! Waiting for searches...\n`);
});
