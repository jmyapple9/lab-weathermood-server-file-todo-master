import axios from 'axios';

// Develop server URL
const postBaseUrl = 'http://localhost:8080/api';

// Staging server URL
// const postBaseUrl = 'http://weathermood-staging.us-west-2.elasticbeanstalk.com/api';

// Production server URL
// const postBaseUrl = {Your URL};

export function listPosts(searchText = '') {
  let url = `${postBaseUrl}/posts`;
  if (searchText) url += `?searchText=${searchText}`;

  console.log(`Making GET request to: ${url}`);

  return axios.get(url).then(function (res) {
    if (res.status !== 200)
      throw new Error(`Unexpected response code: ${res.status}`);

    return res.data;
  });
}

export function createPost(mood, text) {
  let url = `${postBaseUrl}/posts`;

  console.log(`Making POST request to: ${url}`);

  return axios
    .post(url, {
      mood,
      text,
    })
    .then(function (res) {
      if (res.status !== 200)
        throw new Error(`Unexpected response code: ${res.status}`);

      return res.data;
    });
}

export function createVote(id, mood) {
  let url = `${postBaseUrl}/posts/${id}/${mood.toLowerCase()}Votes`;

  console.log(`Making POST request to: ${url}`);

  return axios.post(url).then(function (res) {
    if (res.status !== 200)
      throw new Error(`Unexpected response code: ${res.status}`);

    return res.data;
  });
}
