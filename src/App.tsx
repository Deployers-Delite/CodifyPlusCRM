import React, { useEffect, useState } from "react";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
  Loader,
  Center,
} from "@mantine/core";
import { useHotkeys, useLocalStorage } from "@mantine/hooks";
import { Route, Routes, useNavigate } from "react-router-dom";
import links from "./components/data/links";
import footerLinks from "./components/data/footerLinks";
import { NovuProvider } from "@novu/notification-center";
import { useSelector } from "react-redux";
import { NOVU_APP_IDENTIFIER, ONESIGNAL_APP_ID } from "./common/Constants";
import OneSignal from "react-onesignal";
const Navbar = React.lazy(() =>
  import("./components/Fragments/Navbar/Navbar").then((module) => ({
    default: module.Navbar,
  }))
);
const Footer = React.lazy(() =>
  import("./components/Fragments/Footer/Footer").then((module) => ({
    default: module.Footer,
  }))
);
const OurProcess = React.lazy(() => import("./components/Screens/OurProcess"));
const OurServices = React.lazy(
  () => import("./components/Screens/OurServices")
);
const Login = React.lazy(() =>
  import("./components/Screens/Login").then((module) => ({
    default: module.Login,
  }))
);
const Register = React.lazy(() =>
  import("./components/Screens/Register").then((module) => ({
    default: module.Register,
  }))
);
const Dashboard = React.lazy(() => import("./components/Screens/Dashboard"));
const DashboardHome = React.lazy(
  () => import("./components/Screens/DashboardHome")
);
const NotificationsPage = React.lazy(() =>
  import("./components/Screens/Notifications").then((module) => ({
    default: module.NotificationsPage,
  }))
);
const Notifications = React.lazy(() =>
  import("@mantine/notifications").then((module) => ({
    default: module.Notifications,
  }))
);
const Profile = React.lazy(() => import("./components/Screens/Profile"));
const EmptyPage = React.lazy(() =>
  import("./components/Screens/EmptyPage").then((module) => ({
    default: module.EmptyPage,
  }))
);
const AllServices = React.lazy(
  () => import("./components/Screens/AllServices")
);
const ServiceStatus = React.lazy(
  () => import("./components/Screens/ServiceStatus")
);
const AllUsers = React.lazy(() =>
  import("./components/Screens/AdminScreens/AllUsers").then((module) => ({
    default: module.AllUsers,
  }))
);
const AddUser = React.lazy(() =>
  import("./components/Screens/AdminScreens/AddUser").then((module) => ({
    default: module.AddUser,
  }))
);
const ManageServices = React.lazy(() =>
  import("./components/Screens/AdminScreens/ManageServices").then((module) => ({
    default: module.ManageServices,
  }))
);
const AddService = React.lazy(
  () => import("./components/Screens/AdminScreens/AddService")
);
const TrackService = React.lazy(() =>
  import("./components/Screens/AdminScreens/TrackService").then((module) => ({
    default: module.TrackService,
  }))
);
const AllUserServices = React.lazy(
  () => import("./components/Screens/AdminScreens/AllUserServices")
);
const ChangePassword = React.lazy(() =>
  import("./components/Screens/ChangePassword").then((module) => ({
    default: module.ChangePassword,
  }))
);
const ManageServicesMod = React.lazy(() =>
  import("./components/Screens/ModeratorScreens/ManageServicesMod").then(
    (module) => ({
      default: module.ManageServicesMod,
    })
  )
);
const TrackServiceMod = React.lazy(() =>
  import("./components/Screens/ModeratorScreens/TrackServiceMod").then(
    (module) => ({
      default: module.TrackServiceMod,
    })
  )
);
const ChatPage = React.lazy(() =>
  import("./components/Screens/ChatPage").then((module) => ({
    default: module.ChatPage,
  }))
);
const Home = React.lazy(() => import("./components/Screens/Home"));
const GSTCalculator = React.lazy(
  () => import("./components/Screens/GSTCalculator")
);
const ContactUs = React.lazy(() =>
  import("./components/Screens/ContactUs").then((module) => ({
    default: module.ContactUs,
  }))
);
const Offline = React.lazy(() =>
  import("./components/Screens/Offline").then((module) => ({
    default: module.Offline,
  }))
);

export async function runOneSignal() {
  await OneSignal.init({
    appId: ONESIGNAL_APP_ID!,
    allowLocalhostAsSecureOrigin: true,
  });
  OneSignal.Notifications.setDefaultUrl(
    "https://dashboard.codifyplus.com/dashboard/notifications"
  );
  // OneSignal.Slidedown.promptPush();
}

