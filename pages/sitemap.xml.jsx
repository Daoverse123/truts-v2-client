import { GetServerSideProps } from "next";
import { format } from "date-fns";
import axios from "axios";
import { el } from "date-fns/locale";

//https://u4dfjfmyjp.us-west-2.awsapprunner.com/dao/get-dao-list?limit=99999999999999

export default function Sitemap() {
  return null;
}

const getPages = async () => {
  let limit = 500;
  let daos = await axios.get(
    "https://u4dfjfmyjp.us-west-2.awsapprunner.com/dao/get-dao-list?limit=500"
  );
  let results = [...daos.data.results];
  let lastPage = daos.data.lastPage;

  let apiRequests = [];

  for (let i = 2; i <= lastPage; i++) {
    apiRequests.push(
      axios.get(
        `https://u4dfjfmyjp.us-west-2.awsapprunner.com/dao/get-dao-list?limit=${limit}?&page=${i}`
      )
    );
  }

  let data = await Promise.all(apiRequests);
  data.forEach((ele) => {
    results = [...results, ...ele.data.results];
  });
  console.log(results.length);
  return results;
};

function getSitemap(pages) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${pages
      .map((page) => {
        let date = format(new Date(), "yyyy-MM-dd");

        try {
          date = format(new Date(page.updatedAt), "yyyy-MM-dd");
        } catch (error) {}

        return `<url>
          <loc>https://truts.xyz/dao/${page.slug
            .replaceAll(" ", "_")
            .replaceAll("&", "")}</loc>
          <lastmod>${date}</lastmod>
        </url>`;
      })
      .join("")}
    </urlset>
  `;
}

export const getServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "text/xml");
  res.write(getSitemap(await getPages()));
  res.end();
  return {
    props: {},
  };
};
