export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    auth0: {
      callback: '/auth/auth0/callback',
      login: '/auth/auth0/login'
    },
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register'
    },
    firebase: {
      login: '/auth/firebase/login',
      register: '/auth/firebase/register'
    },
    amplify: {
      confirmRegister: '/auth/amplify/confirm-register',
      forgotPassword: '/auth/amplify/forgot-password',
      login: '/auth/amplify/login',
      register: '/auth/amplify/register',
      resetPassword: '/auth/amplify/reset-password'
    }
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern'
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern'
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern'
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern'
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern'
    }
  },
  dashboard: {
    index: '/dashboard',
    quotation: {
      buy: '/dashboard/quotation/buy',
      view: '/dashboard/quotation/:courseId',
      invoice: '/dashboard/quotation/invoice',
      viewDetail: '/dashboard/quotation/viewDetail',
      edit: '/dashboard/quotation/edit',
      sell: '/dashboard/quotation/sell',
      service: '/dashboard/quotation/service',
      editService: '/dashboard/quotation/editService',
    },
    account: '/dashboard/account',
    analytics: '/dashboard/analytics',
    blank: '/dashboard/blank',
    blog: {
      index: '/dashboard/blog',
      postDetails: '/dashboard/blog/:postId',
      postCreate: '/dashboard/blog/create'
    },
    purchaseorder: {
      index: '/dashboard/purchaseorder',
      create: '/dashboard/purchaseorder/',
      view: '/dashboard/purchaseorder/:customerId',
      viewDetail: '/dashboard/purchaseorder/viewDetail',
      edit: '/dashboard/purchaseorder/edit',
      invoice: '/dashboard/purchaseorder/invoice',
    },
    ecommerce: '/dashboard/ecommerce',
    fileManager: '/dashboard/file-manager',
    invoices: {
      index: '/dashboard/invoices',
      details: '/dashboard/invoices/:orderId',
      viewDetail: '/dashboard/invoices/viewDetail',
    },
    jobs: {
      index: '/dashboard/jobs',
      create: '/dashboard/jobs/create',
      companies: {
        details: '/dashboard/jobs/companies/:companyId'
      }
    },
    kanban: '/dashboard/kanban',
    logistics: {
      index: '/dashboard/logistics',
      fleet: '/dashboard/logistics/fleet',
      viewDetail: '/dashboard/logistics/viewDetail',

    },
    technician: {
      index: '/dashboard/technician',
      view: '/dashboard/technician/view',
      viewDetail: '/dashboard/technician/viewDetail',

    },
    mail: '/dashboard/mail',
    orders: {
      index: '/dashboard/orders',
      invoice  : '/dashboard/orders/:orderId',
      details: '/dashboard/orders/details',
      viewDetail: '/dashboard/orders/viewDetail',
      edit: '/dashboard/orders/edit',
    },
    inventory: {
      index: '/dashboard/inventory',
      view: '/dashboard/inventory/view',
      edit: '/dashboard/inventory/edit',
      create: '/dashboard/inventory/create',
      viewDetail: '/dashboard/inventory/viewDetail',
    },
    products: {
      index: '/dashboard/products',
      view: '/dashboard/products',
      create: '/dashboard/products/create',
      viewDetail: '/dashboard/products/viewDetail'
    },
    social: {
      index: '/dashboard/social',
      profile: '/dashboard/social/profile',
      feed: '/dashboard/social/feed'
    }
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats'
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists'
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs'
  },
  docs: 'https://material-kit-pro-react-docs.devias.io',
  401: '/401',
  404: '/404',
  500: '/500'
};
