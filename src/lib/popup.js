const {
  addRow,
  addSimplestyleProperties,
  addLandPlotOptions,
  addProjectBoundsOptions
} = require('../ui/popover-form');
const { snakeCase } = require('lodash');
const flash = require('../ui/flash');

module.exports = function (context) {
  return function (e, id) {
    const sel = d3.select(e.target._content);

    sel.selectAll('.cancel').on('click', clickClose);

    sel.selectAll('form').on('submit', saveFeature);

    sel.selectAll('.add').on('click', () => addRow(e));

    sel
      .selectAll('.add-simplestyle-properties-button')
      .on('click', () => addSimplestyleProperties(e, context, id));

    sel.selectAll('.delete-invert').on('click', removeFeature);

    sel.select('#location-category-select').on('change', onCategorySelect);

    function onCategorySelect() {
      if (sel.select('#location-category-select')[0][0].value === 'land_plot') {
        addLandPlotOptions(e, context, id, onCategorySelect);
      } else {
        addProjectBoundsOptions(e, context, id, onCategorySelect);
      }
    }

    function clickClose() {
      e.target._onClose();
    }

    function removeFeature() {
      const data = context.data.get('map');
      data.features.splice(id, 1);

      context.data.set({ map: data }, 'popup');

      // hide the popup
      e.target._onClose();
    }

    function losslessNumber(x) {
      const fl = parseFloat(x);
      if (fl.toString() === x) return fl;
      else return x;
    }

    function saveFeature() {
      const obj = {};

      const table = sel.select('table.marker-properties');

      table.selectAll('tr').each(collectRow);

      function collectRow() {
        if (d3.select(this).selectAll('.prop-input')[0][0].value) {
          obj[snakeCase(d3.select(this).selectAll('.prop-input')[0][0].value)] =
            snakeCase(
              losslessNumber(
                d3.select(this).selectAll('.prop-input')[0][1].value
              )
            );
        }
      }

      if (obj['location_category'] === 'land_plot') {
        if (!obj['name'] || !obj['type']) {
          flash(
            context.container,
            'Please enter both a name and type for this plot.'
          ).classed('error', 'true');

          return;
        }
      } else {
        if (!obj['name']) {
          flash(
            context.container,
            'Please enter a name for this project boundary.'
          ).classed('error', 'true');

          return;
        }
      }

      const data = context.data.get('map');
      const feature = data.features[id];

      feature.properties = obj;

      console.log(obj);

      context.data.set({ map: data }, 'popup');

      // hide the popup
      e.target._onClose();
    }
  };
};
