import {useState, useEffect} from 'react'
import booleanPointInPolygon from '@turf/boolean-point-in-polygon'
import * as turf from '@turf/turf'
import {outreMerToZCode, circoIdToName, abbrToParty, presidentialCandidateToParty, politicalParties} from '../data/constants'
import Toast from './Toast'
import parseCsv from '../lib/parse-csv'
import styles from './Circonscription.module.sass'

const displayPercentage = (ratio) => {
  const number = parseInt(ratio * 100 * 10) / 10;
  return `${number} %`
}

const Score = ({nom, parti, inscrits, score}) => {
  if (!(parti in politicalParties)) {
    console.error(parti, politicalParties)
  }
  const color = politicalParties[parti].color
  return (<div className='counter'>
    <div className='row'>
      <div className='name'>
        {nom}
      </div>
      <div className='stat'>
        {displayPercentage(score / inscrits)}
      </div>
    </div>
    <div className='row bar'>
      <div className='done' style={{width: `${score / inscrits * 100}%`, backgroundColor: color}}>
      </div>
    </div>
  </div>);
}


const Circonscription = ({properties, geometry}) => {
  const [loadedDepartments, setLoadedDepartments] = useState({});
  const [circoId, setCircoId] = useState();
  const [error, setError] = useState();
  const [circoIdToData, setData] = useState({})

  // Loading data at component creation
  useEffect(() => {
    if (Object.keys(circoIdToData).length > 0) {
      console.warn("Map is already initialized", circoIdToData)
      return
    }
    Promise.all([
      fetch("/assets/deputes_sortants.csv").then(data => data.text()),
      fetch("/assets/election_pres_T1.csv").then(data => data.text()),
      fetch("/assets/elu_2017.csv").then(data => data.text()),
      fetch("/assets/T1_2017.csv").then(data => data.text()),
    ]).then(([deputesSortants, scoresPresidentielles2022, elus2017, scoresLegislatives2017]) => {
      setData(circoIdToData => {
        if (Object.keys(circoIdToData).length > 0) {
          console.warn("Map is already initialized")
          return circoIdToData
        }
        parseCsv(deputesSortants).map((row, index) => {
          if (index == 0) return // header
          const id = row[0]
          if (!(id in circoIdToData)) {
            circoIdToData[id] = {}
          }
          circoIdToData[id]['depute'] = {
            'nom': row[1],
            'sigle': row[2],
            'parti': row[3],
          }
        })
        parseCsv(scoresPresidentielles2022).map((row, index) => {
          if (index == 0) return // header
          const id = row[0]
          if (!(id in circoIdToData)) {
            circoIdToData[id] = {}
          }
          if (!('scoresPresidentielles2022' in circoIdToData[id])) {
            circoIdToData[id]['scoresPresidentielles2022'] = []
          }
          circoIdToData[id]['scoresPresidentielles2022'].push({
            'nom': row[2],
            'parti': presidentialCandidateToParty[row[2]],
            'inscrits': row[1],
            'score': row[3],
          })
        })
        parseCsv(elus2017).map((row, index) => {
          if (index == 0) return // header
          const id = row[0]
          if (!(id in circoIdToData)) {
            circoIdToData[id] = {}
          }
          circoIdToData[id]['elus2017'] = {
            'nom': row[1],
            'sigle': row[2],
            'inscrits': row[3]
          }
        })
        parseCsv(scoresLegislatives2017).map((row, index) => {
          if (index == 0) return // header
          const id = row[0]
          if (!(id in circoIdToData)) {
            circoIdToData[id] = {}
          }
          if (!('scoresLegislatives2017' in circoIdToData[id])) {
            circoIdToData[id]['scoresLegislatives2017'] = []
          }
          circoIdToData[id]['scoresLegislatives2017'].push({
            'nom': row[2],
            'parti': abbrToParty[row[3]],
            'inscrits': row[1],
            'score': row[4],
          })
        })

        return circoIdToData
      })
    })
  })


  const loadCirco = (department) => {
    const point = geometry.coordinates
    const candidates = department.filter(
      circoFeature => {
        const circoPolygon = turf.polygon(circoFeature.geometry.coordinates)
        return booleanPointInPolygon(point, circoPolygon)
      }
    );
    if (candidates.length !== 1) {
      throw "Can't find exact circo"
    }
    setCircoId(candidates[0].properties['id_circo'])
  }

  useEffect(() => {
    // hide old circo
    setCircoId(undefined)

    if (properties === undefined) {
      return
    }

    const {context} = properties;
    const departmentId = context.split(',')[0]
    if (departmentId in outreMerToZCode) {
      departmentId = outreMerToZCode[departmentId]
    }

    if (!(departmentId in loadedDepartments)) {
      // load department 
      fetch(`/assets/circo_dep/dep${departmentId}.json`)
        .then((data) => data.json())
        .then(data => {
          setLoadedDepartments(departments => {
            departments[departmentId] = data
            loadCirco(data)
            return departments
          })
        }
        )
        .catch((error) => {
          setError(error)
        })
    } else {
      loadCirco(loadedDepartments[departmentId])
    }
  }, [properties, loadedDepartments])

  if (circoId === undefined) {
    return <Toast message={error} success={false} visible={error && error != ""} />
  }

  const name = circoIdToName[circoId]
  const data = circoIdToData[circoId]
  data.scoresLegislatives2017.sort((a, b) => -parseInt(a.score) + parseInt(b.score))
  data.scoresPresidentielles2022.sort((a, b) => -parseInt(a.score) + parseInt(b.score))
  console.log(data.scoresLegislatives2017)

  return (
    <>
      <Toast message={error} success={false} visible={error && error != ""} />
      <div className={styles.summary} >
        <h3 className="ui header">{name}</h3>
        <div className="ui stackable three column wide grid">
          <div className="ui column">
            <h4 className="ui header">Inscrits</h4>
            {data.elus2017.inscrits}
          </div>
          <div className="ui column">
            <h4 className="ui header">Député sortant</h4>
            {data.depute.nom}
          </div>
          <div className="ui column">
            <h4 className="ui header">Parti politique</h4>
            {data.depute.sigle}
          </div>
        </div>
        <div className='ui fluid button'>
          Soutenir la candidature NUPES
        </div>
      </div>
      <div className={styles.summary} >
        <h3 className="ui header">Résultats aux élections précédentes (premier tour)</h3>
        <div className="ui stackable two column wide grid">
          <div className="ui column">
            <h3 className="ui header">Législatives 2017</h3>
            {data.scoresLegislatives2017.map((item, index) => <Score {...item} key={index} />)}
          </div>
          <div className="ui column">
            <h3 className="ui header">Présidentielles 2022</h3>
            {data.scoresPresidentielles2022.map((item, index) => <Score {...item} key={index} />)}
          </div>
        </div>
      </div>
    </>
  )
};
export default Circonscription
