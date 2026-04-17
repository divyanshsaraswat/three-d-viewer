You: 

![Uploaded image](https://chatgpt.com/backend-api/estuary/content?id=file_000000002de87208b80ddce44658212d&ts=493334&p=fs&cid=1&sig=97ea2af9bd6e35b85eb5274929a0170808a6c2ffb524111eb6b3b05063af33b2&v=0)

So as you can see google has indexed my website weinix, but I want it shows me the pages here too right just like many other websites

ChatGPT: 

Yeah, you’re noticing the right thing — your site is indexed, but Google is only showing the **main page**, not the **sitelinks (subpages)** like you see for bigger sites.

Let’s break this down properly 👇

---

## 🧠 Why your subpages aren’t showing yet

Google only shows those extra links (called **sitelinks**) when it’s confident about:

1.  **Site structure clarity**
    
2.  **Authority / trust of the domain**
    
3.  **User behavior signals**
    
4.  **Internal linking strength**
    

Right now, your site likely:

-   Is **new or low authority**
    
-   Doesn’t have **strong internal linking signals**
    
-   Google hasn’t fully understood your **page hierarchy**
    

---

## 🚀 What you need to do (this is the real game)

### 1\. Create a clear site structure

Make sure your pages are logically organized:

```
/ (Home)  
  /about  
  /products  
  /materials  
  /contact
```

👉 Avoid random routes like `/page1`, `/temp`, etc.

---

### 2\. Strong internal linking (VERY IMPORTANT)

On your homepage, explicitly link to your main pages:

-   Navbar links
    
-   Footer links
    
-   Contextual links in content
    

Example:

> “Explore our **materials** → /materials”

Google uses this to decide sitelinks.

---

### 3\. Submit a sitemap

Create and submit:

```
/sitemap.xml
```

Then go to:  
👉 Google Search Console → Indexing → Sitemaps

---

### 4\. Use proper `<title>` and `<h1>`

Each page must have:

-   Unique `<title>`
    
-   Clear `<h1>`
    

Example:

```
Title: Sustainable Textile Materials | Weinix  
H1: Circular Textile-Based Building Materials
```

---

### 5\. Add structured data (optional but powerful)

Use schema like:

```
JSON

{  
  "@context": "https://schema.org",  
  "@type": "Organization",  
  "name": "Weinix",  
  "url": "https://weinix.com"  
}
```

---

### 6\. Get some backlinks

Even 3–5 quality links help:

-   Indie Hackers
    
-   Product Hunt
    
-   LinkedIn posts
    
-   Your GitHub README
    

---

### 7\. Wait (this part sucks but matters)

Sitelinks are **not manual** — Google decides.

⏳ Usually takes:

-   Few weeks → small sites
    
-   Faster if traffic + backlinks exist
    

---

## ⚡ Pro tip (what most people miss)

Google shows sitelinks when:

> Users repeatedly search your brand (like “weinix materials”, “weinix products”)

So:

-   Share your site
    
-   Get people searching **“weinix + something”**
    

---

## 🧩 Quick checklist

-    Sitemap submitted
    
-    Clean URLs
    
-    Navbar links to all pages
    
-    Unique titles + H1
    
-    Internal linking done
    
-    Some backlinks
    

