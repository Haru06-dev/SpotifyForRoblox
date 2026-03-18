# 🎧 Spotify For Roblox (Executor)

> Play ANY song from YouTube directly inside Roblox.

Tired of Roblox deleting your audio or blocking uploads?  
This lets you search and stream music instantly — no audio IDs, no uploads, no browser needed.

---

## 🚀 Preview
<img width="1189" height="647" alt="image" src="https://github.com/user-attachments/assets/ef9264de-ac4e-4abf-aa18-032cc01d3e09" />
<img width="788" height="626" alt="image" src="https://github.com/user-attachments/assets/35877a52-1dd8-4efe-83a4-7815bb1a9b0c" />



---

## ✨ Features

🔍 **Search Anything**  
Type any song, artist, or playlist — instantly plays in Roblox.

🖼️ **Dynamic Album Art**  
Auto-fetches high-quality thumbnails like a real music app.

🎛️ **Full Player Controls**  
Play, Pause, Skip, Previous, Shuffle, Loop modes.

⚡ **Lag-Free System**  
Smart request debouncing prevents freezes when skipping tracks.

🔊 **Bass Boost Mode**  
Toggle enhanced audio instantly.

📂 **Playlist Support**  
Paste a YouTube playlist → loads entire queue.

🧹 **Auto Cleanup**  
Deletes old MP3s & thumbnails to save space.

---

## 🧠 How It Works

This uses a **local Node.js server** to:
- Fetch YouTube audio
- Convert it to MP3
- Send it to Roblox
- Load it using executor APIs (`getcustomasset`)

Basically:  
YouTube → Your PC → Roblox (real-time)

---

## 🛠️ Setup

1. Install Node.js (LTS)

2. Run:

3. Start server

4. Open Roblox + attach executor

5. Run:

6. loadstring(game:HttpGet("https://gist.githubusercontent.com/Haru06-dev/832ae278b128792f78bbcd239e845531/raw/930e36c19f023f1808038816ea94720f74d62d12/Spotify%20For%20Roblox"))()


---

## ⚠️ Requirements

Your executor MUST support:
- `request` / `syn.request`
- `writefile` / `delfile`
- `getcustomasset`
- if you are unsure just execute and verify it. if the player gives an error then it dosent support your executor.
- <img width="900" height="86" alt="image" src="https://github.com/user-attachments/assets/a649d94c-1c74-44e4-9fe0-575962bc6590" />


---

## 🎮 Usage

- Click 🔍 to search  
- Enter a song or playlist  
- Enjoy full Spotify-style playback inside Roblox  

---

## ⚠️ Disclaimer

This project is for educational use only. It interacts with third-party APIs (YouTube/Icons8) to serve data locally. I assume no responsibility for how this tool is used.
