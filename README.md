SPL HOMES — Static Website

A fast, responsive static site for the construction company SPL HOMES. Built with plain HTML, CSS, and JS. Designed for quick deployment on Hostinger.

Structure
- `index.html` — main single-page site with sections: Hero, Services, Projects, About, Contact
- `css/style.css` — styling
- `js/main.js` — interactivity and project rendering/filtering
- `assets/img/` — logo, favicon, and project/hero images

Editing Content
- Company name, contact details, and social links: edit in `index.html` (search for Phone, Email, WhatsApp, address, and footer links)
- Projects: edit the `projects` array in `js/main.js`. Each project has:
  - `title`, `status` (`current` | `new` | `completed`), `location`, `area`, `price`, `image`
- Images: replace files in `assets/img/` with real photos. Keep the same filenames or update paths in `index.html` and `js/main.js`.

Deploying on Hostinger (Static Hosting)
1. Zip the site files (everything in this folder).
2. Log in to Hostinger → Files → File Manager.
3. Open `public_html/` and upload the zip. Extract it so that `index.html` sits directly inside `public_html/`.
4. Ensure the domain points to this hosting plan. Wait a few minutes for DNS/propagation if newly set.
5. Visit your domain. You should see the site.

Optional improvements on Hostinger
- Enable free SSL in hPanel → SSL → Activate. Force HTTPS in hPanel → Advanced → SSL → Force HTTPS.
- Set caching/headers via `.htaccess` (optional). Example to add later:
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType text/css "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png "access plus 30 days"
  ExpiresByType image/svg+xml "access plus 30 days"
</IfModule>

Contact Form
The contact form uses Formspree so it works on static hosting. Replace the `action` URL in `index.html` with your Formspree endpoint or use a `mailto:` link if preferred.

Local Preview
Just open `index.html` in your browser (double-click) or serve with a simple web server:
# Python
python -m http.server 8080

# Node
npx http-server -p 8080

License
All rights reserved © SPL HOMES. Replace images with your owned assets.

# spl-homes-hostinger
SPL HOMES
