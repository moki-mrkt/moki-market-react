import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import axios from 'axios';
import { URLS } from '../constants/urls.js';
import { CATEGORY_CONFIG } from '../constants/categories.js';

const BASE_URL = 'https://moki.com.ua';

async function generate() {
    const smStream = new SitemapStream({ hostname: BASE_URL });
    const writeStream = createWriteStream('./public/sitemap.xml');

    smStream.pipe(writeStream);

    smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
    smStream.write({ url: '/catalog', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/promotions', changefreq: 'weekly', priority: 0.8 });
    smStream.write({ url: '/info/about', changefreq: 'monthly', priority: 0.4 });
    smStream.write({ url: '/info/reviews', changefreq: 'monthly', priority: 0.4 });
    smStream.write({ url: '/info/payment', changefreq: 'monthly', priority: 0.4 });
    smStream.write({ url: '/info/return', changefreq: 'monthly', priority: 0.4 });
    smStream.write({ url: '/info/contacts', changefreq: 'monthly', priority: 0.4 });
    smStream.write({ url: '/info/terms', changefreq: 'monthly', priority: 0.4 });

    const categorySlugs = Object.keys(CATEGORY_CONFIG);
    categorySlugs.forEach(slug => {
        smStream.write({ url: `/catalog/${slug}`, changefreq: 'weekly', priority: 0.7 });
    });

    let currentPage = 0;
    let totalPages = 1;

    try {
        while (currentPage < totalPages) {
            const response = await axios.get(`${URLS.backend_api}/products/public/sitemap`, {
                params: { page: currentPage, size: 100 }
            });

            const { content, page } = response.data;
            totalPages = page.totalPages;

            content.forEach(product => {
                smStream.write({
                    url: `/products/${product.slug}`,
                    changefreq: 'weekly',
                    priority: 0.9
                });
            });

            console.log(`Оброблено сторінку ${currentPage + 1} з ${totalPages}`);
            currentPage++;
        }
    } catch (error) {
        console.error('Помилка завантаження товарів:', error.message);
    }

    smStream.end();
    await streamToPromise(smStream);
}

generate();

