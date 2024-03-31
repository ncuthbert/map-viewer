function getMode() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const mode = urlParams.get('mode');

  return mode ? mode : 'default';
  /* checkpoint mode
    - disables editing of non-checkpoint features
  */
}

function isCheckpointMode() {
  return getMode() === 'checkpoint';
}

function isCheckpoint(feature) {
  return (
    isCheckpointMode() &&
    feature.geometry.type === 'Point' &&
    !feature.properties['feat_cat']
  );
}

module.exports = {
  GithubAPI: false,
  isCheckpointMode,
  isCheckpoint
};
