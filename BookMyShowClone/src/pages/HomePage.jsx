import { useEffect, useState } from 'react';

function formatEventDate(eventDate, eventTime) {
  if (!eventDate || !eventTime) return 'TBA';
  try {
    const date = new Date(`${eventDate}T${eventTime}`);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    }).format(date);
  } catch {
    return `${eventDate} ${eventTime}`;
  }
}

function HomePage({ currentUser, onEventClick, notice, noticeType, onNavigateToAuth }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      setError('');

      try {
        const response = await fetch('https://spring-boot-tutorial-8yy3.onrender.com/getFutureEventsList');
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(`Could not load events: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return (
    <div className="home-page">
      {notice && <div className={`message ${noticeType}`}>{notice}</div>}
      {error && <div className="message error">{error}</div>}

      <div className="events-grid">
        {loading ? (
          <div className="loader">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="loader">No events available right now.</div>
        ) : (
          events.map((event, index) => (
            <article className="event-card" key={event.eventId} onClick={() => onEventClick(event)}>
              <div className="event-image-wrapper">
                {event.imageUrl ? (
                  <img
                    className="event-image"
                    src={event.imageUrl}
                    alt={event.eventName}
                  />
                ) : (
                  <div className="event-image-fallback">No image available</div>
                )}
              </div>
              <div className="event-card-body">
                <span className="event-tag">Upcoming</span>
                <h3>{event.eventName}</h3>
                <p className="event-meta">{formatEventDate(event.eventDate, event.eventTime)}</p>
                <p className="event-description">{event.eventDescription || 'No description provided.'}</p>
                <p className="event-duration">Duration: {event.eventDuration} min</p>
                <button type="button" className="card-button">
                  {currentUser ? 'Register Now' : 'Login to continue'}
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;
