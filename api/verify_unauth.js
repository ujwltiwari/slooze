// using native fetch

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
    return { errors: json.errors };
  }
  return { data: json.data };
}

const CANCEL_ORDER = `
  mutation CancelOrder($id: Int!) {
    cancelOrder(id: $id) {
      id status
    }
  }
`;

const GET_ORDERS = `
  query {
    orders {
      id
    }
  }
`;

async function verify() {
  console.log('--- Unauth Verification Started ---');

  // Test 1: Public access to Orders (No Roles Required)
  console.log('Test 1: Unauth access to Orders (Expected: Auth Required, No Roles)');
  const ordersRes = await gql(GET_ORDERS, {});
  if (ordersRes.errors) {
    console.log('✅ Error:', ordersRes.errors[0].message);
  } else {
    console.log('❌ Unexpected success');
  }

  // Test 2: Public access to CancelOrder (Roles: ADMIN, MANAGER)
  console.log('\nTest 2: Unauth access to CancelOrder (Expected: Auth Required + Roles listed)');
  const cancelRes = await gql(CANCEL_ORDER, { id: 1 });
  if (cancelRes.errors) {
    console.log('✅ Error:', cancelRes.errors[0].message);
  } else {
    console.log('❌ Unexpected success');
  }

  console.log('\n--- Verification Finished ---');
}

verify();
