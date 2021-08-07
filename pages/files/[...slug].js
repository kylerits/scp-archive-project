import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';

import series from '../../api/series.json';
import tales from '../../api/tales.json';
import fullSeries from '../../api/series/full-series.json';
import Sidebar from '../../components/Sidebar';

// API Request
import {getFile} from '../../lib/api'

const File = ({series, file, fullSeries }) => {
  const [error, setError] = useState(false);

  const fileMeta = file.item ? fullSeries.filter(f => f.slug == file.item.toLowerCase())[0] : { title: 'Redacted' };
  const fileIndex = fullSeries.indexOf(fileMeta);
  const prevFile = fileIndex > 0 ? fullSeries[fileIndex - 1] : null;
  const nextFile = fileIndex < fullSeries.length - 1 ? fullSeries[fileIndex + 1] : null;
  
  useEffect(() => {
    if(file.error && !file.item && typeof fileMeta === 'undefined') {
      setError(true);
    }
  }, []);

  const title = fileMeta ? fileMeta.title.replace(file.item+' - ', '') : 'Redacted';
  const currentSeries = fileMeta ? fileMeta.series : null;

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

  // console.log(file);

  return (
    <>
      <Head>
        <title>{file.item} | {title}</title>
      </Head>
      <section>
        <div className="w-screen h-[400px] overflow-y-scroll flex items-center justify-center">
          <div className="w-full max-w-5xl p-8">
            {/* Title Grid */}
            <div className="border border-gray-50 grid grid-cols-2">
              {/* Title Cell */}
              <div className="py-2 px-3 border-b border-gray-50 col-span-2">
                <h1 className="text-xl"><span className="uppercase">{file.item}</span> <span className="opacity-80">{title}</span></h1>
              </div>
              {/* Class Cell */}
              <div className="py-2 px-3 border-r border-gray-50 col-span-1">
                <p><span className="text-sm uppercase text-gray-300">Class: </span>{file.class && file.class.length > 0 ? file.class : (<span className="text-red-400 uppercase">Redacted</span>)}</p>
              </div>
              {/* Rating Cell */}
              <div className="py-2 px-3 col-span-1">
                <p><span className="text-sm uppercase text-gray-300">Rating: </span>{file.rating ?? 'Redacted'}</p>
              </div>
              {/* Warning Cell */}
              {file.warning ? (
                <div className="col-span-2 py-2 px-3 border-t border-gray-50 text-center text-red-400">
                  {file.warning}
                </div>
              ) : null}
            </div>
            
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="container">
          <div className="relative flex justify-center">
            {/* Navigation Column */}
            <div className="relative w-full max-w-lg px-8 text-right">
              <div className="sticky top-[2rem]">
                <p className="pb-4">
                  [ <Link href="/">
                    <a>Root</a>
                  </Link> ]
                </p>
                {currentSeries ? (
                  <p className="pb-4">
                    [ <Link href={`/series/${currentSeries}`}>
                      <a>Current Series</a>
                    </Link> ]
                  </p>
                ) : null}
                <Sidebar series={series} tales={tales} />

                <p className="py-4">
                  <span>more files</span><br />
                  {/* Previous File */}
                  [ {prevFile ? (<><Link href={`/files/${prevFile.slug}`}><a className="uppercase">{prevFile.slug}</a></Link></>) : null}
                  {prevFile && nextFile ? (<> | </>) : null}
                  {/* Next File */}
                  {nextFile ? (<><Link href={`/files/${nextFile.slug}`}><a className="uppercase">{nextFile.slug}</a></Link></>) : null} ]
                </p>

              </div>
            </div>
            {/* Content Column */}
            <div className="w-full max-w-5xl">
              {/* Image Wrap */}
              {file.image ? (
                <div className="pb-12">
                  <div className="prose">
                    <div>
                      <h3>Visual Data:</h3>
                      <hr />
                    </div>
                  </div>
                  <div className="border border-gray-50 inline-flex flex-col max-w-[300px]">
                    <div className="w-full">
                      <Image src={file.image} alt={file.imageDesc} width="300" height="225" loading="lazy" />
                    </div>
                    <div className="border-t border-gray-50 w-full py-2 px-3">
                      <p className="text-sm">{file.imageDesc}</p>
                    </div>
                  </div>
                </div>
              ) : null}
              <div className="prose">
                {/* Containment */}
                {file.containment ? (
                  <div className="pb-8">
                    <h3>Special Containment Procedures:</h3>
                    <hr />
                    <span dangerouslySetInnerHTML={{__html: file.containment}} />
                  </div>
                ) : (
                  <div className="pb-8">
                    <h3><span className="uppercase">Containment Redacted</span></h3>
                  </div>
                )} 
                {/* Description */}
                {file.description ? (
                  <div className="pb-8">
                    <h3>Description:</h3>
                    <hr />
                    <span dangerouslySetInnerHTML={{__html: file.description}} />
                  </div>
                ) : (
                  <div className="pb-8">
                    <h3><span className="uppercase">Description Redacted</span></h3>
                  </div>
                )} 
                {/* Source */}
                {file.source ? (
                  <div className="pb-8">
                    <p><a href={file.source} target="_blank" rel="noreferrer">View Source</a></p>
                  </div>
                ) : null}
              </div>
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
    props: { series, tales, file, fullSeries }
  }
}

export async function getStaticPaths() {
  return {
    paths: fullSeries.map(f => `/files/${f.slug}`) || [],
    fallback: true,
  }
}