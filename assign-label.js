const axios = require('axios');

const token = process.env.GITHUB_TOKEN;
const repository = process.env.REPOSITORY;
const discussionNumber = process.env.DISCUSSION_NUMBER;

async function getLabels() {
  const response = await axios.get(`https://api.github.com/repos/${repository}/labels`, {
    headers: {
      Authorization: `token ${token}`
    }
  });
  return response.data;
}

async function getLabelCounts() {
  const labels = await getLabels();
  const counts = {};

  for (const label of labels) {
    const response = await axios.get(label.url, {
      headers: {
        Authorization: `token ${token}`
      }
    });
    counts[label.name] = response.data.open_issues_count;
  }

  return counts;
}

async function assignLabel() {
  const labelCounts = await getLabelCounts();
  const minCountLabel = Object.keys(labelCounts).reduce((a, b) => labelCounts[a] < labelCounts[b] ? a : b);

  await axios.post(`https://api.github.com/repos/${repository}/discussions/${discussionNumber}/labels`, {
    labels: [minCountLabel]
  }, {
    headers: {
      Authorization: `token ${token}`,
      Accept: 'application/vnd.github.v3+json'
    }
  });

  console.log(`Assigned label: ${minCountLabel}`);
}

assignLabel().catch(error => {
  console.error(error);
  process.exit(1);
});