export default function App() {
  const [enableFooter, setEnableFooter] = React.useState(true);
  const { user: currentUser } = useSelector((state: any) => state.auth);
  const navigate = useNavigate();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: "light",
    getInitialValueInEffect: true,
  });
  const [networkStatus, setNetworkStatus] = useState(() => {
    if (navigator.onLine) {
      console.log("Connected to network.");
      return true;
    } else {
      return false;
    }
  });

  useEffect(() => {
    window.ononline = (e) => {
      console.log("Connected to network.");
      setNetworkStatus(true);
    };
    window.onoffline = (e) => {
      console.log("Network connection lost.");
      setNetworkStatus(false);
      navigate("/offline");
    };
    runOneSignal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [networkStatus]);

  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  useHotkeys([["mod+J", () => toggleColorScheme()]]);

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        theme={{
          colorScheme,
          fontFamily: "Mulish, sans-serif",
          primaryColor: "yellow",
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Notifications />
        <NovuProvider
          subscriberId={currentUser?.username}
          applicationIdentifier={NOVU_APP_IDENTIFIER!}
        >
          <Navbar links={links.links} />
          <Routes>
            <Route
              path="/"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <Home />
                </React.Suspense>
              }
            />
            <Route
              index
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <Home />
                </React.Suspense>
              }
            />
            <Route
              path="gst-calculator"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <GSTCalculator />
                </React.Suspense>
              }
            />
            <Route
              path="contact-us"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <ContactUs />
                </React.Suspense>
              }
            />
            <Route
              path="our-process"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <OurProcess />
                </React.Suspense>
              }
            />
            <Route
              path="our-services"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <OurServices />
                </React.Suspense>
              }
            />
            <Route
              path="offline"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <Offline />
                </React.Suspense>
              }
            />
            <Route
              path="login"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <Login />
                </React.Suspense>
              }
            />
            <Route
              path="register"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <Register />
                </React.Suspense>
              }
            />
            <Route
              path="*"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <EmptyPage />
                </React.Suspense>
              }
            />
            <Route
              path="dashboard"
              element={
                <React.Suspense
                  fallback={
                    <>
                      <Center>
                        <Loader variant="bars" />
                      </Center>
                    </>
                  }
                >
                  <Dashboard setEnableFooter={setEnableFooter} />
                </React.Suspense>
              }
            >
              <Route
                path="home"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <DashboardHome />
                  </React.Suspense>
                }
              />
              <Route
                path="notifications"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <NotificationsPage />
                  </React.Suspense>
                }
              />
              <Route
                path="chat"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <ChatPage />
                  </React.Suspense>
                }
              />
              <Route
                path="profile"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <Profile />
                  </React.Suspense>
                }
              />
              <Route
                path="allservices"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <AllServices />
                  </React.Suspense>
                }
              />
              <Route
                path="all-user-services"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <AllUserServices />
                  </React.Suspense>
                }
              >
                <Route
                  path="*"
                  element={
                    <React.Suspense
                      fallback={
                        <>
                          <Center>
                            <Loader variant="bars" />
                          </Center>
                        </>
                      }
                    >
                      <AllUserServices />
                    </React.Suspense>
                  }
                />
              </Route>
              <Route
                path="changepassword"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <ChangePassword />
                  </React.Suspense>
                }
              />
              <Route
                path="servicestatus"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <ServiceStatus />
                  </React.Suspense>
                }
              >
                <Route
                  path="*"
                  element={
                    <React.Suspense
                      fallback={
                        <>
                          <Center>
                            <Loader variant="bars" />
                          </Center>
                        </>
                      }
                    >
                      <ServiceStatus />
                    </React.Suspense>
                  }
                />
              </Route>
              <Route
                path="mod/manageservices"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <ManageServicesMod />
                  </React.Suspense>
                }
              />
              <Route
                path="mod/track"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <TrackServiceMod />
                  </React.Suspense>
                }
              >
                <Route
                  path="*"
                  element={
                    <React.Suspense
                      fallback={
                        <>
                          <Center>
                            <Loader variant="bars" />
                          </Center>
                        </>
                      }
                    >
                      <TrackServiceMod />
                    </React.Suspense>
                  }
                />
              </Route>
              <Route
                path="allusers"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <AllUsers />
                  </React.Suspense>
                }
              ></Route>
              <Route
                path="adduser"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <AddUser />
                  </React.Suspense>
                }
              ></Route>
              <Route
                path="manageservices"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <ManageServices />
                  </React.Suspense>
                }
              ></Route>
              <Route
                path="addservice"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <AddService />
                  </React.Suspense>
                }
              ></Route>
              <Route
                path="track"
                element={
                  <React.Suspense
                    fallback={
                      <>
                        <Center>
                          <Loader variant="bars" />
                        </Center>
                      </>
                    }
                  >
                    <TrackService />
                  </React.Suspense>
                }
              >
                <Route
                  path="*"
                  element={
                    <React.Suspense
                      fallback={
                        <>
                          <Center>
                            <Loader variant="bars" />
                          </Center>
                        </>
                      }
                    >
                      <TrackService />
                    </React.Suspense>
                  }
                />
              </Route>
            </Route>
          </Routes>
          {!enableFooter ? <></> : <Footer data={footerLinks.data} />}
        </NovuProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}
