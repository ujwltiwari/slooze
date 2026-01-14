const fetch = require('node-fetch'); // Assuming node-fetch or native fetch in node 18+

const GRAPHQL_URL = 'http://localhost:3000/graphql';

async function gql(query, variables, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data;
}

const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user { id role country }
    }
  }
`;

const GET_ORDERS = `
  query {
    orders { id status }
  }
`;

async function verify() {
  console.log('--- Verification Started ---');

  // 1. Admin Login (Nick Fury)
  try {
    console.log('Logging in as Nick Fury (ADMIN)...');
    const nick = await gql(LOGIN, { email: 'nick@fury.com', password: 'password' });
    const nickToken = nick.login.token;
    console.log('Nick Fury logged in.');

    // Admin should see orders
    const orders = await gql(GET_ORDERS, {}, nickToken);
    console.log(`Nick see ${orders.orders.length} orders.`);
  } catch (e) {
    console.error('Nick Fury Failed:', e.message);
  }

  // 2. Member Login (Thor)
  try {
    console.log('Logging in as Thor (MEMBER)...');
    const thor = await gql(LOGIN, { email: 'thor@avengers.com', password: 'password' });
    const thorToken = thor.login.token;
    console.log('Thor logged in.');

    // Thor should see HIS orders (maybe empty initially)
    const orders = await gql(GET_ORDERS, {}, thorToken);
    console.log(`Thor see ${orders.orders.length} orders.`);
  } catch (e) {
    console.error('Thor Failed:', e.message);
  }

  console.log('--- Verification Finished ---');
}

verify();
