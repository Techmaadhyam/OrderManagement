
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@mui/material';
import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import Upload04Icon from 'src/icons/untitled-ui/duocolor/upload-04';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import useAuthStore from 'src/store/store';
// Add icon options imports here
import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
import StoreMallDirectoryTwoToneIcon from "@mui/icons-material/StoreMallDirectoryTwoTone";
import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
import ProductionQuantityLimitsTwoToneIcon from "@mui/icons-material/ProductionQuantityLimitsTwoTone";
export const useSections = () => {
  const { t } = useTranslation();
  const tabsData = useAuthStore((state) => state.tabs);
  console.log("tabData", tabsData);

  // Add icon options to the mapping here
  const iconMappings = {
    BusinessTwoToneIcon: <BusinessTwoToneIcon />,
    WarehouseOutlinedIcon: <WarehouseOutlinedIcon />,
    StorefrontTwoToneIcon: <StorefrontTwoToneIcon />,
    StoreMallDirectoryTwoToneIcon: <StoreMallDirectoryTwoToneIcon />,
    FactoryTwoToneIcon: <FactoryTwoToneIcon />,
    AddTwoToneIcon: <AddTwoToneIcon />,
    ProductionQuantityLimitsTwoToneIcon: <ProductionQuantityLimitsTwoToneIcon />,
    // Add other icons to the mapping as needed
  };

  return useMemo(() => {
    if (!Array.isArray(tabsData)) {
      return []; // Return an empty array if tabsData is not an array
    }

    const sections = [
      ...tabsData.map((tab) => ({
        items: [
          // {
          //   title: t(tokens.nav.overview),
          //   path: paths.dashboard.index,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <HomeSmileIcon />
          //     </SvgIcon>
          //   ),
          // },
          {
            title: tab.tabname,
            path: paths.dashboard.create,
            icon: <SvgIcon fontSize="small">{iconMappings[tab.logo]}</SvgIcon>,
            items: [
              {
                title: "View",
                path: paths.dashboard.view.replace(":id", tab.tabid),
              },
              {
                title: "Create",
                path: paths.dashboard.create.replace(":id", tab.tabid),
              },
            ],
          },
        ],
      })),
    ];
    sections.unshift({
      items: [
        {
          title: t(tokens.nav.overview),
          path: paths.dashboard.index,
          icon: (
            <SvgIcon fontSize="small">
              <HomeSmileIcon />
            </SvgIcon>
          ),
        },
      ],
    });
    return sections;
  }, [t, tabsData]);
};



// import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import { SvgIcon } from '@mui/material';
// import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
// import LogOut01Icon from 'src/icons/untitled-ui/duocolor/log-out-01';
// import ReceiptCheckIcon from 'src/icons/untitled-ui/duocolor/receipt-check';
// import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
// import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
// import InventoryTwoToneIcon from "@mui/icons-material/InventoryTwoTone";
// import LayoutAlt02Icon from "src/icons/untitled-ui/duocolor/layout-alt-02";
// import Upload04Icon from 'src/icons/untitled-ui/duocolor/upload-04';
// import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
// import { tokens } from 'src/locales/tokens';
// import { paths } from 'src/paths';
// import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
// import AccountBalanceTwoToneIcon from "@mui/icons-material/AccountBalanceTwoTone";
// import useAuthStore from 'src/store/store';

// export const useSections = () => {
//   const { t } = useTranslation();
//   const tabsData = useAuthStore((state) => state.user);
//   console.log("tabData", tabsData);



//   return useMemo(() => {
//     return [
//       {
//         items: [
//           {
//             title: t(tokens.nav.overview),
//             path: paths.dashboard.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <HomeSmileIcon />
//               </SvgIcon>
//             ),
//           },
//           {
//             title: t(tokens.nav.products),
//             path: paths.dashboard.products.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <Upload04Icon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.view),
//                 path: paths.dashboard.products.view,
//               },
//               {
//                 title: t(tokens.nav.create),
//                 path: paths.dashboard.products.create,
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.warehouse),
//             path: paths.dashboard.invoices.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <ReceiptCheckIcon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.view),
//                 path: paths.dashboard.invoices.details,
//               },
//               {
//                 title: t(tokens.nav.create),
//                 path: paths.dashboard.invoices.index,
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.inventory),
//             path: paths.dashboard.inventory.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <ShoppingBag03Icon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.view),
//                 path: paths.dashboard.inventory.view,
//               },
//               {
//                 title: t(tokens.nav.create),
//                 path: paths.dashboard.inventory.create,
//               },
//             ],
//           },

//           {
//             title: t(tokens.nav.user),
//             path: paths.dashboard.logistics.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <Users03Icon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.view),
//                 path: paths.dashboard.logistics.fleet,
//               },
//               {
//                 title: t(tokens.nav.create),
//                 path: paths.dashboard.logistics.index,
//               },
//             ],
//           },

//           {
//             title: t(tokens.nav.quotation),
//             path: paths.dashboard.quotation.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <LayoutAlt02Icon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.view),
//                 path: paths.dashboard.quotation.view,
//               },
//               {
//                 title: t(tokens.nav.create),

