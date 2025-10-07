# Google Search Console & SEO Setup Guide
## Custom Website Development Services

## 🚀 Quick Setup Steps

### 1. Google Search Console Setup

#### Step 1: Create Google Search Console Account
1. Go to [Google Search Console](https://search.google.com/search-console/)
2. Sign in with your Google account
3. Click "Add Property"
4. Choose "URL prefix" and enter your website URL (e.g., `https://yourdomain.com`)

#### Step 2: Verify Your Website
Choose one of these verification methods:

**Method 1: HTML Meta Tag (Recommended)**
1. Copy the verification meta tag from Google Search Console
2. Replace `'your-google-verification-code'` in `src/app/layout.tsx` line 49 with your actual verification code
3. Deploy your website
4. Click "Verify" in Google Search Console

**Method 2: HTML File Upload**
1. Download the HTML verification file from Google Search Console
2. Upload it to your `public/` directory
3. Deploy your website
4. Click "Verify" in Google Search Console

**Method 3: Google Analytics**
1. If you have Google Analytics set up, you can verify through that
2. Make sure the same Google account has access to both services

### 2. Google Analytics Setup

#### Step 1: Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (format: G-XXXXXXXXXX)

#### Step 2: Add to Your Website
1. Replace `GA_MEASUREMENT_ID` in `src/app/layout.tsx` line 76 with your actual GA4 Measurement ID
2. Deploy your website

### 3. Domain Configuration ✅ COMPLETED

**Your domain is now configured:** `https://www.theanta.com`

✅ Updated in `src/app/layout.tsx` line 31
✅ Updated in `src/app/sitemap.ts` line 4  
✅ Updated in `src/app/robots.ts` line 4

### 4. SEO Optimizations Already Added

✅ **Meta Tags**: Enhanced title, description, keywords, Open Graph, Twitter Cards
✅ **Sitemap**: Automatic sitemap generation at `/sitemap.xml`
✅ **Robots.txt**: Proper crawling instructions at `/robots.txt`
✅ **Performance Monitoring**: Core Web Vitals tracking
✅ **Structured Data**: Ready for schema markup
✅ **Service Pages**: Dedicated pages for web development services
✅ **Keyword Optimization**: Targeted keywords for custom website development
✅ **Internal Linking**: Strategic links between service pages

### 5. Performance Monitoring Features

The setup includes:
- **Core Web Vitals Tracking**: LCP, FID, CLS monitoring
- **Google Analytics**: User behavior and traffic analysis
- **Console Logging**: Performance metrics logged to browser console

### 6. Next Steps After Setup

#### In Google Search Console:
1. **Submit Sitemap**: Go to Sitemaps section and submit `/sitemap.xml`
2. **Check Coverage**: Monitor which pages are indexed
3. **Performance Tab**: View search performance data (takes 2-3 days to populate)
4. **Core Web Vitals**: Monitor page experience metrics

#### In Google Analytics:
1. **Real-time Reports**: Check if data is flowing
2. **Audience Reports**: Understand your visitors
3. **Behavior Reports**: See how users interact with your site
4. **Conversion Tracking**: Set up goals if needed

### 7. New Service Pages Added

**Custom Website Development Pages:**
- `/services/web-development` - Professional web development services
- `/services/custom-websites` - Website builder service according to requirements

**SEO Benefits:**
- Targeted keywords for "custom website development"
- Long-tail keywords like "build website according to requirements"
- Dedicated landing pages for specific services
- Internal linking between related services
- Rich content with examples and process explanations

### 8. SEO Checklist

- [x] Update domain URLs in all files ✅
- [ ] Add Google Search Console verification code
- [ ] Add Google Analytics Measurement ID
- [ ] Submit sitemap to Google Search Console
- [ ] Test website on mobile devices
- [ ] Check page loading speed
- [ ] Verify all images have alt text
- [ ] Ensure proper heading structure (H1, H2, H3)
- [ ] Add internal links between pages
- [ ] Create quality content regularly
- [ ] Monitor rankings for "custom website development" keywords
- [ ] Track conversions from new service pages

### 9. Monitoring & Maintenance

#### Weekly:
- Check Google Search Console for errors
- Review Core Web Vitals reports
- Monitor search performance

#### Monthly:
- Update sitemap if you add new pages
- Review and update meta descriptions
- Check for broken links
- Analyze user behavior in Google Analytics

### 10. Troubleshooting

**Verification Issues:**
- Ensure the verification code is correctly placed
- Clear browser cache and try again
- Check if your website is accessible publicly

**Analytics Not Working:**
- Verify the Measurement ID is correct
- Check browser console for errors
- Ensure ad blockers aren't blocking the script

**SEO Issues:**
- Use Google's Rich Results Test tool
- Check mobile-friendliness with Google's Mobile-Friendly Test
- Validate your HTML markup

### 11. Additional Tools

Consider adding these for comprehensive SEO:
- **Google Tag Manager**: For advanced tracking
- **Schema Markup**: For rich snippets
- **PageSpeed Insights**: For performance optimization
- **Lighthouse**: For comprehensive audits

---

## 📊 Expected Timeline

- **Immediate**: Google Analytics starts collecting data
- **24-48 hours**: Google Search Console verification completes
- **2-3 days**: Search performance data appears
- **1-2 weeks**: Core Web Vitals data becomes reliable
- **4-6 weeks**: Full SEO impact visible in search rankings

---

**Need Help?** Check the official documentation:
- [Google Search Console Help](https://support.google.com/webmasters/)
- [Google Analytics Help](https://support.google.com/analytics/)
- [Next.js SEO Documentation](https://nextjs.org/learn/seo/introduction-to-seo)
