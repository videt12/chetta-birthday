# Birthday Tulips 🌷 - Interactive Birthday Website

A romantic, multi-screen interactive Single Page Application (SPA) birthday website built with HTML5, CSS3, and vanilla JavaScript. Ready for instant deployment on Vercel.

---

## ✨ Features & Screens

1. **Screen 1: Welcome Screen**
   - Elegant calligraphy greeting *"Happy Birthday, Baby!"*
   - Subtitle: *"Cheers to the new chapter of your life!"*
   - Floating petals and *"Continue"* button that initiates romantic background music (`song.mp3`).

2. **Screen 2: The Gift Box**
   - 3D floating and bobbing gift box with pulsing glow and twinkling sparkles.
   - Interactive opening on click/tap with celebratory confetti burst.

3. **Screen 3: Main Menu Hub**
   - *"Choose one to get started!"*
   - 3-column interactive card hub:
     - 🌷 **Flowers for you** ➔ Screen 4
     - 🎂 **A Piece of Us** ➔ Screen 5
     - 💌 **Letter just for you** ➔ Screen 6

4. **Screen 4: Flowers For You!**
   - Solid deep plum/magenta background (`#7a285b`).
   - Center bouquet starts heavily blurred and smoothly unblurs into crystal-clear focus over 2.5 seconds.
   - Continuous falling confetti and flower petals on canvas.
   - Bottom-right *"Continue"* button returning to Main Menu Hub.

5. **Screen 5: A Piece of Us in this Lifetime**
   - Two vertical Polaroid / Photobooth strips (`img1.jpg`–`img3.jpg` and `img4.jpg`–`img6.jpg`) with authentic washi tape, cute handwritten captions, and floating flower/star stickers.
   - Left side: Celebration cake with warm candle glow.
   - Bottom-centered *"Continue"* button returning to Main Menu Hub.

6. **Screen 6: Letter just for you**
   - Sleek dark maroon Spotify-style music card with progress bar and play/pause controls.
   - Heartfelt, touching letter in clean white serif typography with wax seal accent.
   - Bottom-centered *"Continue"* button returning to Main Menu Hub.

---

## 📸 Customizing Assets

You can easily customize the website by replacing any of the files in the `images/` folder and the root directory:

| File | Description |
| :--- | :--- |
| `song.mp3` | Your romantic background song (plays upon first click) |
| `images/tulips-bg.jpg` | Background image of pink tulips |
| `images/img1.jpg` – `images/img6.jpg` | 6 couple photos for the photobooth strips |
| `images/gift-box.png` | 3D gift box graphic |
| `images/single-tulip.png` | Tulip icon for hub card & Spotify album art |
| `images/cake.png` | Birthday cake graphic |
| `images/envelope.png` | Love letter envelope graphic |
| `images/bouquet.png` | Floral bouquet for the 2.5s unblur screen |

*Note: Clean SVG and canvas fallbacks are built-in, so the website will look beautiful even if any photo is temporarily missing.*

---

## 🚀 Deploying to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this folder to a GitHub repository.
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your repository and click **"Deploy"** (no build settings required as it's static HTML/CSS/JS).
