import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      role
      country
    }
  }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(loginInput: { email: $email, password: $password }) {
      token
      user {
        id
        email
        name
        role
        country
      }
    }
  }
`;


export const GET_RESTAURANTS_QUERY = gql`
  query GetRestaurants {
    restaurants {
      id
      name
      country
      address
      menuItems {
        id
        name
        price
        isAvailable
      }
    }
  }
`;

export const GET_ORDERS_QUERY = gql`
  query GetOrders {
    orders {
      id
      status
      totalAmount
      createdAt
      restaurant {
        name
      }
      items {
        quantity
        menuItem {
          name
          price
        }
      }
    }
  }
`;

export const CHECKOUT_MUTATION = gql`
  mutation Checkout($id: Int!, $paymentMethodId: Int!) {
    checkoutOrder(id: $id, paymentMethodId: $paymentMethodId) {
      id
      status
    }
  }
`;

export const CANCEL_MUTATION = gql`
  mutation Cancel($id: Int!) {
    cancelOrder(id: $id) {
      id
      status
    }
  }
`;

export const GET_PAYMENT_METHODS_QUERY = gql`
  query GetPaymentMethods {
    paymentMethods {
      id
      type
      maskedDetails
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($restaurantId: Int!, $items: [OrderItemInput!]!) {
    createOrder(createOrderInput: { restaurantId: $restaurantId, items: $items }) {
      id
      status
    }
  }
`;


export const GET_USERS_QUERY = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      country
    }
  }
`;

export const CREATE_USER_MUTATION = gql`
  mutation CreateUser($email: String!, $password: String!, $name: String!, $role: String!, $country: String!) {
    createUser(email: $email, password: $password, name: $name, role: $role, country: $country) {
      id
      email
    }
  }
`;

export const CREATE_PAYMENT_METHOD_MUTATION = gql`
  mutation CreatePaymentMethod($userId: Int!, $type: String!, $maskedDetails: String!) {
    createPaymentMethod(userId: $userId, type: $type, maskedDetails: $maskedDetails) {
      id
      type
      maskedDetails
    }
  }
`;

export const UPDATE_PAYMENT_METHOD_MUTATION = gql`
  mutation UpdatePaymentMethod($id: Int!, $type: String!, $maskedDetails: String!) {
    updatePaymentMethod(id: $id, type: $type, maskedDetails: $maskedDetails) {
      id
      type
      maskedDetails
    }
  }
`;
