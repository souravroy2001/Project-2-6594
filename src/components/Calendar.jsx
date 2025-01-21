import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import axios from "axios"; // Axios for API requests
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const API_URL =
  "https://masai-hackathon-2025-default-rtdb.firebaseio.com/event.json";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    task: "",
    description: "",
    start: "",
    end: "",
    priority: "",
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isEventModalOpen,
    onOpen: onEventModalOpen,
    onClose: onEventModalClose,
  } = useDisclosure();
  const toast = useToast();

  // Fetch events from Firebase when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL);
        const data = response.data;

        if (data) {
          const loadedEvents = Object.keys(data).map((key) => ({
            id: key, // Firebase unique ID
            ...data[key],
            start: new Date(data[key].start),
            end: new Date(data[key].end),
          }));
          setEvents(loadedEvents);
        }
      } catch (error) {
        toast({
          title: "Error fetching events",
          description: "Unable to load events from Firebase.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchEvents();
  }, [toast]);

  // Handle adding a new event
  const handleAddEvent = async () => {
    if (
      !newEvent.task ||
      !newEvent.start ||
      !newEvent.end ||
      !newEvent.priority
    ) {
      toast({
        title: "Error",
        description: "Please fill in all the fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedEvent = {
      ...newEvent,
      start: new Date(newEvent.start).toISOString(),
      end: new Date(newEvent.end).toISOString(),
    };

    try {
      const response = await axios.post(API_URL, formattedEvent);
      const data = response.data;

      setEvents([
        ...events,
        {
          id: data.name, // Firebase unique ID
          ...formattedEvent,
          start: new Date(formattedEvent.start),
          end: new Date(formattedEvent.end),
        },
      ]);

      setNewEvent({
        task: "",
        description: "",
        start: "",
        end: "",
        priority: "",
      });
      onClose();

      toast({
        title: "Event Added",
        description: "Your event has been added to the calendar.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add event to Firebase.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Handle clicking on a calendar event
  const handleEventClick = (event) => {
    setSelectedEvent(event);
    onEventModalOpen();
  };

  return (
    <>
      <Box display="flex" mt={100}>
        {/* Sidebar for adding events */}
        <Box width="25%" padding="20px" borderRight="1px solid #ddd">
          <Button onClick={onOpen} colorScheme="teal" marginBottom="20px">
            Add Event
          </Button>
          <h3>Upcoming Events</h3>
          {events.length ? (
            events.map((event) => (
              <Box
                key={event.id}
                padding="10px"
                border="1px solid #ddd"
                borderRadius="5px"
                marginBottom="10px"
              >
                <strong>{event.task}</strong>
                <p>{event.description}</p>
              </Box>
            ))
          ) : (
            <p>No upcoming events</p>
          )}
        </Box>

        {/* Calendar */}
        <Box width="75%" padding="20px">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "600px" }}
            onSelectEvent={handleEventClick}
          />
        </Box>
      </Box>

      {/* Modal for adding a new event */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              placeholder="Task Title"
              value={newEvent.task}
              onChange={(e) =>
                setNewEvent({ ...newEvent, task: e.target.value })
              }
              marginBottom="10px"
            />
            <Input
              placeholder="Description"
              value={newEvent.description}
              onChange={(e) =>
                setNewEvent({ ...newEvent, description: e.target.value })
              }
              marginBottom="10px"
            />
            <Input
              placeholder="Priority (e.g., High, Medium, Low)"
              value={newEvent.priority}
              onChange={(e) =>
                setNewEvent({ ...newEvent, priority: e.target.value })
              }
              marginBottom="10px"
            />
            <Input
              type="datetime-local"
              placeholder="Start Date"
              value={newEvent.start}
              onChange={(e) =>
                setNewEvent({ ...newEvent, start: e.target.value })
              }
              marginBottom="10px"
            />
            <Input
              type="datetime-local"
              placeholder="End Date"
              value={newEvent.end}
              onChange={(e) =>
                setNewEvent({ ...newEvent, end: e.target.value })
              }
              marginBottom="10px"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handleAddEvent}>
              Add Event
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for viewing an event's details */}
      {selectedEvent && (
        <Modal isOpen={isEventModalOpen} onClose={onEventModalClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Event Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <p>
                <strong>Task:</strong> {selectedEvent.task}
              </p>
              <p>
                <strong>Description:</strong> {selectedEvent.description}
              </p>
              <p>
                <strong>Priority:</strong> {selectedEvent.priority}
              </p>
              <p>
                <strong>Start:</strong>{" "}
                {moment(selectedEvent.start).format("MMMM Do YYYY, h:mm a")}
              </p>
              <p>
                <strong>End:</strong>{" "}
                {moment(selectedEvent.end).format("MMMM Do YYYY, h:mm a")}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onEventModalClose} colorScheme="blue">
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default CalendarComponent;
