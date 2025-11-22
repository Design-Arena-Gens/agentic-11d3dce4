import clsx from "clsx";

export function RaceTrack({
  racers,
  trackLength,
  lapCount,
  raceStatus,
  countdown,
}) {
  return (
    <section className="race-track">
      <div className="race-header">
        <div className="race-title">
          <span role="img" aria-hidden>
            🏁
          </span>{" "}
          Rainbow Rally Track
        </div>
        <div className="race-meta">
          Track length:{" "}
          <span className="race-highlight">{trackLength} fun-meters</span> &bull;{" "}
          Laps: <span className="race-highlight">{lapCount}</span>
        </div>
      </div>

      {raceStatus === "countdown" && countdown !== null && (
        <div className="countdown-banner">
          {countdown === 0 ? "Zoom!!" : `Ready in ${countdown}...`}
        </div>
      )}

      <div className="lanes">
        {racers.map((racer, index) => (
          <div className="lane" key={racer.theme.id}>
            <div className="lane__label">
              <span className="lane__number">{index + 1}</span>
              <span>{racer.theme.emoji}</span>
              <span>{racer.theme.name}</span>
            </div>
            <div className="lane__track">
              <div
                className="lane__progress"
                style={{
                  width: `${racer.progress}%`,
                  background: `linear-gradient(90deg, ${racer.theme.color}, ${racer.theme.accent})`,
                }}
              >
                <div className={clsx("lane__car", racer.isWinner && "lane__car--winner")}>
                  <span role="img" aria-label={`${racer.theme.name} car`}>
                    🚗
                  </span>
                </div>
              </div>
              <div className="lane__finish">
                <span>🏁</span>
              </div>
            </div>
            <div className="lane__footer">
              <span className="lane__percent">{Math.round(racer.progress)}%</span>
              {racer.cheerBoost && (
                <span className="lane__boost">⚡ {racer.cheerBoost}</span>
              )}
              {racer.isWinner && raceStatus === "finished" && (
                <span className="lane__winner">Winner!</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .race-track {
          background: var(--surface);
          border-radius: 32px;
          padding: 32px;
          box-shadow: var(--shadow);
          position: relative;
          overflow: hidden;
        }

        .race-track::before,
        .race-track::after {
          content: "";
          position: absolute;
          background: rgba(255, 255, 255, 0.5);
          border-radius: 50%;
          filter: blur(40px);
        }

        .race-track::before {
          width: 240px;
          height: 240px;
          top: -80px;
          right: -120px;
        }

        .race-track::after {
          width: 200px;
          height: 200px;
          bottom: -120px;
          left: -80px;
        }

        .race-header {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 24px;
        }

        .race-title {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text);
        }

        .race-meta {
          font-size: 1rem;
          color: var(--muted);
        }

        .race-highlight {
          color: var(--primary);
          font-weight: 700;
        }

        .countdown-banner {
          margin-bottom: 16px;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          color: white;
          font-weight: 800;
          font-size: 1.2rem;
          padding: 12px 20px;
          border-radius: 20px;
          text-align: center;
          box-shadow: var(--shadow);
        }

        .lanes {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .lane {
          background: rgba(255, 255, 255, 0.9);
          border-radius: 22px;
          padding: 18px 20px;
          box-shadow: 0 10px 24px rgba(31, 43, 77, 0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .lane__label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          color: var(--text);
          letter-spacing: 0.4px;
        }

        .lane__number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--accent);
          display: grid;
          place-items: center;
          color: white;
          font-size: 0.95rem;
        }

        .lane__track {
          position: relative;
          background: #eef1ff;
          border-radius: 16px;
          overflow: hidden;
          height: 56px;
          display: flex;
          align-items: center;
        }

        .lane__progress {
          height: 100%;
          display: flex;
          align-items: center;
          border-radius: inherit;
          transition: width 0.2s ease-out;
          position: relative;
        }

        .lane__car {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.8);
          display: grid;
          place-items: center;
          font-size: 1.4rem;
          margin-left: auto;
          margin-right: 6px;
          box-shadow: 0 8px 18px rgba(31, 43, 77, 0.15);
          animation: wiggle 1.6s ease-in-out infinite;
        }

        .lane__car--winner {
          animation: wiggle 0.9s ease-in-out infinite;
          background: var(--secondary);
        }

        .lane__finish {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.5rem;
        }

        .lane__footer {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          flex-wrap: wrap;
        }

        .lane__percent {
          font-weight: 700;
          color: var(--text);
        }

        .lane__boost {
          background: rgba(76, 201, 240, 0.16);
          color: #147ea8;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 600;
        }

        .lane__winner {
          background: rgba(255, 209, 102, 0.3);
          color: #bb6e00;
          padding: 6px 12px;
          border-radius: 999px;
          font-weight: 700;
        }

        @keyframes wiggle {
          0%,
          100% {
            transform: translateX(0);
          }
          40% {
            transform: translateX(-3px);
          }
          60% {
            transform: translateX(3px);
          }
        }

        @media (max-width: 768px) {
          .race-track {
            padding: 24px;
          }
          .lane {
            padding: 16px;
          }
          .lane__track {
            height: 50px;
          }
        }
      `}</style>
    </section>
  );
}
