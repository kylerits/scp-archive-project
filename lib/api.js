const puppeteer = require('puppeteer')

export const getScp = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://www.scpwiki.com/')

  // Get the 'viewport' of the page
  const pageInfo = await page.evaluate(() => {
		return {
			title: document.title
		};
	});

	await browser.close();
	return pageInfo;
}

export const getSeriesList = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://www.scpwiki.com/')

  // Get the 'viewport' of the page
  const pageInfo = await page.evaluate(() => {
    const seriesNodes = [...document.querySelectorAll('.side-block .menu-item a[href^="/scp-series"]')].map(n => {
      return {
        text: n.textContent,
        href: n.getAttribute('href').split('/')[1]
      }
    })
		return {
      series: seriesNodes.filter(n => !n.href.includes('tales')),
      tales: seriesNodes.filter(n => n.href.includes('tales'))
		};
	});

	await browser.close();
	return pageInfo;
}

export const getSeriesData = async (slug) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('http://www.scpwiki.com/'+slug)

  // Get the 'viewport' of the page
  const pageInfo = await page.evaluate(() => {
    const scpNodes = [...document.querySelectorAll('[id^="toc"] + ul > li')].map(n => {
      const title = n.textContent
      const slug = n.querySelector('a').href.split('/')[3]
      return {
        title: title,
        slug: slug
      }
    })
  
    // console.log(scpNodes)
		return {
			title: document.title,
      items: scpNodes,
		};
	});

	await browser.close();
	return pageInfo;
}