# Custom Roblox Audio Player 🎵
*A seamless, localized Spotify-clone exclusively for Roblox Executors.*

Tired of Roblox's audio moderation system blocking every song you upload? Want to instantly listen to any YouTube song, album, or playlist directly inside your favorite Roblox games without opening a browser? 

This project uses a custom Node.js backend to bypass Roblox's network limitations, scraping YouTube MP3s and Album Art directly to your PC, and natively mounting them into the Roblox engine using Executor APIs!

## Features
- 🔍 **Instant Search Engine**: Type any song name (e.g., "The Weeknd Starboy") and hit enter.
- 🖼️ **Dynamic Album Art**: Automatically extracts and displays the high-quality YouTube thumbnail!
- 🔀 **Full Playback Controls**: Pause, Play, Skip, Previous, Shuffle, and Playlist/Song Looping modes.
- ⚡ **Anti-Lag Debouncing**: Mashing the "Next" button limits network requests so your game never freezes.
- 🔊 **Bass Boost**: Apply a custom EQ filter to any song instantly.
- 🗂️ **Playlist Support**: Paste a full YouTube Playlist URL directly into the search bar to load the entire mix.
- 🗑️ **Auto-Cleanup**: Automatically deletes old MP3s and images from your hard drive to save space.

## Installation 🛠️

Because Roblox games are sandboxed, you must run a tiny "Middleman Server" on your own computer to handle the heavy lifting (YouTube Scrapers, FFmpeg Audio Conversions, etc.).

1. **Download Node.js**: If you don't already have it, download and install the LTS version of [Node.js](https://nodejs.org).
2. **Install Libraries**: Double-click `1_Install_Server.bat`. It will automatically download the required dependencies (yt-search, express, fluent-ffmpeg, etc.).
3. **Start the Server**: Double-click `2_Start_Server.bat`. **Leave this black window open while you play Roblox!**

## How to Play 🎮

1. Open Roblox and attach your favorite Executor.
2. Ensure your executor supports the following required functions:
   - `request` (or `syn.request`, `http.request`)
   - `writefile` and `delfile`
   - `getcustomasset` (Crucial for bypassing Roblox Audio Moderation!)
3. Copy the entire contents of `Client/CustomAudioPlayer.lua`.
4. Run the script! A sleek glassmorphism UI will appear at the bottom of your screen.

## Disclaimer
This project is for educational use only. It interacts with third-party APIs (YouTube/Icons8) to serve data locally. The developer assumes no responsibility for how this tool is used.
