const puppeteer = require('puppeteer')

export const getFile = async (slug) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  
  await page.goto('https://scp-wiki.wikidot.com/'+slug)

  // Get the 'viewport' of the page
  try {
    const pageInfo = await page.evaluate(() => {
      return {
        title: document.title
      };
    });

    await browser.close();
    return pageInfo;
    
  } catch (error) {
    return {error: error.message};
  }

}

export const getSeriesList = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://scp-wiki.wikidot.com/')

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

  if(slug == 'scp-series-6' || slug == 'scp-series-7') {
    await page.goto('https://scp-wiki.wikidot.com/'+slug+'/noredirect/true')
  } else {
    await page.goto('https://scp-wiki.wikidot.com/'+slug)
  }

  try {
    // Get the 'viewport' of the page
    const pageInfo = await page.evaluate(() => {
      const scpSelector = document.querySelectorAll('[id^="toc"] + ul > li');
      let scpNodes = [];
      if(scpSelector.length > 0) {
        scpNodes = [...scpSelector].map(n => {
          const title = n.textContent
          const slug = n.querySelector('a') ? n.querySelector('a').href.split('/')[3]: ''
          return {
            title: title,
            slug: slug
          }
        }).filter(n => n.slug != '' && n.title.includes('SCP-'));
      }
    
      // console.log(scpNodes)
      return {
        title: document.title,
        items: scpNodes,
      };
    });

    await browser.close();
    return pageInfo;
  } catch (error) {
    return {error: error.message};
  }


}