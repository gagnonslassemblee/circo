/* https://github.com/peterthoeny/parse-csv-js, MIT License */

// parse CSV/TSV function
const parseCsv = (data, fieldSep = ",", newLine = "\n") => {
  fieldSep = fieldSep || ',';
  newLine = newLine || '\n';
  const nSep = '\x1D';
  const qSep = '\x1E';
  const cSep = '\x1F';
  const nSepRe = new RegExp(nSep, 'g');
  const qSepRe = new RegExp(qSep, 'g');
  const cSepRe = new RegExp(cSep, 'g');
  const fieldRe = new RegExp('(?<=(^|[' + fieldSep + '\\n]))"(|[\\s\\S]+?(?<![^"]"))"(?=($|[' + fieldSep + '\\n]))', 'g');
  const grid = [];
  data.replace(/\r/g, '').replace(/\n+$/, '').replace(fieldRe, function (match, p1, p2) {
    return p2.replace(/\n/g, nSep).replace(/""/g, qSep).replace(/,/g, cSep);
  }).split(/\n/).forEach(function (line) {
    const row = line.split(fieldSep).map(function (cell) {
      return cell.replace(nSepRe, newLine).replace(qSepRe, '"').replace(cSepRe, ',');
    });
    grid.push(row);
  });
  //console.log('- grid: ' + JSON.stringify(grid, null, ' '));
  return grid;
}

export default parseCsv
