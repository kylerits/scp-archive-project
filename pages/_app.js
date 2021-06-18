import '../styles/globals.css'
import Default from '../layouts/default'

function MyApp({ Component, pageProps }) {
  return (
    <Default>
      <Component {...pageProps} />
    </Default>
  )
}

export default MyApp
