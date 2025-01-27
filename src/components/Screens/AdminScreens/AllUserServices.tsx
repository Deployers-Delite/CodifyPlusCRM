import {
  Grid,
  Container,
  Text,
  Paper,
  Title,
  Loader,
  Center,
} from "@mantine/core";
import { useEffect, useState } from "react";
import UserService from "../../../services/user.service";
import EventBus from "../../../common/EventBus";
import { AllServicesListFragment } from "../../Fragments/AllServicesFragments/AllServicesListFragment";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AllUserServices() {
  const { user: currentUser } = useSelector((state: any) => state.auth);
  const userId = window.location.pathname.split("/")[3];
  const [Stats, setStats] = useState({
    completedServices: [
      {
        name: "",
        icon: "",
        status: "",
        serviceId: "",
        username: "",
      },
    ],
    pendingServices: [],
    processServices: [
      {
        name: "",
        icon: "",
        status: "",
        serviceId: "",
        username: "",
      },
    ],
  });
  const [fetchedUser, setFetchedUser] = useState<any>();
  const [isLoading, setIsLoading] = useState(true); // New state variable for loading status

  useEffect(() => {
    setIsLoading(true);

    let apiCall = UserService.getUserStatsForAdmin;

    apiCall(userId)
      .then((response) => {
        setFetchedUser(response.data);
        // Process the response data
        let completedServicesData: any = [];
        let underProcessServicesData: any = [];

        for (var i = 0; i < response.data.completedServices.length; i++) {
          completedServicesData.push({
            name: response.data.completedServices[i].name,
            icon: "C",
            status: "Completed",
            serviceId: response.data.completedServices[i].serviceId.toString(),
            username: response.data.completedServices[i].username,
          });
        }

        for (var j = 0; j < response.data.processServices.length; j++) {
          underProcessServicesData.push({
            name: response.data.processServices[j].name,
            icon: "P",
            status: "Under Process",
            serviceId: response.data.processServices[j].serviceId.toString(),
            username: response.data.processServices[j].username,
          });
        }

        setStats({
          ...response.data,
          completedServices: completedServicesData,
          processServices: underProcessServicesData,
        });
        setIsLoading(false); // Set loading status to false after the data is fetched
      })
      .catch((error) => {
        const _Stats =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setStats(_Stats);

        if (error.response && error.response.status === 401) {
          //@ts-ignore
          EventBus.dispatch("logout");
        }

        setIsLoading(false); // Set loading status to false in case of an error
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return (
    <Container size="auto" my="md">
      {isLoading ? ( // Conditional rendering based on the loading status
        <Center>
          <Loader variant="bars" />
        </Center>
      ) : (
        <>
          <Title
            align="center"
            sx={(theme) => ({
              fontWeight: 900,
            })}
          >
            {`All Services of ${fetchedUser.username}`}
          </Title>
          <Grid mt={30}>
            <Grid.Col xs={12}>
              <Paper shadow="md" p={20} withBorder>
                <Text size={18} mb={10} ml={10}>
                  Under Process Services:
                </Text>
                <AllServicesListFragment data={Stats.processServices} />
              </Paper>
            </Grid.Col>
            <Grid.Col xs={12}>
              <Paper shadow="md" p={20} withBorder>
                <Text size={18} mb={10} ml={10}>
                  Completed Services:
                </Text>
                <AllServicesListFragment data={Stats.completedServices} />
              </Paper>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Container>
  );
}
