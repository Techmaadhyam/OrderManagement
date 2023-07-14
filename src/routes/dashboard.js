import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Layout as DashboardLayout } from 'src/layouts/dashboard';

//(do not delete)
const IndexPage = lazy(() => import('src/pages/dashboard/index'));

// Quotation (do not delete)
const QuotationBuyPage = lazy(() => import('src/pages/dashboard/quotation/buyQuotation'));
const QuotationSellPage = lazy(() => import('src/pages/dashboard/quotation/sellQuotation'));
const QuotationServicePage = lazy(() => import('src/pages/dashboard/quotation/serviceQuotation'));
const QuotationViewPage = lazy(() => import('src/pages/dashboard/quotation/view'));
// const QuotationInvoicePage = lazy(() => import('src/pages/dashboard/quotation/invoice'));
const QuotationViewDetailPage = lazy(() => import('src/pages/dashboard/quotation/viewDetail'));
const QuotationEditPage = lazy(() => import('src/pages/dashboard/quotation/edit'));
const QuotationServiceEditPage = lazy(() => import('src/pages/dashboard/quotation/editserviceQuotation'));
const SalesQuotationEdit =lazy(() => import('src/pages/dashboard/quotation/editSalesQuotation'));


// PurchaseOrder (do not delete)
const PurchaseOrderCreatePage = lazy(() => import('src/pages/dashboard/purchaseorder/create'));
const PurchaseOrderViewPage = lazy(() => import('src/pages/dashboard/purchaseorder/view'));
const PurchaseOrderViewDetailPage = lazy(() => import('src/pages/dashboard/purchaseorder/viewDetail'));
const PurchaseOrderEdit = lazy(() => import('src/pages/dashboard/purchaseorder/edit'));

// workorder (do not delete)
const WorkOrderCreatePage = lazy(() => import('src/pages/dashboard/services/workorder/create'));
const WorkOrderViewPage = lazy(() => import('src/pages/dashboard/services/workorder/view'));
const WorkOrderViewDetailPage = lazy(() => import('src/pages/dashboard/services/workorder/viewDetail'));
const WorkOrderEdit = lazy(() => import('src/pages/dashboard/services/workorder/edit'));
const WorkOrderDownload = lazy(() => import('src/pages/dashboard/services/workorder/downloadamc'));

// AMC (do not delete)
const AMCCreatePage = lazy(() => import('src/pages/dashboard/services/AMC/create'));
const AMCViewPage = lazy(() => import('src/pages/dashboard/services/AMC/view'));
const AMCViewDetailPage = lazy(() => import('src/pages/dashboard/services/AMC/viewDetail'));
const AMCOrderEdit = lazy(() => import('src/pages/dashboard/services/AMC/edit'));
//const WorkOrderDownload = lazy(() => import('src/pages/dashboard/services/workorder/downloadamc'));


// Invoice (do not delete)
const InvoiceListPage = lazy(() => import('src/pages/dashboard/invoices/list'));
const InvoiceDetailPage = lazy(() => import('src/pages/dashboard/invoices/detail'));
const InvoiceViewPage = lazy(() => import('src/pages/dashboard/invoices/viewDetail'));

//inventory (do not delete)
const InventoryCreatePage = lazy(()=> import('src/pages/dashboard/inventory/create'))
const InventoryViewPage = lazy(()=> import('src/pages/dashboard/inventory/view'))
const InventoryEditPage = lazy(()=> import('src/pages/dashboard/inventory/edit'))
const InventoryDetailPage = lazy(()=> import('src/pages/dashboard/inventory/viewDetail'))

// Temporary User (do not delete)
const LogisticsDashboardPage = lazy(() => import('src/pages/dashboard/logistics/dashboard'));
const LogisticsFleetPage = lazy(() => import('src/pages/dashboard/logistics/view'));
const LogisticsViewDetailPage = lazy(() => import('src/pages/dashboard/logistics/viewDetail'));
const LogisticsViewAllSo = lazy(() => import('src/pages/dashboard/logistics/viewAllSales'));
const LogisticsViewAllPo = lazy(() =>
  import("src/pages/dashboard/logistics/viewAllPurchase")
);
const LogisticsViewAllQo = lazy(() =>
  import("src/pages/dashboard/logistics/viewAllQuotation")
);
const LogisticsViewAllWo = lazy(() =>
  import("src/pages/dashboard/logistics/viewAllWork")
);

//add technician
const TechnicianCreatePage = lazy(() => import('src/pages/dashboard/services/technician/dashboard'));
const TechnicianViewPage =lazy(() => import('src/pages/dashboard/services/technician/view'));
const TechnicianViewDetailPage =lazy(() => import('src/pages/dashboard/services/technician/viewDetail'));

// Orders (do not delete)
const OrderListPage = lazy(() => import('src/pages/dashboard/orders/create'));
const OrderViewPage = lazy(() => import('src/pages/dashboard/orders/view'));
const OrderInvoicePage = lazy(() => import('src/pages/dashboard/orders/invoice'));
const OrderViewDetailPage = lazy(() => import('src/pages//dashboard/orders/viewDetail'));
const OrderEditPage = lazy(() => import('src/pages//dashboard/orders/edit'));

// Products (do not delete)
const ProductListPage = lazy(() => import('src/pages/dashboard/products/list'));
const ProductCreatePage = lazy(() => import('src/pages/dashboard/products/create'));
const ProductViewPage = lazy(() => import('src/pages/dashboard/products/viewDetail'));

// Social (do not delete)
const SocialProfilePage = lazy(() => import('src/pages/dashboard/social/profile'));

//accounting
const Accounts = lazy(() => import("src/pages/dashboard/accounts/accounts"));

