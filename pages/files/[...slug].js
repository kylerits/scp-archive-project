import Head from 'next/head';
import Link from 'next/link';
import {useState, useEffect} from 'react';

import series from '../../api/series.json';
import fullSeries from '../../api/series/full-series.json';

// API Request
import {getFile} from '../../lib/api'

const File = ({series, file, fullSeries }) => {
  const [error, setError] = useState(false);
  const [fileMeta, setFileMeta] = useState(file.item ? fullSeries.filter(f => f.slug == file.item.toLowerCase())[0] : { title: 'Redacted' } || {});

  const title = fileMeta.title.replace(file.item+' - ', '');

  useEffect(() => {
    if(file.error && !file.item) {
      setError(true);
    }
  }, []);
  if (error) return (
    <></>
  );

  console.log(file);

  return (
    <>
      <Head>
        <title>{file.item} | {title}</title>
      </Head>
      <section>
        <div className="w-screen h-[400px] overflow-y-scroll flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">{file.item}</span> <span className="opacity-80">{title}</span></h1>
            <p>
              [<Link href="/">
                <a>Home</a>
              </Link>]
            </p>
          </div>
        </div>
      </section>
      <section className="py-10">
        <div className="container">
          <div className="w-full max-w-5xl">
            <div className="prose mx-auto">
              {/* Containment */}
              {file.containment.length > 0 ? (
                <div>
                  <h3>Containment:</h3>
                  <span dangerouslySetInnerHTML={{__html: file.containment}} />
                </div>
              ) : (
                <div>
                  <h3>Containment Unknown</h3>
                </div>
              )} 
              {/* Description */}
              {file.description.length > 0 ? (
                <div>
                  <h3>Description:</h3>
                  <span dangerouslySetInnerHTML={{__html: file.description}} />
                </div>
              ) : (
                <div>
                  <h3><span className="uppercase">Description Unknown</span></h3>
                </div>
              )} 
            </div>
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