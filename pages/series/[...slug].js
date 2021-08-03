import Head from 'next/head'
import Link from 'next/link'
import {useState, useEffect} from 'react'
// Api Request
// import {getSeriesData} from '../../lib/api'
import series from '../../api/series.json';
import tales from '../../api/tales.json';

const Series = ({fileList, series, tales}) => {
  const [error, setError] = useState(false)

  useEffect(() => {
    if (fileList.error) {
      setError(true);
    }
  }, []);

  if (error) return (
    <>
      <Head>
        <title>404 - No Data Found</title>
      </Head>
      {/* Body of Page */}
      <section>
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">404 - No Data Found</span></h1>
            <p>
              [<Link href="/">
                <a>Return Home</a>
              </Link>]
            </p>
          </div>
        </div>
      </section>
    </>
  );
  
  return (
    <>
      {/* Head of Page */}
      <Head>
        <title>{series.title}</title>
      </Head>
      {/* Body of Page */}
      <section>
        <div className="w-screen h-[400px] overflow-y-scroll flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">{fileList.title}</span></h1>
            <p>
              [<Link href="/">
                <a>Home</a>
              </Link>]
            </p>
          </div>
        </div>
        <div className="container pb-20">
          {/* List out items */}
          <div className="scp-list-wrap relative flex justify-center">
            <div className="relative w-full max-w-lg px-8 text-right">
              <div className="sticky top-[2rem]">
                <p className="px-1">archive</p>
                <ul className="mb-4">
                  {series.map((s, index) => (
                    <li key={'series-'+index} className="inline-block mx-1">
                      <Link href={'/series/'+s.slug}>
                        <a className="inline-block p-1">{s.title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
                <p className="px-1">tales</p>
                <ul className="mb-4">
                  {tales.map((s, index) => (
                    <li key={'series-'+index} className="inline-block mx-1">
                      <Link href={'/series/'+s.slug}>
                        <a className="inline-block p-1">{s.title}</a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <ul className="relative max-w-lg">
              {fileList.items.map(item => (
                <li key={item.slug} className="mb-4">
                  <Link href={`/files/${item.slug}`}><a>{item.title}</a></Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default Series;

export async function getStaticProps({ params }) {
  // const fileList = await getSeriesData(params.slug)
  const fileList = require('../../api/series/'+params.slug+'.json');
  return {
    props: { fileList, series, tales }
  }
}

export async function getStaticPaths() {
  return {
    paths: series.map(s => `/series/${s.slug}`) || [],
    fallback: true,
  }
}