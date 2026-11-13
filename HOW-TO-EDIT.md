# How to edit your website

Everything you see on the site (text, photos, projects, awards and links) lives in **one file: `content.json`**.
You never need to touch the code files (`index.html`, `style.css`, `main.js`).

You can do all of this **in your web browser on github.com**. You don't need to install anything.

---

## 1. Change any text

1. Go to your repository on github.com (e.g. `github.com/asyqinazaley/asyqinazaley.github.io`).
2. Click **`content.json`**, then click the **pencil icon ✏️** (top right of the file).
3. Find the text you want to change and edit it **between the quotation marks**.
4. Click **Commit changes…** → **Commit changes**.
5. Wait 1–2 minutes and refresh your website. Done!

### The 3 golden rules of `content.json`
- Text always sits **inside "double quotes"**.
- Items in a list are separated by **commas**, but there's **no comma after the last item**.
- Don't delete the `{ }` or `[ ]` brackets.

If the site suddenly shows empty sections after an edit, you have probably broken one of these rules.
Paste your whole `content.json` into **https://jsonlint.com** and it will tell you which line to fix.

### Common edits
| What | Where in `content.json` |
|---|---|
| Rotating headline words | `"hero"` → `"rotating"` |
| Green badge under your photo | `"hero"` → `"badge"` |
| About me story | `"about"` → `"paragraphs"` |
| Big numbers | `"highlights"` |
| "Currently…" box | `"currently"` (edit the `"text"`, or leave `"text": ""` to hide a line) |
| Email / LinkedIn | `"site"` → `"email"`, `"linkedin"` |

---

## 2. Add a new photo

1. Go to the main page of your repository.
2. Click **Add file → Upload files**, drag your photo in, then click **Commit changes**.
   - Tip: keep photos under ~500 KB. You can shrink them for free at **https://squoosh.app** (choose WebP).
   - Use a simple file name without spaces, e.g. `aceh-school.webp`.
3. Use it in `content.json` as `"aceh-school.webp"`.

**To add it to the Gallery**, add a line inside `"gallery"`:
```json
{ "src": "aceh-school.webp", "caption": "Short caption here" },
```

---

## 3. Add a new project / programme

Copy this block and paste it inside `"projects": [ ... ]`, after another project. Remember the comma between projects.

```json
{
  "id": "new-project",
  "title": "Project name",
  "dates": "Jan 2027",
  "location": "Kuala Lumpur",
  "role": "Your role",
  "tags": ["Community"],
  "cover": "your-cover.webp",
  "summary": "One sentence shown on the card.",
  "description": "Two or three sentences shown when someone opens the card.",
  "results": ["A result", "Another result"],
  "photos": ["your-cover.webp"],
  "links": [ { "label": "Article", "url": "https://..." } ]
}
```
- **Tags** create the filter buttons automatically. Reuse existing ones (Humanitarian, International, Community, Education, Sports) or make a new one.
- If you have no links, write `"links": []`.

---

## 4. Add a document (PDF)

1. Upload the PDF to the main page of your repository (Add file → Upload files).
2. Add a preview image: take a screenshot of the first page, save it as WebP, and upload it too.
3. Add a block inside `"documents"`:
```json
{ "title": "Report title", "description": "One line", "file": "report.pdf", "thumb": "report-thumb.webp" },
```
⚠️ **Privacy:** never upload certificates or reports that show your **IC number, phone number or home address**. Cover them first.

**Updating your CV:** upload the new PDF with the **same name** (`CV_Nurasyqin_Azaley.pdf`). GitHub will replace the old one, and every "Download CV" button updates automatically.

---

## 5. Add a testimonial

Inside `"testimonials": [ ]` add:
```json
{ "quote": "What they said about you.", "name": "Their name", "role": "Their title, Organisation" }
```
The Testimonials section appears automatically once there is at least one quote. Always ask the person's permission first.

---

## 6. Turn on the contact form (free, 2 minutes)

Until you do this, the form opens the visitor's email app instead.
1. Go to **https://web3forms.com**, enter your email and click **Create Access Key**.
2. Copy the key from the email you receive.
3. Paste it into `content.json` → `"site"` → `"web3formsKey": "paste-here"`.

## 7. Turn on visitor stats (free, privacy-friendly, optional)

1. Sign up at **https://www.goatcounter.com** and choose a code, e.g. `asyqin`.
2. Put that code into `"site"` → `"goatcounterCode": "asyqin"`.
3. See your visitors at `https://asyqin.goatcounter.com`.

---

## 8. Publish an update

There's nothing extra to do. **Every time you click "Commit changes", GitHub publishes the site automatically** within 1–2 minutes.
You can watch the progress in the **Actions** tab of your repository (green tick = live).

If you don't see the change, do a hard refresh (Ctrl + Shift + R on Windows, Cmd + Shift + R on Mac), or open the site in a private window.

---

## 9. Make the site findable on Google (optional)

Right now your site is **hidden from Google**: people can only open it if they have the link.
If you later want recruiters to find it by searching your name:
1. Open `index.html` → ✏️, and delete this line near the top:
   `<meta name="robots" content="noindex, nofollow">`
2. Commit changes.
3. Optional: add your site at **https://search.google.com/search-console** to speed things up.

---

## Easter egg 🥚
Click your portrait on the home page **5 times quickly**. 😉
