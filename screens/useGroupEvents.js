// Custom hook for fetching and filtering events
const useGroupEvents = (group) => {
  const { events } = useContext(EventContext); // Use EventContext
  const [groupEvents, setGroupEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // Check if events is defined before calling filter
      const filteredEvents = events
        ? events.filter((event) => event.group === group)
        : [];

      console.log(filteredEvents); // Log filtered events

      setGroupEvents(filteredEvents);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [events, group]);

  return { groupEvents, loading, error };
};
