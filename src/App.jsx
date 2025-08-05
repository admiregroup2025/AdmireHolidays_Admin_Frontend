import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/contexts/theme-context";

import Layout from "./routes/layout";
import DashboardPage from "./routes/dashboard/page";
import LoginPage from "./loginPage/page";
import UnauthorizedPage from "./unauthorizedPage/page";
import ProtectedRoute from "./components/ProtectedRoute";


// all routes are imported here
import CreateItineriesPage from "./routes/create_itinearies/page";
import ItinerariesListPage from "./routes/itinerarys_list/page";
import ItineraryDetailsPage from "./routes/itinerarys_list/newPage";
import CustomerGallery from "./routes/customer_gallery/page";
import TermsAndCondition from "./routes/terms_and_condition/page";
import PaymentMode from "./routes/payment_mode/page";
import CancellationPolicy from "./routes/cancellation_policy/page";
import HeroVideoUpload from "./routes/hero_video/page";
import UploadVideoTestimonial from "./routes/upload_video_testiminal/page";
import CreateBlog from "./routes/create_blog/page";
import BlogList from "./routes/blog_list/page";
import UsersList from "./routes/users_list/page";
import Suggestions from "./routes/leads/suggetion/page";
import Subscribe from "./routes/leads/subscribe/page";
import ContactUs from "./routes/leads/constact_us/page";
import PlanYourJourney from "./routes/leads/plan_your_journey/page";
import CreateCity from "./routes/create_city/page";
import DestinationList from "./routes/destination_list/page";
import CreateDestination from "./routes/create_destination/page";
import AddUser from "./routes/add_user/page";
import ImageGallery from "./routes/image_gallery/page";

// stores
import useAuthStore from "./stores/authStore";
import ViewImageGallery from "./routes/view_image_gallery/page";


function App() {

    const checkAuthOnLoad = useAuthStore((state) => state.checkAuthOnLoad);

    useEffect(() => {
        checkAuthOnLoad();
    }, [checkAuthOnLoad]);


    const router = createBrowserRouter([
        {
            // Public routes that do not require authentication
            path: "/login",
            element: <LoginPage />,
        },
        {
            path: "/unauthorized",
            element: <UnauthorizedPage />,
        },
        {
            // All routes nested under this element will be protected
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/",
                    element: <Layout />,
                    children: [
                        {
                            index: true,
                            element: <DashboardPage />,
                        },
                        {
                            path: "create_itinerary",
                            element: <CreateItineriesPage />,
                        },
                        {
                            path: "itinerary_list",
                            element: <ItinerariesListPage />,
                        },
                        {
                           path: "itinerary_list/itinerary_details/:id",
                           element: <ItineraryDetailsPage />,
                        },
                        {
                            path: "image_gallery",
                            element: <ImageGallery />,
                        },
                        {
                            path: "view_image_gallery",
                            element: <ViewImageGallery />,
                        },

                        {
                            path: "customer_gallery",
                            element: <CustomerGallery />,
                        },
                        {
                            path: "terms_and_conditions",
                            element: <TermsAndCondition />,
                        },
                        {
                            path: "payment_mode",
                            element: <PaymentMode />,
                        },
                        {
                            path: "cancellation_policy",
                            element: <CancellationPolicy />,
                        },
                        {
                            path: "hero_video",
                            element: <HeroVideoUpload />,
                        },
                        {
                            path: "video_testimonials_upload",
                            element: <UploadVideoTestimonial />,
                        },
                        {
                            path: "create_blog",
                            element: <CreateBlog />,
                        },
                        {
                            path: "create_blog/:id",
                            element: <CreateBlog />,
                        },
                        {
                            path: "blogs_list",
                            element: <BlogList />,
                        },
                        {
                            path: "users_list",
                            element: <UsersList />,
                        },
                        {
                            path: "suggestions",
                            element: <Suggestions />,
                        },
                        {
                            path: "subscribe",
                            element: <Subscribe />,
                        },
                        {
                            path: "contact_list",
                            element: <ContactUs />,
                        },
                        {
                            path: "plan_journey_list",
                            element: <PlanYourJourney />,
                        },
                        {
                            path: "create_city",
                            element: <CreateCity />,
                        },
                        {
                            path: "destination_list",
                            element: <DestinationList />,
                        },

                        {
                            // This nested route has specific role-based protection
                            element: <ProtectedRoute allowedRoles={['admin']} />,
                            children: [
                                {
                                    path: "create_destination",
                                    element: <CreateDestination />,
                                },
                                {
                                    path: "add_user",
                                    element: <AddUser />,
                                },
                            ]
                        }
                    ],
                },
            ]
        },
    ]);

    return (
        <ThemeProvider storageKey="theme">
            <RouterProvider router={router} />
        </ThemeProvider>
    );
}

export default App;