import {useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import AutoComplete from '../components/Autocomplete'
import Circonscription from '../components/Circonscription'
import styles from '../styles/Home.module.css'


const searchApi = async (query) => {
  console.log(query)
  try {
    let encodedQuery = encodeURI(query)

    const source = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodedQuery}&limit=10&autocomplete=0`);
    // Data is array of `Objects` | `Strings`
    const data = await source.json();

    const dataEntries = data.features.map((item) => ({
      'label': item.properties.label,
      'properties': item.properties,
      'geometry': item.geometry
    })
    );

    console.log(dataEntries)
    return {"results": dataEntries}
  } catch (error) {

    return {'error': error};
  }
}


export default function Home() {
  const [circo, setCirco] = useState()
  return (
    <div className={styles.container}>
      <Head>
        <title>Gagnons l&apos;Assemblée</title>
        <meta name="description" content="Page de soutien des candidats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Gagnons l&apos;Assemblée !
        </h1>

        <div id="recherche_circo">Rechercher une circonscription en tapant une adresse postale.</div>
        <AutoComplete getSuggestions={searchApi} onEnter={(circo) => setCirco(circo)} />
        <Circonscription {...circo} />
      </main >

      <footer className={styles.footer}></footer>
    </div >
  )
}
