const puppeteer = require('puppeteer');
const fs = require('fs');

const getFile = async (slug) => {
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
      const containmentStartIndex = pTags.findIndex(n => n.textContent.includes('Special Containment Procedures:'))
      const descriptionStartIndex = pTags.findIndex(n => n.textContent.includes('Description:'))


      const containment = pTags[containmentStartIndex].textContent.replace('Special Containment Procedures: ', '')
      const description = pTags[descriptionStartIndex].textContent.replace('Description: ', '')
      

      return {
        item: document.getElementById('page-title').innerText,
        class: pTags.filter(p => p.innerText.includes('Object Class')).length > 0 ? pTags.filter(p => p.innerText.includes('Object Class'))[0].innerText.replace('Object Class: ', '') : '',
        image: [...document.querySelectorAll('#page-content .scp-image-block .image')].length > 0 ? [...document.querySelectorAll('#page-content .scp-image-block .image')][0].src : null,
        imageDesc: [...document.querySelectorAll('#page-content .scp-image-block p')].length > 0 ? [...document.querySelectorAll('#page-content .scp-image-block p')][0].innerText : null,
        warning: [...document.querySelectorAll('#page-content h1#toc0')].length > 0 ? [...document.querySelectorAll('#page-content h1#toc0')][0].innerText : null,
        rating: [...document.querySelectorAll('#page-content .rate-points .number')].length > 0 ? [...document.querySelectorAll('#page-content .rate-points .number')][0].innerText : null,
        containment: containment,
        description: description,
      };
    });

    await browser.close();
    return pageInfo;
    
  } catch (error) {
    return {error: error.message};
  }

}


const getSeriesList = async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  process.on('unhandledRejection', (reason, p) => {
    console.error('Unhandled Rejection at: Promise', p, 'reason:', reason);
    browser.close();
  });
  
  await page.goto('https://scp-wiki.wikidot.com/');

  // Get the 'viewport' of the page
  const pageInfo = await page.evaluate(() => {
    const seriesNodes = [...document.querySelectorAll('.side-block .menu-item a[href^="/scp-series"]')].map(n => {
      return {
        title: n.textContent,
        slug: n.getAttribute('href').split('/')[1]
      }
    })
		return {
      series: seriesNodes.filter(n => !n.slug.includes('tales')),
      tales: seriesNodes.filter(n => n.slug.includes('tales'))
		};
	});

	await browser.close();
	return pageInfo;
};

const getSeriesData = async (slug) => {
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
          const title = n.textContent;
          const slug = n.querySelector('a') ? n.querySelector('a').href.split('/')[3]: '';
          return {
            title: title,
            slug: slug
          }
        }).filter(n => n.slug != '' && n.title.includes('SCP-'));
      }
    
      // console.log(scpNodes)
      return scpNodes;
    });

    await browser.close();
    return pageInfo;
  } catch (error) {
    return {error: error.message};
  }

}

const getSingleFile = async (seriesInfo) => {
  if (seriesInfo.slug.length > 0) {
    const file = await getFile(seriesInfo.slug);
    seriesInfo['title'] = seriesInfo['title'].replace(`${file['item']} - `, '');
    const fullFile = {
      ...seriesInfo,
      ...file
    }
    return fullFile;
  }
  return seriesInfo;
}

const main = async () => {
  // const seriesList = await getSeriesList();

  // const seriesJson = JSON.stringify(seriesList.series);
  // const talesJson = JSON.stringify(seriesList.tales);

  // const testFile = await getFile('scp-002');
  const filesTest = await getSeriesData('scp-series-3');
  const file = await getSingleFile(filesTest[15]);
  // const allSeriesData = await Promise.all(seriesList.series.map(async (series) => {
  //   const seriesData = await getSeriesData(series.slug);
  //   console.log(seriesData);
  //   return {
  //     title: series.title,
  //     slug: series.slug,
  //     data: seriesData
  //   };
  // }));

  
  // Write to JSON files
  // fs.writeFile(__dirname+'/../api/series.json', seriesJson, err => {
  //   if (err) throw err;
  //   console.log('Series Saved');
  // });
  // fs.writeFile(__dirname+'/../api/tales.json', talesJson, err => {
  //   if (err) throw err;
  //   console.log('Tales Saved');
  // });
  // filesTest[0]['class'] = 'test'
  console.log(file);
};

main().then((value) => {});