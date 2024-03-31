const escapeHTML = require('escape-html');

function getFeatureCategoryOptions(selectedOption, isEditable) {
  return `<tr><th><input class="prop-input" type="text" value="feat_cat"/></th><td>
  <select ${
    !isEditable ? 'disabled' : ''
  } class="prop-input" id="feature-category-select">
      <option disabled ${
        !selectedOption ? 'selected' : ''
      } value> -- Select category -- </option>
    <option ${
      selectedOption === 'project_boundary' ? 'selected' : ''
    } value="project_boundary">project_boundary</option>
    <option ${
      selectedOption === 'habitat_boundary' ? 'selected' : ''
    } value="habitat_boundary">habitat_boundary</option>
    <option ${
      selectedOption === 'metric_plant_survey' ? 'selected' : ''
    } value="metric_plant_survey">metric_plant_survey</option>
    <option ${
      selectedOption === 'metric_acoustic_survey' ? 'selected' : ''
    } value="metric_acoustic_survey">metric_acoustic_survey</option>
    <option ${
      selectedOption === 'metric_invertebrate_survey' ? 'selected' : ''
    } value="metric_invertebrate_survey">metric_invertebrate_survey</option>
    <option ${
      selectedOption === 'metric_habitat_survey' ? 'selected' : ''
    } value="metric_habitat_survey">metric_habitat_survey</option>
    </select>
  </td></tr>`;
}

function getFeatureOptions(context, id, isEditable) {
  let table = '';

  const feature = context.data.get('map').features[id];
  const props = feature.properties;
  const newProperties = { plot_id: '' }; // required props

  for (const k in props) {
    if (['feat_cat'].includes(k)) continue; // Select option added separately

    const escK = escapeHTML(k);

    // users don't want to see "[object Object]"
    if (typeof props[k] === 'object') {
      newProperties[escK] = escapeHTML(JSON.stringify(props[k]));
    } else {
      newProperties[escK] = escapeHTML(props[k]);
    }
  }

  table += getFeatureCategoryOptions(props.feat_cat, isEditable);

  for (const key in newProperties) {
    table +=
      '<tr>' +
      '<th>' +
      `<input 
            class="prop-input" 
            readonly 
            type="text" 
            value="${key}"/>` +
      '</th>' +
      '<td>' +
      `<input 
            ${!isEditable ? 'readonly' : ''} 
            class="prop-input" 
            type="text" 
            value="${newProperties[key]}"/>` +
      '</td>' +
      '</tr>';
  }

  return table;
}

function addFeatureOptions(e, context, id, onCategorySelect) {
  const sel = d3.select(e.target._content);

  const isEditable = true;

  const table = getFeatureOptions(context, id, isEditable);

  sel.select('table.marker-properties tbody').html(table);

  sel.select('#feature-category-select').on('change', onCategorySelect);
}

function addRow(e) {
  const sel = d3.select(e.target._content);

  const tr = sel.select('table.marker-properties tbody').append('tr');

  tr.append('th').append('input').attr('type', 'text');

  tr.append('td').append('input').attr('type', 'text');
}

function addSimplestyleProperties(e, context, id) {
  const sel = d3.select(e.target._content);

  // hide the button
  sel.selectAll('.add-simplestyle-properties-button').style('display', 'none');

  const data = context.data.get('map');
  const feature = data.features[id];
  const { properties, geometry } = feature;

  if (geometry.type === 'Point' || geometry.type === 'MultiPoint') {
    if (!('marker-color' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'marker-color');
      tr.append('td')
        .append('input')
        .attr('type', 'color')
        .attr('value', '#7E7E7E');
    }

    if (!('marker-size' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'marker-size');
      const td = tr.append('td');
      td.append('input')
        .attr('type', 'text')
        .attr('value', 'medium')
        .attr('list', 'marker-size');
      const datalist = td.append('datalist').attr('id', 'marker-size');
      datalist.append('option').attr('value', 'small');
      datalist.append('option').attr('value', 'medium');
      datalist.append('option').attr('value', 'large');
    }

    if (!('marker-symbol' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'marker-symbol');
      const td = tr.append('td');
      td.append('input')
        .attr('type', 'text')
        .attr('value', 'circle')
        .attr('list', 'marker-symbol');
      const datalist = td.append('datalist').attr('id', 'marker-symbol');
      for (let i = 0; i < makiNames.length; i++) {
        datalist.append('option').attr('value', makiNames[i]);
      }
    }
  }
  if (
    geometry.type === 'LineString' ||
    geometry.type === 'MultiLineString' ||
    geometry.type === 'Polygon' ||
    geometry.type === 'MultiPolygon'
  ) {
    if (!('stroke' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'stroke');
      tr.append('td')
        .append('input')
        .attr('type', 'color')
        .attr('value', '#555555');
    }
    if (!('stroke-width' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'stroke-width');
      tr.append('td')
        .append('input')
        .attr('type', 'number')
        .attr('min', '0')
        .attr('step', '0.1')
        .attr('value', '2');
    }
    if (!('stroke-opacity' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'stroke-opacity');
      tr.append('td')
        .append('input')
        .attr('type', 'number')
        .attr('min', '0')
        .attr('max', '1')
        .attr('step', '0.1')
        .attr('value', '1');
    }
  }
  if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
    if (!('fill' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'fill');
      tr.append('td')
        .append('input')
        .attr('type', 'color')
        .attr('value', '#555555');
    }
    if (!('fill-opacity' in properties)) {
      const tr = sel.select('table.marker-properties tbody').insert('tr');
      tr.append('th')
        .append('input')
        .attr('type', 'text')
        .attr('value', 'fill-opacity');
      tr.append('td')
        .append('input')
        .attr('type', 'number')
        .attr('min', '0')
        .attr('max', '1')
        .attr('step', '0.1')
        .attr('value', '0.5');
    }
  }
}

module.exports = {
  getFeatureOptions,
  getFeatureCategoryOptions,
  addFeatureOptions,
  addRow,
  addSimplestyleProperties
};
