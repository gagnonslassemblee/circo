import Head from 'next/head'
import Image from 'next/image'
import AutoComplete from '../components/Autocomplete'
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
  return (
    <div className={styles.container}>
      <Head>
        <title>Soutenez le candidat de votre circonscription</title>
        <meta name="description" content="Page de soutien des candidats" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Gagnons l&apos;Assemblée !
        </h1>

        <div id="recherche_circo">Recherchez votre circonscription</div>
        <div id="autocomplete_container">
          <AutoComplete getSuggestions={searchApi} />
        </div>
        <h3 style={{textAlign: "center"}} id="adresse_circo"></h3>
      </main >

      <footer className={styles.footer}></footer>
    </div >
  )
}
