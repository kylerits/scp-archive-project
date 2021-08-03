import Head from 'next/head';
import Link from 'next/link';
import {useState, useEffect} from 'react';

import series from '../../api/series.json';
import fullSeries from '../../api/series/full-series.json';

// API Request
import {getFile} from '../../lib/api'

const File = ({series, file, fullSeries }) => {
  const [error, setError] = useState(false);
  const [fileMeta, setFileMeta] = useState(fullSeries.filter(f => f.slug == file.item.toLowerCase())[0] || {});

  const title = fileMeta.title.replace(file.item+' - ', '');

  // useEffect(() => {
  //   if(!file || file.error) {
  //     setError(true);
  //   }
  // }, []);
  // if (error) return (
  //   <></>
  // );

  return (
    <>
      <Head>
        <title>{file.item} | {title}</title>
      </Head>
      <section>
        <div className="w-screen h-[400px] overflow-y-scroll flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">{file.item}</span></h1>
            <h3 className="mb-5">{title}</h3>
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

export default File;

export async function getStaticProps({ params }) {

  const file = await getFile(params.slug)
  return {
    props: { series, file, fullSeries }
  }
}

export async function getStaticPaths() {
  return {
    paths: fullSeries.map(f => `/files/${f.slug}`) || [],
    fallback: true,
  }
}