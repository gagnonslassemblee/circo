import {useState} from 'react'
import styles from './Circonscription.module.sass'
import {outreMerToZCode} from '../data/constants'
import Toast from './Toast'
import parseCsv from '../lib/parse-csv'

const Circonscription = ({properties, geometry}) => {
  const [loadedDeparments, setLoadedDeparments] = useState({});
  const [departement, setDepartment] = useState();
  const [error, setError] = useState();
  if (properties === undefined) {
    return null;
  }

  useEffect(() => {
    Promise.all([
      fetch("/assets/deputes_sortants.csv"),
      fetch("/assets/election_pres_T1.csv"),
      fetch("/assets/elu_2017.csv"),
      fetch("/assets/T1_2017.csv"),
    ]).then((_deputesSortants, _presidentielles, _elu2017, _t12017) => {
      const circoId = {}
      parseCsv.map((row, index) => {
        if (index == 0) return // header

      })
    })
  })


  useEffect(() => {
    const {context} = properties;
    const _departement = context.split(',')[0]

    setDepartment(
    if (departement in outreMerToZCode) {
    departement = Object.keys(outreMerToZCode).includes(departement) ? outreMerToZCode[departement] : departement;

    let this_filtered_data = this_data.filter(function (d) {return d3.geoContains(d, point_geojson)});

    let this_circo = this_filtered_data[0].properties['id_circo']


    if (!(departement in loadedDeparments)) {
      fetch(`/assets/circo_dep/dep${this_dep}.json`)
        .then((data) => data.json())
        .then(data => {
          setLoadedDeparments(departements => {
            departements[departement] = data
            return departements
          })
        }
        )
        .catch((error) => {
          setError(error)
        })
    }
    return (
      <div className={styles.circonscription} >
        <Toast message={error} success={false} visible={error && error != ""} />
      </div>
    )
  };
  export default Circonscription
