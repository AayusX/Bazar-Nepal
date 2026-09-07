import { gql } from '@apollo/client';

const USER_FIELDS = gql`
  fragment UserFields on User {
    id name email avatar phone whatsapp phoneVisibility whatsappVisibility emailVisibility
    onlineStatus accountStatus isVerified reputation itemsSold trustScore rating ratingCount
    joinDate lastSeen district province country latitude longitude contactPreference
  }
`;

const PRODUCT_FIELDS = gql`
  fragment ProductFields on Product {
    id title description price currency negotiable condition brand quantity stockStatus
    category { id name icon }
    seller { id name avatar }
    subcategory location district province country latitude longitude
    images videos tags
    postedAt views favoriteCount chatCount
    isEscrowEligible isBoosted isDeliveryAvailable isPickupAvailable isActive isSold
    moderationStatus
    priceHistory { date price }
  }
`;

export const GET_PRODUCTS = gql`
  query GetProducts(
    $categoryId: ID, $search: String, $sellerId: ID,
    $minPrice: Float, $maxPrice: Float, $condition: String,
    $brand: String, $district: String, $province: String,
    $negotiable: Boolean, $sortBy: String, $page: Int, $limit: Int
  ) {
    products(
      categoryId: $categoryId, search: $search, sellerId: $sellerId,
      minPrice: $minPrice, maxPrice: $maxPrice, condition: $condition,
      brand: $brand, district: $district, province: $province,
      negotiable: $negotiable, sortBy: $sortBy, page: $page, limit: $limit
    ) {
      items { ...ProductFields }
      totalCount hasMore page
    }
  }
  ${PRODUCT_FIELDS}
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) { ...ProductFields }
  }
  ${PRODUCT_FIELDS}
`;

export const GET_CATEGORIES = gql`
  query GetCategories { categories { id name icon } }
`;

export const GET_ME = gql`
  query Me { me { ...UserFields } }
  ${USER_FIELDS}
`;

export const GET_CONVERSATIONS = gql`
  query Conversations {
    conversations {
      id buyer { id name avatar } seller { id name avatar }
      product { id title images price currency }
      lastMessage lastMessageAt unreadBuyer unreadSeller createdAt
    }
  }
`;

export const GET_MESSAGES = gql`
  query Messages($conversationId: ID!) {
    messages(conversationId: $conversationId) {
      id conversationId sender { id name avatar }
      content contentType attachmentUrl isRead isDelivered sentAt readAt
    }
  }
`;

export const GET_NOTIFICATIONS = gql`
  query Notifications {
    notifications { id type title body imageUrl actionUrl isRead createdAt }
  }
`;

export const GET_UNREAD_COUNTS = gql`
  query UnreadCounts { unreadCounts { messages notifications } }
`;

export const GET_SAVED_ITEMS = gql`
  query SavedItems { savedItems { ...ProductFields } }
  ${PRODUCT_FIELDS}
`;

export const GET_SEARCH_SUGGESTIONS = gql`
  query SearchSuggestions($query: String!) { searchSuggestions(query: $query) }
`;

export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      user { ...UserFields }
      token refreshToken
    }
  }
  ${USER_FIELDS}
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      user { ...UserFields }
      token refreshToken
    }
  }
  ${USER_FIELDS}
`;

export const REFRESH_TOKEN_MUTATION = gql`
  mutation RefreshToken($token: String!) {
    refreshToken(token: $token) {
      user { ...UserFields }
      token refreshToken
    }
  }
  ${USER_FIELDS}
`;

export const UPDATE_PROFILE_MUTATION = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) { ...UserFields }
  }
  ${USER_FIELDS}
`;

export const ADD_PRODUCT_MUTATION = gql`
  mutation AddProduct($input: ProductInput!) {
    addProduct(input: $input) { ...ProductFields }
  }
  ${PRODUCT_FIELDS}
`;

export const UPDATE_PRODUCT_MUTATION = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) { ...ProductFields }
  }
  ${PRODUCT_FIELDS}
`;

export const DELETE_PRODUCT_MUTATION = gql`
  mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) }
`;

export const TOGGLE_SAVED_ITEM = gql`
  mutation ToggleSavedItem($productId: ID!) { toggleSavedItem(productId: $productId) }
`;

export const START_CONVERSATION = gql`
  mutation StartConversation($sellerId: ID!, $productId: ID!, $message: String!) {
    startConversation(sellerId: $sellerId, productId: $productId, message: $message) {
      id buyer { id name avatar } seller { id name avatar }
      product { id title }
      lastMessage lastMessageAt createdAt
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($conversationId: ID!, $content: String!) {
    sendMessage(conversationId: $conversationId, content: $content) {
      id conversationId sender { id name avatar }
      content contentType isRead isDelivered sentAt
    }
  }
`;

export const MARK_MESSAGES_READ = gql`
  mutation MarkMessagesRead($conversationId: ID!) { markMessagesRead(conversationId: $conversationId) }
`;

export const MARK_NOTIFICATIONS_READ = gql`
  mutation MarkNotificationsRead { markNotificationsRead }
`;

export const CREATE_REPORT = gql`
  mutation CreateReport($input: ReportInput!) {
    createReport(input: $input) { id targetType targetId reason description status createdAt }
  }
`;

export const RECORD_VIEW = gql`
  mutation RecordView($productId: ID!) { recordView(productId: $productId) }
`;

export const MESSAGE_RECEIVED_SUB = gql`
  subscription MessageReceived($conversationId: ID!) {
    messageReceived(conversationId: $conversationId) {
      id conversationId sender { id name avatar }
      content contentType isRead isDelivered sentAt
    }
  }
`;

export const NOTIFICATION_RECEIVED_SUB = gql`
  subscription NotificationReceived {
    notificationReceived { id type title body actionUrl isRead createdAt }
  }
`;

export const PRODUCT_ADDED_SUB = gql`
  subscription ProductAdded {
    productAdded { ...ProductFields }
  }
  ${PRODUCT_FIELDS}
`;
