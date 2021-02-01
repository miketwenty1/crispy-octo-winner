function postData(url = '', data = {}) {
  return fetch(url, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'include', // for jwt cookies
    headers: {
      'Content-Type': 'application/json',
    },
    redirect: 'follow',
    referrer: 'no-referer', // referrer
    body: JSON.stringify(data),
  }).then((res) => res.json()); // without curly braces this returns the value
}

function signIn() {
  console.log('login');
  const body = {
    email: document.forms[0].elements[0].value,
    password: document.forms[0].elements[1].value,
  };
  console.log(body);
  postData('/login', body)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      window.location.replace('/game.html');
    })
    .catch((err) => {
      window.alert(err.message);
      window.location.replace('/index.html');
    });
}

function signUp() {
  const body = {
    email: document.forms[0].elements[0].value,
    password: document.forms[0].elements[1].value,
    username: document.forms[0].elements[2].value,
  };

  postData('/signup', body)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      window.alert('user created');
      window.location.replace('/index.html');
    })
    .catch((err) => {
      window.alert(err.message);
      window.location.replace('/signup.html');
    });
}

function forgotPassword() {
  const body = {
    email: document.forms[0].elements[0].value,
  };

  postData('/forgot-password', body)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.error);
      }
      window.alert('password reset, email sent');
      window.location.replace('/index.html');
    })
    .catch((err) => {
      window.alert(err.message);
      window.location.replace('/forgot-password.html');
    });
}

function resetPassword() {
  const password = document.forms[0].elements[0].value;
  const verifiedPassword = document.forms[0].elements[1].value;
  const body = {
    password: document.forms[0].elements[0].value,
    verifiedPassword: document.forms[0].elements[1].value,
    token: document.location.href.split('token=')[1],
  };
  if (password !== verifiedPassword) {
    window.alert('passwords dont match');
  } else {
    postData('/reset-password', body)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(res.error);
        }
        window.alert('password updated');
        window.location.replace('/index.html');
      })
      .catch((err) => {
        window.alert(err.message);
        window.location.replace('/reset-password.html');
      });
  }
}
