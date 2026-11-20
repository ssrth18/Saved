SAVED - install as an app
=========================

FILES (keep these exact names, and keep the icons folder)
  saved.html            the app
  saved-sw.js           makes it work offline and keeps it installable
  saved.webmanifest     name, colours and icons for "Install app"
  index.html            opens saved.html when someone visits the bare address
  icons/                saved-192.png, saved-512.png, saved-512-maskable.png, saved-apple.png
  supabase.sql          optional: database for syncing across devices
  SETUP-SUPABASE.txt    optional: how to turn sync on
  .nojekyll             tells GitHub Pages to serve the files as they are

PUBLISH ON GITHUB PAGES (works from a phone browser)
  1. Create a repository and upload all of the files above. For the icons: open (or create) the
     "icons" folder first, then Add file > Upload files and choose the four PNGs.
  2. Settings > Pages > Build and deployment > Deploy from a branch > main / (root) > Save.
  3. After a minute open  https://YOUR-NAME.github.io/YOUR-REPO/saved.html  in Chrome.
  4. Menu (3 dots) > Install app. "Saved" then also appears in the Share menu, so you can send
     links straight into it.

UPDATING
  Replace saved.html in the repo. When you are online the app loads the newest copy on the next open
  (close it fully and open it again). Only if you replace the icons or the manifest, change
  V="saved-v6" in saved-sw.js to saved-v7.

MOVING YOUR DATA
  Items live in the browser of the place you opened the app from. In the old copy: Settings > Data >
  Export backup. In the installed app: Import backup. (Or use sync, see SETUP-SUPABASE.txt.)

VIDEOS
  YouTube and Instagram previews are embedded players. If one will not play inside the app, the card
  shows a link that opens it in YouTube or Instagram. Tapping the card icon always opens the original.

PRIVATE THINGS - never put these in the repository
  Your sync code, the Supabase service_role / secret key, or any password. The Project URL and the
  publishable (anon) key are safe to publish.
