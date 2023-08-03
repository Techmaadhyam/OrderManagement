import { lazy, Suspense } from "react";
import { Outlet, useParams } from "react-router-dom";
import { Layout as DashboardLayout } from "src/layouts/dashboard";

// Assuming your DynamicCreate and DynamicView components are correctly exported
import IndexPage from  "src/pages/dashboard/index";
import DynamicCreate from "src/pages/dashboard/dynamic/create";
import DynamicView from "src/pages/dashboard/dynamic/view";

//other imports
// Social (do not delete)
const SocialProfilePage = lazy(() =>
  import("src/pages/dashboard/social/profile")
);
const SocialPasswordPage = lazy(() =>
  import("src/pages/dashboard/social/changePassword")
);

const DynamicRender = ({ pageType }) => {
  const { id } = useParams(); // Get the id parameter from the URL
console.log(id)
  // Determine which component to render based on the id and pageType
  let ComponentToRender;

  if (pageType === "create") {
    ComponentToRender = DynamicCreate;
  } else if (pageType === "view") {
    ComponentToRender = DynamicView;
  } else {
    // If pageType is neither "create" nor "view", you can handle it as needed
    // For example, render a default component or a not found component
    ComponentToRender = IndexPage;
  }

  // Render the selected component
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComponentToRender />
    </Suspense>
  );
};


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
        path: "create/:id",
        element: <DynamicRender pageType="create" />,
      },
      {
        path: "view/:id",
        element: <DynamicRender pageType="view" />,
      },
      {
        path: "social",
        children: [
          {
            path: "profile",
            element: <SocialProfilePage />,
          },
          {
            path: "password",
            element: <SocialPasswordPage />,
          },
        ],
      },
    ],
  },
];

// Example mapping function to map id to components
function getComponentFromId(id) {
  // Assuming you have a predefined mapping of id to components
  switch (id) {
    case "create":
      return DynamicCreate;
    case "view":
      return DynamicView;
    // Add more cases for other components
    default:
      // Return a default component or a not found component if the id doesn't match any cases
      return IndexPage;
  }
}