//                 items: [
//                   {
//                     title: t(tokens.nav.buyer),
//                     path: paths.dashboard.quotation.buy,
//                   },
//                   {
//                     title: t(tokens.nav.seller),
//                     path: paths.dashboard.quotation.sell,
//                   },
//                   {
//                     title: t(tokens.nav.service),
//                     path: paths.dashboard.quotation.service,
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.orderList),
//             icon: (
//               <SvgIcon fontSize="small">
//                 <InventoryTwoToneIcon />
//               </SvgIcon>
//             ),
//             path: paths.dashboard.orders.index,
//             items: [
//               {
//                 title: t(tokens.nav.create),
//                 path: paths.dashboard.orders.index,
//               },
//               {
//                 title: t(tokens.nav.invoices),
//                 path: paths.dashboard.orders.details,
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.purchaseorder),
//             path: paths.dashboard.purchaseorder.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <ShoppingCart01Icon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.view),
//                 path: paths.dashboard.purchaseorder.view,
//               },
//               {
//                 title: t(tokens.nav.create),
//                 path: paths.dashboard.purchaseorder.create,
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.services),
//             path: paths.dashboard.services.index,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <BuildCircleTwoToneIcon />
//               </SvgIcon>
//             ),
//             items: [
//               {
//                 title: t(tokens.nav.workorder),

//                 items: [
//                   {
//                     title: t(tokens.nav.view),
//                     path: paths.dashboard.services.workorderview,
//                   },
//                   {
//                     title: t(tokens.nav.create),
//                     path: paths.dashboard.services.createWorkorder,
//                   },
//                 ],
//               },
//               {
//                 title: t(tokens.nav.addAmc),

//                 items: [
//                   {
//                     title: t(tokens.nav.view),
//                     path: paths.dashboard.services.AMCview,
//                   },
//                   {
//                     title: t(tokens.nav.create),
//                     path: paths.dashboard.services.createAMC,
//                   },
//                 ],
//               },
//               {
//                 title: t(tokens.nav.technician),

//                 items: [
//                   {
//                     title: t(tokens.nav.view),
//                     path: paths.dashboard.services.technicianview,
//                   },
//                   {
//                     title: t(tokens.nav.create),
//                     path: paths.dashboard.services.createTechnician,
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.accounts),
//             path: paths.dashboard.accounts,
//             icon: (
//               <SvgIcon fontSize="small">
//                 <AccountBalanceTwoToneIcon />
//               </SvgIcon>
//             ),
//           },
//         ],
//       },
//       {
//         title: t(tokens.nav.checkout),
//         path: paths.checkout,
//         icon: (
//           <SvgIcon fontSize="small">
//             <LogOut01Icon />
//           </SvgIcon>
//         ),
//       },
//     ];
//   }, [t]);
// };





// import { useMemo } from 'react';
// import { useTranslation } from 'react-i18next';
// import { SvgIcon } from '@mui/material';
// import { tokens } from 'src/locales/tokens';
// import { paths } from 'src/paths';
// import useAuthStore from 'src/store/store';
// import BusinessTwoToneIcon from '@mui/icons-material/BusinessTwoTone';
// import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
// import StorefrontTwoToneIcon from "@mui/icons-material/StorefrontTwoTone";
// import StoreMallDirectoryTwoToneIcon from "@mui/icons-material/StoreMallDirectoryTwoTone";
// import FactoryTwoToneIcon from "@mui/icons-material/FactoryTwoTone";
// import AddTwoToneIcon from "@mui/icons-material/AddTwoTone";
// import ProductionQuantityLimitsTwoToneIcon from "@mui/icons-material/ProductionQuantityLimitsTwoTone";

// import LogOut01Icon from 'src/icons/untitled-ui/duocolor/log-out-01';

// export const useSections = () => {
//   const { t } = useTranslation();

//   const tabsData = useAuthStore((state) => state.user);
//   console.log("tabData", tabsData);

//   // Create a mapping of icon names (as received from the API) to the corresponding MUI icon components
//   const iconMappings = {
//     BusinessTwoToneIcon: <BusinessTwoToneIcon />,
//     WarehouseOutlinedIcon: <WarehouseOutlinedIcon />,
//     StorefrontTwoToneIcon: <StorefrontTwoToneIcon />,
//     StoreMallDirectoryTwoToneIcon: <StoreMallDirectoryTwoToneIcon />,
//     FactoryTwoToneIcon: <FactoryTwoToneIcon />,
//     AddTwoToneIcon: <AddTwoToneIcon />,
//     ProductionQuantityLimitsTwoToneIcon: <ProductionQuantityLimitsTwoToneIcon />,
//   };

//   return useMemo(() => {
//     return [
//       tabsData.map((item) => {
//         // Get the corresponding icon component based on the item.logo value from the mapping
//         const selectedIcon = iconMappings[item.logo] || <BusinessTwoToneIcon />;

//         // If the item.logo is not found in the mappings, you can provide a fallback icon or null
//         // const selectedIcon = iconMappings[item.logo] || <FallbackIcon />;

//         return [
//           {
//             items: [
//               {
//                 title: item.tabname,
//                 icon: <SvgIcon fontSize="small">{selectedIcon}</SvgIcon>,
//                 path: paths.dashboard.index, // Hardcoded single path
//                 items: [
//                   {
//                     title: "View", // Hardcoded "View" item
//                     path: paths.dashboard.view, // Replace this with the actual path for "View"
//                   },
//                   {
//                     title: "Create", // Hardcoded "Create" item
//                     path: paths.dashboard.create, // Replace this with the actual path for "Create"
//                   },
//                 ],
//               },
//             ],
//           },
//           {
//             title: t(tokens.nav.checkout),
//             path: paths.checkout,
//             icon: (
//               <SvgIcon fontSize="small">
//                 {/* Replace this with the actual icon component */}
//                 <LogOut01Icon />
//               </SvgIcon>
//             ),
//           },
//         ]
//       }),

//     ];
//   }, [iconMappings, t, tabsData]);
// };
