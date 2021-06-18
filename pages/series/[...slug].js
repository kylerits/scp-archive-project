import Head from 'next/head'
import Link from 'next/link'
// Api Request
import {getSeriesList, getSeriesData} from '../../lib/api'

const Series = ({series}) => {

  console.log(series.items)
  
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