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

function BookingsPage({ username, onBack }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [view, setView] = useState('upcoming'); // 'upcoming' | 'past'

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      setError('');
      try {
        const resp = await fetch(`/getAllEventsPerUser?username=${encodeURIComponent(username)}`);
        if (!resp.ok) {
          throw new Error(`${resp.status} ${resp.statusText}`);
        }
        const json = await resp.json();
        if (json == null) {
          setError('No bookings found for this user.');
          setData(null);
        } else {
          setData(json);
        }
      } catch (err) {
        setError(`Unable to load bookings: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    if (username) fetchBookings();
  }, [username]);

  if (!username) return <div className="card">No user specified.</div>;

  const upcoming = data?.futureEventDetailsList ?? [];
  const past = data?.pastEventDetailsList ?? [];

  const listToShow = view === 'upcoming' ? upcoming : past;

  return (
    <div className="card bookings-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Bookings</h2>
        <button className="secondary-button" onClick={onBack}>Back</button>
      </div>

      <div style={{ marginTop: 12 }} className="card-header">
        <div className="toggle-buttons">
          <button
            type="button"
            className={view === 'upcoming' ? 'active' : ''}
            onClick={() => setView('upcoming')}
          >
            Upcoming Events
          </button>
          <button
            type="button"
            className={view === 'past' ? 'active' : ''}
            onClick={() => setView('past')}
          >
            Past Bookings
          </button>
        </div>
      </div>

      {loading && <div className="loader">Loading bookings...</div>}
      {error && <div className="message error">{error}</div>}

      {!loading && !error && (
        <div style={{ marginTop: 18, margin: 10 }}>
          {listToShow.length === 0 ? (
            <div className="loader">No {view === 'upcoming' ? 'upcoming events' : 'past bookings'} found.</div>
          ) : (
            <div className="events-grid">
              {listToShow.map((event, idx) => (
                <article className="event-card" key={event.eventId}>
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
                    <span className="event-tag">{view === 'upcoming' ? 'Upcoming' : 'Past'}</span>
                    <h3>{event.eventName}</h3>
                    <p className="event-meta">{formatEventDate(event.eventDate, event.eventTime)}</p>
                    {event.eventDescription ? (
                      <p className="event-description">{event.eventDescription}</p>
                    ) : null}
                    <p className="event-duration">Duration: {event.eventDuration ?? 'N/A'} min</p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;
