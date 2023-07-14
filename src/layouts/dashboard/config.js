import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SvgIcon } from '@mui/material';
import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import LayoutAlt02Icon from 'src/icons/untitled-ui/duocolor/layout-alt-02';
import LogOut01Icon from 'src/icons/untitled-ui/duocolor/log-out-01';
import ReceiptCheckIcon from 'src/icons/untitled-ui/duocolor/receipt-check';
import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
import Upload04Icon from 'src/icons/untitled-ui/duocolor/upload-04';
import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import BuildCircleTwoToneIcon from '@mui/icons-material/BuildCircleTwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import AssignmentTwoToneIcon from '@mui/icons-material/AssignmentTwoTone';
import AccountBalanceTwoToneIcon from "@mui/icons-material/AccountBalanceTwoTone";

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      // {
      //   items: [
      //     {
      //       title: t(tokens.nav.overview),
      //       path: paths.dashboard.index,
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <HomeSmileIcon />
      //         </SvgIcon>
      //       )
      //     },
      //     {
      {
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
          {
            title: t(tokens.nav.products),
            path: paths.dashboard.products.index,
            icon: (
              <SvgIcon fontSize="small">
                <Upload04Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.view),
                path: paths.dashboard.products.view,
              },
              {
                title: t(tokens.nav.create),
                path: paths.dashboard.products.create,
              },
            ],
          },
          {
            title: t(tokens.nav.warehouse),
            path: paths.dashboard.invoices.index,
            icon: (
              <SvgIcon fontSize="small">
                <ReceiptCheckIcon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.view),
                path: paths.dashboard.invoices.details,
              },
              {
                title: t(tokens.nav.create),
                path: paths.dashboard.invoices.index,
              },
            ],
          },
          {
            title: t(tokens.nav.inventory),
            path: paths.dashboard.inventory.index,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingBag03Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.view),
                path: paths.dashboard.inventory.view,
              },
              {
                title: t(tokens.nav.create),
                path: paths.dashboard.inventory.create,
              },
            ],
          },

          {
            title: t(tokens.nav.user),
            path: paths.dashboard.logistics.index,
            icon: (
              <SvgIcon fontSize="small">
                <Users03Icon />
                {/* <Truck01Icon /> */}
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.view),
                path: paths.dashboard.logistics.fleet,
              },
              {
                title: t(tokens.nav.create),
                path: paths.dashboard.logistics.index,
              },
            ],
          },

          {
            title: t(tokens.nav.quotation),
            path: paths.dashboard.quotation.index,
            icon: (
              <SvgIcon fontSize="small">
                <LayoutAlt02Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.view),
                path: paths.dashboard.quotation.view,
              },
              {
                title: t(tokens.nav.create),

                items: [
                  {
                    title: t(tokens.nav.buyer),
                    path: paths.dashboard.quotation.buy,
                  },
                  {
                    title: t(tokens.nav.seller),
                    path: paths.dashboard.quotation.sell,
                  },
                  {
                    title: t(tokens.nav.service),
                    path: paths.dashboard.quotation.service,
                  },
                ],
              },

              // {
              //   title: t(tokens.nav.downloadQuotation),
              //   path: paths.dashboard.quotation.invoice
              // }
            ],
          },
          {
            title: t(tokens.nav.orderList),
            icon: (
              <SvgIcon fontSize="small">
                <InventoryTwoToneIcon />
              </SvgIcon>
            ),
            path: paths.dashboard.orders.index,
            items: [
              {
                title: t(tokens.nav.create),
                path: paths.dashboard.orders.index,
              },
              {
                title: t(tokens.nav.invoices),
                path: paths.dashboard.orders.details,
              },
              // {
              //   title: t(tokens.nav.invoice),
              //   path: paths.dashboard.orders.invoice
              // },
            ],
          },
          {
            title: t(tokens.nav.purchaseorder),
            path: paths.dashboard.purchaseorder.index,
            icon: (
              <SvgIcon fontSize="small">
                <ShoppingCart01Icon />
                {/* <Users03Icon /> */}
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.view),
                path: paths.dashboard.purchaseorder.view,
              },
              {
                title: t(tokens.nav.create),
                path: paths.dashboard.purchaseorder.create,
              },

              // {
              //   title: t(tokens.nav.invoice),
              //   path: paths.dashboard.purchaseorder.invoice
              // },
            ],
          },
          {
            title: t(tokens.nav.services),
            path: paths.dashboard.services.index,
            icon: (
              <SvgIcon fontSize="small">
                <BuildCircleTwoToneIcon />
                {/* <Truck01Icon /> */}
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.workorder),

                items: [
                  {
                    title: t(tokens.nav.view),
                    path: paths.dashboard.services.workorderview,
                  },
                  {
                    title: t(tokens.nav.create),
                    path: paths.dashboard.services.createWorkorder,
                  },

                  // {
                  //   title: t(tokens.nav.amc),
                  //   path: paths.dashboard.services.workorderdownload
                  // },
                ],
              },
              {
                title: t(tokens.nav.addAmc),

                items: [
                  {
                    title: t(tokens.nav.view),
                    path: paths.dashboard.services.AMCview,
                  },
                  {
                    title: t(tokens.nav.create),
                    path: paths.dashboard.services.createAMC,
                  },
                ],
              },
              {
                title: t(tokens.nav.technician),

                items: [
                  {
                    title: t(tokens.nav.view),
                    path: paths.dashboard.services.technicianview,
                  },
                  {
                    title: t(tokens.nav.create),
                    path: paths.dashboard.services.createTechnician,
                  },
                ],
              },
            ],
          },
          {
            title: t(tokens.nav.accounts),
            path: paths.dashboard.accounts,
            icon: (
              <SvgIcon fontSize="small">
                <AccountBalanceTwoToneIcon />
                {/* <Users03Icon /> */}
              </SvgIcon>
            ),
          },
        ],
      },
      // {
      //   subheader: t(tokens.nav.pages),
      //   items: [
      //     {
      //       title: t(tokens.nav.auth),
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <Lock01Icon />
      //         </SvgIcon>
      //       ),
      //       items: [
      //         {
      //           title: t(tokens.nav.login),
      //           items: [
      //             {
      //               title: 'Classic',
      //               path: paths.authDemo.login.classic
      //             },
      //             {
      //               title: 'Modern',
      //               path: paths.authDemo.login.modern
      //             }
      //           ]
      //         },
      //         {
      //           title: t(tokens.nav.register),
      //           items: [
      //             {
      //               title: 'Classic',
      //               path: paths.authDemo.register.classic
      //             },
      //             {
      //               title: 'Modern',
      //               path: paths.authDemo.register.modern
      //             }
      //           ]
      //         },
      //         {
      //           title: t(tokens.nav.forgotPassword),
      //           items: [
      //             {
      //               title: 'Classic',
      //               path: paths.authDemo.forgotPassword.classic
      //             },
      //             {
      //               title: 'Modern',
      //               path: paths.authDemo.forgotPassword.modern
      //             }
      //           ]
      //         },
      //         {
      //           title: t(tokens.nav.resetPassword),
      //           items: [
      //             {
      //               title: 'Classic',
      //               path: paths.authDemo.resetPassword.classic
      //             },
      //             {
      //               title: 'Modern',
      //               path: paths.authDemo.resetPassword.modern
      //             }
      //           ]
      //         },
      //         {
      //           title: t(tokens.nav.verifyCode),
      //           items: [
      //             {
      //               title: 'Classic',
      //               path: paths.authDemo.verifyCode.classic
      //             },
      //             {
      //               title: 'Modern',
      //               path: paths.authDemo.verifyCode.modern
      //             }
      //           ]
      //         }
      //       ]
      //     },
      //     {
      //       title: t(tokens.nav.pricing),
      //       path: paths.pricing,
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <CreditCard01Icon />
      //         </SvgIcon>
      //       )
      //     },
      {
        title: t(tokens.nav.checkout),
        path: paths.checkout,
        icon: (
          <SvgIcon fontSize="small">
            <LogOut01Icon />
          </SvgIcon>
        ),
      },
      //     {
      //       title: t(tokens.nav.contact),
      //       path: paths.contact,
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <Mail04Icon />
      //         </SvgIcon>
      //       )
      //     },
      //     {
      //       title: t(tokens.nav.error),
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <XSquareIcon />
      //         </SvgIcon>
      //       ),
      //       items: [
      //         {
      //           title: '401',
      //           path: paths['401']
      //         },
      //         {
      //           title: '404',
      //           path: paths['404']
      //         },
      //         {
      //           title: '500',
      //           path: paths['500']
      //         }
      //       ]
      //     }
      //   ]
      // },
      // {
      //   subheader: 'Misc',
      //   items: [
      //     {
      //       title: 'Level 0',
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <AlignLeft02Icon />
      //         </SvgIcon>
      //       ),
      //       items: [
      //         {
      //           title: 'Level 1a',
      //           items: [
      //             {
      //               title: 'Level 2a',
      //               items: [
      //                 {
      //                   title: 'Level 3a'
      //                 },
      //                 {
      //                   title: 'Level 3b',
      //                   disabled: true
      //                 }
      //               ]
      //             },
      //             {
      //               title: 'Level 2b'
      //             }
      //           ]
      //         },
      //         {
      //           title: 'Level 1b'
      //         }
      //       ]
      //     },
      //     {
      //       title: 'Disabled',
      //       disabled: true,
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <XSquareIcon />
      //         </SvgIcon>
      //       )
      //     },
      //     {
      //       title: 'Label',
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <File01Icon />
      //         </SvgIcon>
      //       ),
      //       label: (
      //         <Chip
      //           color="primary"
      //           label="New"
      //           size="small"
      //         />
      //       )
      //     },
      //     {
      //       title: 'Blank',
      //       path: paths.dashboard.blank,
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <File01Icon />
      //         </SvgIcon>
      //       )
      //     },
      //     {
      //       title: 'External Link',
      //       path: 'https://devias.io',
      //       external: true,
      //       icon: (
      //         <SvgIcon fontSize="small">
      //           <File01Icon />
      //         </SvgIcon>
      //       )
      //     }
      //   ]
      // }
    ];
  }, [t]);
};
