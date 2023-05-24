import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  SimpleGrid,
  Title,
  Text,
  Paper,
  Badge,
  createStyles,
  Card,
  Modal,
} from "@mantine/core";
import moment from "moment";
import UserService from "../../../services/user.service";
import { ServiceStatusInfoTrackService } from "../../Fragments/TrackServiceFragments/ServiceStatusInfoTrackService";
import { ServiceControlsFragment } from "../../Fragments/TrackServiceFragments/ServiceControlsFragment";
import { useDisclosure } from "@mantine/hooks";
import { AddNoteFragment } from "../../Fragments/TrackServiceFragments/AddNoteFragment";
import { AddTrackPointFragment } from "../../Fragments/TrackServiceFragments/AddTrackPointFragment";
import { ServiceStatusTimelineTrack } from "../../Fragments/TrackServiceFragments/ServiceStatusTimelineTrack";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },
}));

export function TrackService() {
  const [opened_addNote, { open: open_addNote, close: close_addNote }] =
    useDisclosure(false);

  const [opened_addTrack, { open: open_addTrack, close: close_addTrack }] =
    useDisclosure(false);

  const { classes } = useStyles();

  const [info, setInfo] = useState({
    cost: "",
    status: "",
    name: "",
    duration: "",
    notes: [
      {
        information: "",
        private: false,
        createdAt: "",
      },
    ],
    assignedTo: {
      userId: "",
      username: "",
      email: "",
    },
    assignedFor: {
      userId: "",
      username: "",
      email: "",
    },
    pathway: [
      {
        startedAt: moment().utcOffset("+5:30").format("DD/MM/YYYY"),
        description: "",
        title: "",
        status: true,
        _id: "",
      },
    ],
  });

  const serviceId = window.location.pathname.split("/")[3];

  useEffect(() => {
    UserService.getServiceInfo(serviceId).then(
      (response) => {
        setInfo(response.data);
      },
      (error) => {
        const _Stats =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setInfo(_Stats);

        if (error.response && error.response.status === 401) {
          //@ts-ignore
          EventBus.dispatch("logout");
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const serviceInfoData = {
    cost: info.cost,
    status: info.status,
    name: info.name,
    duration: info.duration,
    assignedTo: info.assignedTo,
    assignedFor: info.assignedFor,
  };

  const Notes = info.notes.map((note) => {
    return (
      <Grid.Col span={12}>
        <Paper shadow="sm" p="sm" withBorder>
          <Badge>{note.createdAt.split("T")[0]}</Badge>
          <Text mt={5}>{note.information}</Text>
        </Paper>
      </Grid.Col>
    );
  });

  return (
    <>
      <Modal
        opened={opened_addNote}
        onClose={close_addNote}
        title="Add Note"
        centered
      >
        <AddNoteFragment
          data={{ serviceId, closeModal: close_addNote, setInfo }}
        />
      </Modal>
      <Modal
        opened={opened_addTrack}
        onClose={close_addTrack}
        title=""
        fullScreen
        centered
      >
        <AddTrackPointFragment
          data={{ serviceId, closeModal: close_addTrack, setInfo }}
        />
      </Modal>
      <Title
        mb={30}
        align="center"
        sx={(theme) => ({
          fontWeight: 900,
        })}
      >
        Track Service
      </Title>
      <Container>
        <SimpleGrid
          cols={2}
          spacing="md"
          mb="md"
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
        >
          <ServiceStatusTimelineTrack data={info.pathway} serviceId={serviceId} setInfo={setInfo} />
          <Grid gutter="md">
            <Grid.Col>
              <ServiceStatusInfoTrackService data={serviceInfoData} />
            </Grid.Col>
            <Grid.Col span={12}>
              <ServiceControlsFragment data={{ openModalAddNote: open_addNote, openModalAddTrack: open_addTrack }} />
            </Grid.Col>
          </Grid>
        </SimpleGrid>
        <Card withBorder radius="md" className={classes.card}>
          <Grid gutter="md" className={classes.card}>
            <Grid.Col span={12}>
              <Text>Notes</Text>
            </Grid.Col>
            {Notes.length === 0 ? <>No Notes Found!</> : Notes}
          </Grid>
        </Card>
      </Container>
    </>
  );
}
