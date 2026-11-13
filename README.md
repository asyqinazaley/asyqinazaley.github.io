# Nurasyqin Azaley: personal portfolio website

A fast, free, static website. Plain HTML, CSS and JavaScript: no database, no subscriptions, no backend.

- **Edit content:** see [`HOW-TO-EDIT.md`](HOW-TO-EDIT.md). Everything lives in `content.json`.
- **Hosting:** GitHub Pages (free forever).

## Folder map
```
content.json        ← ALL your text, projects, awards, links (edit this)
index.html          ← page layout (no need to edit)
404.html            ← "page not found" page
*.webp, *.jpg      ← photos
*.pdf              ← documents (+ -thumb.webp previews)
style.css, main.js ← design and behaviour (no need to edit)
```

## First-time deployment on GitHub Pages (about 10 minutes)

1. Sign in at **github.com**.
2. Click **+** (top right) → **New repository**.
   - **Repository name:** `asyqinazaley.github.io` (replace with your exact GitHub username, all lowercase).
   - Set it to **Public**. Leave everything else as it is. Click **Create repository**.
3. On the new repository page, click **uploading an existing file**.
4. Unzip `portfolio-site.zip` on your computer. Open the unzipped folder, select **everything inside it** (not the folder itself) and drag it into the browser. Wait until all files finish uploading, then click **Commit changes**.
5. Go to **Settings → Pages**. Under **Build and deployment**, choose **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**, then click **Save**.
6. Wait 1–2 minutes. Your site is live at **https://asyqinazaley.github.io** 🎉

## Visibility
The site is public: anyone with the link can open it. It is **hidden from Google**: `index.html` contains
`<meta name="robots" content="noindex, nofollow">`.
To make it searchable later, delete that line (see HOW-TO-EDIT.md, section 9).
