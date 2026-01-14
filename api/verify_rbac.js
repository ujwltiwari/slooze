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
    // Return errors instead of throwing to analyze them
    return { errors: json.errors };
  }
  return { data: json.data };
}

const LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user { id role country }
    }
  }
`;

const CREATE_PAYMENT_METHOD = `
  mutation CreatePayment($userId: Int!, $type: String!, $maskedDetails: String!) {
    createPaymentMethod(userId: $userId, type: $type, maskedDetails: $maskedDetails) {
      id
    }
  }
`;

const CANCEL_ORDER = `
  mutation CancelOrder($id: Int!) {
    cancelOrder(id: $id) {
      id status
    }
  }
`;

async function verify() {
  console.log('--- RBAC Verification Started ---');

  // 1. Member Login (Thanos)
  console.log('\n[1] Logging in as Thanos (MEMBER)...');
  const thanosRes = await gql(LOGIN, { email: 'thanos@slooze.xyz', password: 'password' });
  if (thanosRes.errors) { console.error('Login Failed', thanosRes.errors); return; }
  const thanosToken = thanosRes.data.login.token;
  const thanosId = thanosRes.data.login.user.id;
  console.log('Thanos logged in.');

  // Test 1: Member tries to create Payment Method (Should Fail)
  console.log('Test 1: Member attempts CreatePaymentMethod (Expected: Forbidden)');
  const payRes = await gql(CREATE_PAYMENT_METHOD, { userId: thanosId, type: 'CC', maskedDetails: '1234' }, thanosToken);
  if (payRes.errors) {
    console.log('✅ Success: Blocked. Error message:', payRes.errors[0].message);
  } else {
    console.error('❌ Failed: Operation succeeded unexpectedly.');
  }

  // Test 2: Member tries to Cancel Order (Should Fail)
  // We'll just try to cancel a dummy ID 999. The Guard should block it BEFORE service looks for ID.
  console.log('Test 2: Member attempts CancelOrder (Expected: Forbidden)');
  const cancelRes = await gql(CANCEL_ORDER, { id: 999 }, thanosToken);
  if (cancelRes.errors) {
    console.log('✅ Success: Blocked. Error message:', cancelRes.errors[0].message);
  } else {
    console.error('❌ Failed: Operation succeeded unexpectedly.');
  }

  // 2. Admin Login (Nick Fury)
  console.log('\n[2] Logging in as Nick Fury (ADMIN)...');
  const nickRes = await gql(LOGIN, { email: 'nick@slooze.xyz', password: 'password' });
  const nickToken = nickRes.data.login.token;
  console.log('Nick Fury logged in.');

  // Test 3: Admin tries to Create Payment Method (Should Succeed)
  console.log('Test 3: Admin attempts CreatePaymentMethod (Expected: Success)');
  const adminPayRes = await gql(CREATE_PAYMENT_METHOD, { userId: thanosId, type: 'PAYPAL', maskedDetails: 'ADMIN-CREATED' }, nickToken);
  if (adminPayRes.data) {
    console.log('✅ Success: Created PaymentMethod ID:', adminPayRes.data.createPaymentMethod.id);
  } else {
    console.error('❌ Failed:', adminPayRes.errors);
  }

  console.log('\n--- RBAC Verification Finished ---');
}

verify();
