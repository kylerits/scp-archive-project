import Head from 'next/head'
import Link from 'next/link'
// import {getSeriesList} from '../lib/api'
// import {series} from '../api/series.js';
import series from '../api/series.json'
import tales from '../api/tales.json'

export default function Home({series, tales}) {
  // const series = seriesList.series;
  // const tales = seriesList.tales;
  // console.log(series);
  
  return (
    <>
      {/* Head of Page */}
      <Head>
        <title>Home Page</title>
      </Head>
      {/* Body of Page */}
      <section>
        <div className="w-screen h-screen overflow-hidden flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">SCP Foundation</span><br/> [Project::Repository]</h1>
            <div className="mb-5">
              <p>SCP Archive</p>
              <ul>
                {series.map((s, index) => (
                  <li key={'series-'+index} className="inline-block mx-1">
                    <Link href={'/series/'+s.slug}>
                      <a className="inline-block p-1">{s.title}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mb-5">
              <p>Tales of SCP</p>
              <ul>
                {tales.map((s, index) => (
                  <li key={'tale-'+index} className="inline-block mx-1">
                    <a href={s.slug} className="inline-block p-1">{s.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: { series, tales }
  }
}