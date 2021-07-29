import Head from 'next/head'
import Link from 'next/link'
import {useState, useEffect} from 'react'
// Api Request
import {getSeriesList, getSeriesData} from '../../lib/api'

const Series = ({series}) => {
  const [error, setError] = useState(false)

  console.log(series)

  useEffect(() => {
    if (series.error) {
      setError(true);
      console.log(series.error);
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
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">{series.title}</span></h1>
            <p>
              [<Link href="/">
                <a>Home</a>
              </Link>]
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export default Series;

export async function getStaticProps({ params }) {
  const series = await getSeriesData(params.slug)
  return {
    props: { series }
  }
}

export async function getStaticPaths() {
  const allSeries = await getSeriesList()
  return {
    paths: allSeries.series.map(s => `/series/${s.href}`) || [],
    fallback: true,
  }
}