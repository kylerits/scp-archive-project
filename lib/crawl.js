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
      const addendumStartIndex = pTags.findIndex(n => n.textContent.includes('Addendum:'))


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
      return {
        title: document.title,
        items: scpNodes
      };
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
  const seriesList = await getSeriesList();
  
  // Write to JSON files
  fs.writeFile(__dirname+'/../api/series.json', JSON.stringify(seriesList.series), err => {
    if (err) throw err;
    console.log('Series Saved');
  });
  fs.writeFile(__dirname+'/../api/tales.json', JSON.stringify(seriesList.tales), err => {
    if (err) throw err;
    console.log('Tales Saved');
  });

  // Write each series list to JSON
  let fullSeriesList = [];
  for (let series of seriesList.series) {
    let seriesData = await getSeriesData(series.slug);
    
    // console.log(series.title, seriesData);
    fs.writeFile('api/series/'+series.slug+'.json', JSON.stringify(seriesData), err => {
      if (err) throw err;
      console.log('Series Dir ' + series.title + ' Saved');
    });

    // fullSeriesList.concat(seriesData.items.map(item => {
    //   item['series'] = series.slug;
    //   return item;
    // }));
    fullSeriesList = [...fullSeriesList, ...seriesData.items.map(item => {
      item['series'] = series.slug;
      return item;
    })]
  }

  fs.writeFile('api/series/full-series.json', JSON.stringify(fullSeriesList), err => {
    if (err) throw err;
    console.log('Full Series Saved');
  });

  // Write each tale to json

};

main().then((value) => {});