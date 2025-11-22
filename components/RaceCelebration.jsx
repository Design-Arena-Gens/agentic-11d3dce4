export function RaceCelebration({ podium, onPlayAgain }) {
  if (podium.length === 0) {
    return null;
  }

  const [gold, silver, bronze] = podium;

  return (
    <section className="celebration">
      <div className="celebration__header">
        <span role="img" aria-hidden>
          🎉
        </span>{" "}
        Victory Lap Time!
      </div>
      <div className="celebration__podium">
        {silver && (
          <div className="celebration__step celebration__step--silver">
            <div className="celebration__medal">🥈</div>
            <div className="celebration__name">{silver.name}</div>
            <div className="celebration__blurb">{silver.lore}</div>
          </div>
        )}
        {gold && (
          <div className="celebration__step celebration__step--gold">
            <div className="celebration__medal">🥇</div>
            <div className="celebration__name">{gold.name}</div>
            <div className="celebration__blurb">{gold.lore}</div>
          </div>
        )}
        {bronze && (
          <div className="celebration__step celebration__step--bronze">
            <div className="celebration__medal">🥉</div>
            <div className="celebration__name">{bronze.name}</div>
            <div className="celebration__blurb">{bronze.lore}</div>
          </div>
        )}
      </div>
      <button type="button" className="celebration__play" onClick={onPlayAgain}>
        Start Another Race
      </button>

      <style jsx>{`
        .celebration {
          background: linear-gradient(135deg, rgba(255, 111, 97, 0.16), rgba(76, 201, 240, 0.16));
          border-radius: 32px;
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 24px;
          align-items: center;
          text-align: center;
        }

        .celebration__header {
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--primary-dark);
          text-shadow: 0 4px 12px rgba(255, 111, 97, 0.3);
        }

        .celebration__podium {
          display: flex;
          gap: 16px;
          width: 100%;
          justify-content: center;
          align-items: flex-end;
          flex-wrap: wrap;
        }

        .celebration__step {
          flex: 1 1 180px;
          max-width: 220px;
          background: var(--surface);
          border-radius: 24px 24px 12px 12px;
          padding: 22px 18px;
          box-shadow: 0 16px 30px rgba(31, 43, 77, 0.12);
        }

        .celebration__step--gold {
          transform: translateY(-20px);
        }

        .celebration__step--silver {
          transform: translateY(-10px);
        }

        .celebration__medal {
          font-size: 2rem;
        }

        .celebration__name {
          font-weight: 800;
          font-size: 1.2rem;
          color: var(--text);
          margin-top: 8px;
        }

        .celebration__blurb {
          color: var(--muted);
          font-size: 0.9rem;
          margin-top: 6px;
          line-height: 1.4;
        }

        .celebration__play {
          background: linear-gradient(90deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 16px;
          padding: 12px 22px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: var(--shadow);
          transition: transform 0.2s ease;
        }

        .celebration__play:hover {
          transform: translateY(-3px);
        }
      `}</style>
    </section>
  );
}
