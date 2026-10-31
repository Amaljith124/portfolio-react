// The image of a portfolio JSON node ({ objectKey } for an R2 image, { src } for a file of the website) -> URL to show.
export function previewUrl(node, assets) {
  let url = '';
  if (node && node.objectKey) {
    const asset = (assets || []).find(item => item.objectKey === node.objectKey);
    url = asset ? (asset.previewUrl || asset.publicUrl || '') : '';
  } else if (node && node.src) {
    url = node.src;
  } else {
    // no image
  }
  return url;
}

// A copy of the portfolio with the value at path (['profile', 'portrait'] or ['projects', 2, 'image']) replaced.
export function setAtPath(portfolio, path, value) {
  const copy = JSON.parse(JSON.stringify(portfolio || {}));
  let node = copy;
  path.slice(0, -1).forEach(function (key) {
    node = node[key];
  });
  const last = path[path.length - 1];
  if (value === undefined) {
    delete node[last];
  } else {
    node[last] = value;
  }
  return copy;
}

export function getAtPath(portfolio, path) {
  return path.reduce((node, key) => (node ? node[key] : undefined), portfolio);
}
