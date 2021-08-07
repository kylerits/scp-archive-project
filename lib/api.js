// import fullSeries from '../api/series/full-series.json';
const puppeteer = require('puppeteer');
const fullSeries = require('../api/series/full-series.json');

export const getFile = async (slug) => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    browser.close();
  });
  
  await page.goto('https://scp-wiki.wikidot.com/'+slug)

  // Get the 'viewport' of the page
  try {
    const pageInfo = await page.evaluate(() => {
      const pTags = [...document.querySelectorAll('#page-content p')];

      
      // Add Node to content
      const containmentStartIndex = pTags.findIndex(n => n.textContent.includes('Special Containment Procedures:') || n.textContent.includes('Object Storage Procedures:'));
      const descriptionStartIndex = pTags.findIndex(n => n.textContent.includes('Description:') || n.textContent.includes('Summary:'));
      const addendumStartIndex = pTags.findIndex(n => n.innerHTML.includes('<strong>Addendum'))


      // const containment = pTags[containmentStartIndex].textContent.replace('Special Containment Procedures: ', '')

      // Containment Content
      let containment = '';
      for(let i = containmentStartIndex; i < descriptionStartIndex; i++) {
        containment += `<p>${pTags[i].textContent.replace('Special Containment Procedures: ', '')}</p>`;
      }

      // const description = pTags[descriptionStartIndex].textContent.replace('Description: ', '')

      // Description Content
      let description = '';
      for(let i = descriptionStartIndex; i < addendumStartIndex; i++) {
        description += `<p>${pTags[i].textContent.replace('Description: ', '')}</p>`;
      }

      return {
        // slug: slug,
        item: document.getElementById('page-title').innerText.replace(/\s+/g, "").replace(/\n+/g, ""),
        class: pTags.filter(p => p.innerText.includes('Object Class')).length > 0 ? pTags.filter(p => p.innerText.includes('Object Class'))[0].innerText.replace('Object Class: ', '') : '',
        image: [...document.querySelectorAll('#page-content .scp-image-block .image')].length > 0 ? [...document.querySelectorAll('#page-content .scp-image-block .image')][0].src : null,
        imageDesc: [...document.querySelectorAll('#page-content .scp-image-block p')].length > 0 ? [...document.querySelectorAll('#page-content .scp-image-block p')][0].innerText : null,
        warning: [...document.querySelectorAll('#page-content h1#toc0')].length > 0 && [...document.querySelectorAll('#page-content h1#toc0')][0].innerText.includes('WARNING') ? [...document.querySelectorAll('#page-content h1#toc0')][0].innerText : null,
        rating: [...document.querySelectorAll('#page-content .rate-points .number')].length > 0 ? [...document.querySelectorAll('#page-content .rate-points .number')][0].innerText : null,
        containment: containment,
        description: description,
        source: window.location.href,
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