// pages/sitemap.xml.tsx
export const getServerSideProps = async ({ res }: any) => {
    const FORMATS = ['jpg', 'png', 'webp', 'gif', 'avif', 'jpeg'];
    const baseUrl = 'https://imageformatx.com';

    const staticPages = [`${baseUrl}/`];
    const dynamicRoutes: string[] = [];

    for (const from of FORMATS) {
        for (const to of FORMATS) {
        if (from !== to) {
            dynamicRoutes.push(`${baseUrl}/${from}-to-${to}`);
        }
        }
    }

    const allUrls = [...staticPages, ...dynamicRoutes];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${allUrls
    .map(
        (url) => `
    <url>
        <loc>${url}</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>`
    )
    .join('')}
    </urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.write(sitemap);
    res.end();

    return {
        props: {},
    };
    };

    export default function Sitemap() {
    return null;
}
