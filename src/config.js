function getMode() {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  const mode = urlParams.get('mode');

  return mode ? mode : 'project_bounds';
}

module.exports = {
  GithubAPI: false,
  projectBoundsPropId: 'project_bounds',
  landPlotId: 'land_plot',
  isTaskMode: () => {
    return getMode() === 'task';
  },
  isProjectMode: () => {
    return getMode() === 'project_bounds';
  }
};
