import Head from 'next/head'
import '../styles/globals.css'
import '../semantic/semantic.min.css'

function MyApp({Component, pageProps}) {
  return <>
    <Head>
      <title>Gagnons l&apos;Assemblée</title>
      <meta property="og:title" content="Gagnons l'Assemblée !" key="title" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://circo.gagnonslassemblee.fr/" />
      <meta property="og:image" content="https://circo.gagnonslassemblee.fr/opengraph.jpg" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:creator" content="@pierrelouisg" />
    </Head>
    <Component {...pageProps} />

  </>
}

export default MyApp
