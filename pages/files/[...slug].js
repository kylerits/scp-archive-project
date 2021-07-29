import Head from 'next/head';
import Link from 'next/link';
import {useState, useEffect} from 'react';

// API Request
import {getFile} from '../../lib/api'

const File = ({file}) => {
  const [error, setError] = useState(false);

  console.log(file);

  // useEffect(() => {
  //   if(file.error) {
  //     setError(true);
  //   }
  // }, []);
  // if (error) return (
  //   <></>
  // );

  return (
    <>
      <Head>
        <title>{file.title}</title>
      </Head>
      <section>
        <div className="w-screen h-[400px] overflow-y-scroll flex items-center justify-center">
          <div className="w-full max-w-5xl text-center">
            <h1 className="mb-5 text-xl"><span className="uppercase">{file.title}</span></h1>
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
    props: { file }
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  }
}