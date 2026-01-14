
const GRAPHQL_URL = 'http://localhost:3000/graphql';

const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token user { id role country }
    }
  }
`;

const GET_RESTAURANTS = `
  query {
    restaurants {
      id name country
    }
  }
`;

const CREATE_ORDER = `
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(createOrderInput: $input) {
      id status
    }
  }
`;

async function gql(query, variables, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables }),
  });
  return res.json();
}

async function verify() {
  console.log('--- Location Verification Started ---');

  // 1. Manager India (Captain Marvel)
  console.log('[1] Logging in as Captain Marvel (MANAGER - INDIA)...');
  const marvelRes = await gql(LOGIN, { email: 'marvel@slooze.xyz', password: 'password' });
  const marvelToken = marvelRes.data.login.token;
  
  console.log('Test 1: Manager (India) fetches restaurants (Expect: Only INDIA restaurants)');
  const marvelRestaurants = await gql(GET_RESTAURANTS, {}, marvelToken);
  const indiaOnly = marvelRestaurants.data.restaurants.every(r => r.country === 'INDIA');
  if (indiaOnly && marvelRestaurants.data.restaurants.length > 0) {
    console.log('✅ Success: Only INDIA restaurants returned.');
    console.log('   Restaurants:', marvelRestaurants.data.restaurants.map(r => `${r.name} (${r.country})`).join(', '));
  } else {
    console.error('❌ Failed: Returned non-India restaurants:', marvelRestaurants.data.restaurants);
  }

  // 2. Member India (Thanos)
  console.log('\n[2] Logging in as Thanos (MEMBER - INDIA)...');
  const thanosRes = await gql(LOGIN, { email: 'thanos@slooze.xyz', password: 'password' });
  const thanosToken = thanosRes.data.login.token;

  console.log('Test 2: Member (India) tries to order from NY Eatery (USA) (Expect: Forbidden)');
  // NY Eatery should be ID 2 based on seed
  const orderRes = await gql(CREATE_ORDER, { input: { restaurantId: 2, items: [{ menuItemId: 3, quantity: 1 }] } }, thanosToken); // menuItem 3 is Burger
  if (orderRes.errors) {
    console.log('✅ Success: Blocked. Error:', orderRes.errors[0].message);
  } else {
    console.error('❌ Failed: Order created successfully!');
  }

  console.log('\n--- Location Verification Finished ---');
}

verify();
