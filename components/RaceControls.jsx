const TRACK_OPTIONS = [60, 80, 100, 120, 140];
const LAP_OPTIONS = [1, 2, 3, 5];

export function RaceControls({
  racers,
  selectedRacerIds,
  onToggleRacer,
  trackLength,
  onTrackLengthChange,
  lapCount,
  onLapCountChange,
  onStartRace,
  onReset,
  raceStatus,
  minRacers = 2,
}) {
  const canStart =
    selectedRacerIds.length >= minRacers && raceStatus !== "racing" && raceStatus !== "countdown";

  return (
    <section className="controls">
      <div className="controls__header">
        <h2>
          <span role="img" aria-hidden>
            🎨
          </span>{" "}
          Pick Your Racers
        </h2>
        <p>Tap your favorites! You need at least {minRacers} racers to start a rally.</p>
      </div>

      <div className="controls__racers">
        {racers.map((racer) => {
          const selected = selectedRacerIds.includes(racer.id);
          const disabled = !selected && selectedRacerIds.length >= 4;
          return (
            <label
              key={racer.id}
              className={`controls__option ${selected ? "controls__option--selected" : ""} ${
                disabled ? "controls__option--disabled" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={selected}
                disabled={disabled}
                onChange={() => onToggleRacer(racer)}
              />
              <div className="controls__chip" style={{ background: racer.accent }}>
                <div className="controls__emoji">{racer.emoji}</div>
                <div>
                  <div className="controls__name">{racer.name}</div>
                  <div className="controls__lore">{racer.lore}</div>
                </div>
              </div>
            </label>
          );
        })}
      </div>

      <div className="controls__divider" />

      <div className="controls__header">
        <h2>
          <span role="img" aria-hidden>
            🛣️
          </span>{" "}
          Track Settings
        </h2>
        <p>Make the race silly-short or super-duper long.</p>
      </div>

      <div className="controls__grid">
        <div className="controls__field">
          <span className="controls__label">Track Length</span>
          <div className="controls__choices">
            {TRACK_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                className={`controls__choice ${trackLength === option ? "is-active" : ""}`}
                onClick={() => onTrackLengthChange(option)}
              >
                {option} fun-m
              </button>
            ))}
          </div>
        </div>
        <div className="controls__field">
          <span className="controls__label">Lap Count</span>
          <div className="controls__choices">
            {LAP_OPTIONS.map((option) => (
              <button
                type="button"
                key={option}
                className={`controls__choice ${lapCount === option ? "is-active" : ""}`}
                onClick={() => onLapCountChange(option)}
              >
                {option} {option === 1 ? "lap" : "laps"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="controls__actions">
        <button
          type="button"
          className="controls__start"
          onClick={onStartRace}
          disabled={!canStart}
        >
          {raceStatus === "finished" ? "Race Again!" : "Start The Rally!"}
        </button>
        <button
          type="button"
          className="controls__reset"
          onClick={onReset}
          disabled={raceStatus === "idle"}
        >
          Reset Track
        </button>
      </div>

      <style jsx>{`
        .controls {
          background: var(--surface);
          border-radius: 32px;
          padding: 32px;
          box-shadow: var(--shadow);
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .controls__header h2 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 800;
          color: var(--text);
        }

        .controls__header p {
          margin: 6px 0 0;
          color: var(--muted);
          font-size: 1rem;
        }

        .controls__racers {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 16px;
        }

        .controls__option {
          position: relative;
          cursor: pointer;
        }

        .controls__option input {
          position: absolute;
          opacity: 0;
        }

        .controls__chip {
          display: flex;
          gap: 12px;
          padding: 18px;
          border-radius: 20px;
          border: 3px solid transparent;
          box-shadow: 0 12px 24px rgba(31, 43, 77, 0.08);
          transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
        }

        .controls__chip:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 34px rgba(31, 43, 77, 0.12);
        }

        .controls__emoji {
          font-size: 1.8rem;
        }

        .controls__name {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text);
        }

        .controls__lore {
          color: var(--muted);
          font-size: 0.9rem;
        }

        .controls__option--selected .controls__chip {
          border-color: var(--primary);
        }

        .controls__option--disabled {
          cursor: not-allowed;
        }

        .controls__divider {
          height: 1px;
          background: rgba(107, 122, 161, 0.18);
          width: 100%;
        }

        .controls__grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        }

        .controls__label {
          font-weight: 700;
          color: var(--text);
          display: block;
          margin-bottom: 10px;
        }

        .controls__choices {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .controls__choice {
          padding: 10px 16px;
          border-radius: 999px;
          border: none;
          background: #eef1ff;
          color: var(--muted);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .controls__choice.is-active {
          background: linear-gradient(90deg, var(--primary), var(--accent));
          color: #fff;
          box-shadow: 0 12px 24px rgba(31, 43, 77, 0.18);
        }

        .controls__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
        }

        .controls__start,
        .controls__reset {
          border-radius: 16px;
          padding: 14px 20px;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .controls__start {
          background: linear-gradient(90deg, var(--primary), var(--primary-dark));
          color: white;
          box-shadow: var(--shadow);
          flex: 1 1 200px;
        }

        .controls__reset {
          background: rgba(76, 201, 240, 0.16);
          color: #147ea8;
          flex: 0 0 auto;
        }

        .controls__start:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .controls__reset:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .controls__start:not(:disabled):hover {
          transform: translateY(-4px);
        }

        @media (max-width: 768px) {
          .controls {
            padding: 24px;
          }
          .controls__actions {
            flex-direction: column;
            align-items: stretch;
          }
          .controls__reset {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </section>
  );
}
