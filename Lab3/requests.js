const axios = require('axios');

const testRequest = () => {
  axios
    .get('http://localhost:3000/test')
    .then((response) => {
      console.log('status', response.status);
      console.log('method', response.config.method);
      console.log('data', response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const proxyGET = () => {
  axios
    .get('http://localhost:3000/json_placeholder/posts/1', {
      headers: {
        Authorization: 'user',
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const proxyPOST = () => {
  axios
    .post(
      'http://localhost:3000/json_placeholder/posts',
      {
        title: 'foo',
        body: 'bar',
        userId: 1,
      },
      {
        headers: {
          Authorization: 'user',
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const proxyDELETE = () => {
  axios
    .delete('http://localhost:3000/json_placeholder/posts/1', {
      headers: {
        Authorization: 'user',
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const proxyPUT = () => {
  axios
    .put(
      'http://localhost:3000/json_placeholder/posts/1',
      {
        title: 'foo',
        body: 'bar',
      },
      {
        headers: {
          Authorization: 'user',
          'Content-type': 'application/json; charset=UTF-8',
        },
      }
    )
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
};

const proxyHEAD = () => {
  axios
    .head('http://localhost:3000/json_placeholder/posts/1', {
      headers: {
        Authorization: 'user',
      },
    })
    .then((response) => {
      console.log(response.status);
      console.log(response.headers);
    })
    .catch((error) => {
      console.log(error);
    });
};

const proxyOptions = () => {
  axios
    .options('http://localhost:3000/json_placeholder/posts/1', {
      headers: {
        Authorization: 'user',
      },
    })
    .then((response) => {
      console.log(response.status);
      console.log(response.headers);
    })
    .catch((error) => {
      console.log(error);
    });
};

// testRequest();
// proxyGET();
// proxyPOST();
// proxyDELETE();
// proxyPUT();
// proxyHEAD();
proxyOptions();
