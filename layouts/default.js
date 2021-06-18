import Head from "next/head"

const Default = ({children}) => {
  return ( 
    <>
      <Head>
        <title>Default</title>
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap" rel="stylesheet" />
      </Head>
      <main>
        {children}
      </main>
    </>
  );
}

export default Default;