// Other
const BlankPage = lazy(() => import('src/pages/dashboard/blank'));

export const dashboardRoutes = [
  {
    path: "dashboard",
    element: (
      <DashboardLayout>
        <Suspense>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      {
        index: true,
        element: <IndexPage />,
      },
      {
        path: "quotation",
        children: [
          {
            path: "buy",
            element: <QuotationBuyPage />,
          },
          {
            path: "sell",
            element: <QuotationSellPage />,
          },
          {
            path: "service",
            element: <QuotationServicePage />,
          },
          {
            path: ":courseId",
            element: <QuotationViewPage />,
          },
          // {
          //   path: 'invoice',
          //   element: <QuotationInvoicePage/>
          // },
          {
            path: "viewDetail",
            element: <QuotationViewDetailPage />,
          },
          {
            path: "edit",
            element: <QuotationEditPage />,
          },
          {
            path: "editSales",
            element: <SalesQuotationEdit />,
          },
          {
            path: "editService",
            element: <QuotationServiceEditPage />,
          },
        ],
      },
      {
        path: "purchaseorder",
        children: [
          {
            index: true,
            element: <PurchaseOrderCreatePage />,
          },
          {
            path: ":customerId",
            element: <PurchaseOrderViewPage />,
          },
          {
            path: "viewDetail/:id",
            element: <PurchaseOrderViewDetailPage />,
          },
          {
            path: "edit",
            element: <PurchaseOrderEdit />,
          },
        ],
      },

      {
        path: "invoices",
        children: [
          {
            index: true,
            element: <InvoiceListPage />,
          },
          {
            path: ":invoiceId",
            element: <InvoiceDetailPage />,
          },
          {
            path: "viewDetail",
            element: <InvoiceViewPage />,
          },
        ],
      },
      {
        path: "logistics",
        children: [
          {
            index: true,
            element: <LogisticsDashboardPage />,
          },
          {
            path: "fleet",
            element: <LogisticsFleetPage />,
          },
          {
            path: "viewDetail",
            element: <LogisticsViewDetailPage />,
          },
          {
            path: "viewAllPo",
            element: <LogisticsViewAllPo />,
          },
          {
            path: "viewAllSo",
            element: <LogisticsViewAllSo />,
          },
          {
            path: "viewAllQo",
            element: <LogisticsViewAllQo />,
          },
          {
            path: "viewAllWo",
            element: <LogisticsViewAllWo />,
          },
        ],
      },
      // {
      //   path: 'technician',
      //   children: [
      //     {
      //       index: true,
      //       element: <TechnicianCreatePage />
      //     },
      //     {
      //       path: 'view',
      //       element: <TechnicianViewPage />
      //     },
      //     {
      //       path:'viewDetail',
      //       element: <TechnicianViewDetailPage />
      //     },
      //   ]
      // },
      // {
      //   path: 'workorder',
      //   children: [
      //     {
      //       index: true,
      //       element: <WorkOrderCreatePage />
      //     },
      //     {
      //       path: 'view',
      //       element: <WorkOrderViewPage />
      //     },
      //     {
      //       path: 'viewDetail',
      //       element: <WorkOrderViewDetailPage/>
      //     },{
      //       path: 'edit',
      //       element: <WorkOrderEdit/>
      //     },

      //   ]
      // },
      {
        path: "services",
        children: [
          {
            path: "workorder",
            element: <WorkOrderCreatePage />,
          },
          {
            path: "workorderview",
            element: <WorkOrderViewPage />,
          },
          {
            path: "workorderDetail",
            element: <WorkOrderViewDetailPage />,
          },
          {
            path: "workorderedit",
            element: <WorkOrderEdit />,
          },
          {
            path: "workorderdownload",
            element: <WorkOrderDownload />,
          },
          {
            path: "amc",
            element: <AMCCreatePage />,
          },
          {
            path: "amcview",
            element: <AMCViewPage />,
          },
          {
            path: "amcDetail",
            element: <AMCViewDetailPage />,
          },
          {
            path: "amcedit",
            element: <AMCOrderEdit />,
          },

          {
            path: "technician",
            element: <TechnicianCreatePage />,
          },
          {
            path: "technicianview",
            element: <TechnicianViewPage />,
          },
          {
            path: "technicianDetail",
            element: <TechnicianViewDetailPage />,
          },
        ],
      },
      {
        path: "orders",
        children: [
          {
            index: true,
            element: <OrderListPage />,
          },
          {
            path: ":orderId",
            element: <OrderInvoicePage />,
          },
          {
            path: "details",

            element: <OrderViewPage />,
          },
          {
            path: "viewDetail/:id",
            element: <OrderViewDetailPage />,
          },
          {
            path: "edit",
            element: <OrderEditPage />,
          },
        ],
      },
      {
        path: "inventory",
        children: [
          {
            path: "view",
            element: <InventoryViewPage />,
          },
          {
            path: "create",
            element: <InventoryCreatePage />,
          },
          {
            path: "edit",
            element: <InventoryEditPage />,
          },
          {
            path: "viewDetail/:id",
            element: <InventoryDetailPage />,
          },
        ],
      },
      {
        path: 'accounts',
        element: <Accounts/>
      },
      {
        path: "social",
        children: [
          {
            path: "profile",
            element: <SocialProfilePage />,
          },
        ],
      },
      {
        path: "products",
        children: [
          {
            index: true,
            element: <ProductListPage />,
          },
          {
            path: "create",
            element: <ProductCreatePage />,
          },
          {
            path: "viewDetail/:id",
            element: <ProductViewPage />,
          },
        ],
      },
      {
        path: "blank",
        element: <BlankPage />,
      },
    ],
  },
];
