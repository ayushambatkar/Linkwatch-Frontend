import { AppConstants } from '../config/appConstants';

export function ContactPage() {
  return (
    <section className="panel contact-panel">
      <h2>Contact</h2>
      <p className="muted">{AppConstants.CONTACT_INTRO}</p>
      <img
        className="contact-gif"
        src={AppConstants.CONTACT_GIF_URL}
        alt="Funny cat animation"
        loading="lazy"
      />
      <div className="contact-grid">
        {AppConstants.CONTACT_CARDS.map((card) => (
          <article className="contact-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.value}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
