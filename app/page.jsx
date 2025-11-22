'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import { RaceControls } from "@/components/RaceControls";
import { RaceTrack } from "@/components/RaceTrack";
import { RaceCelebration } from "@/components/RaceCelebration";
import { RACER_THEMES } from "@/lib/racers";

const MAX_RACERS = 4;
const MIN_RACERS = 2;

const BOOST_MESSAGES = [
  "Mega Zoom Boost!",
  "Super Silly Sprint!",
  "Cheer Turbo!",
  "Giggly Jetpack!",
  "Rainbow Rocket!",
];

function getBoostMessage() {
  return BOOST_MESSAGES[Math.floor(Math.random() * BOOST_MESSAGES.length)];
}

export default function Home() {
  const [selectedRacerIds, setSelectedRacerIds] = useState(
    RACER_THEMES.slice(0, 3).map((r) => r.id)
  );
  const [trackLength, setTrackLength] = useState(100);
  const [lapCount, setLapCount] = useState(2);
  const [raceStatus, setRaceStatus] = useState("idle");
  const [countdown, setCountdown] = useState(null);
  const [progress, setProgress] = useState({});
  const [placements, setPlacements] = useState([]);
  const [cheerBoosts, setCheerBoosts] = useState({});
  const [callout, setCallout] = useState(
    "Pick your favorite racers, set the track, and it’s time to zoom!"
  );
  const [sparkles] = useState(() =>
    Array.from({ length: 12 }).map((_, index) => ({
      id: index,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 4}s`,
    }))
  );

  const placementsRef = useRef(placements);
  useEffect(() => {
    placementsRef.current = placements;
  }, [placements]);

  const selectedRacers = useMemo(
    () =>
      RACER_THEMES.filter((theme) => selectedRacerIds.includes(theme.id)).slice(
        0,
        MAX_RACERS
      ),
    [selectedRacerIds]
  );

  useEffect(() => {
    setProgress((prev) => {
      const next = {};
      selectedRacers.forEach((racer) => {
        next[racer.id] = prev[racer.id] ?? 0;
      });
      return next;
    });
    setCheerBoosts((prev) => {
      const next = {};
      selectedRacers.forEach((racer) => {
        next[racer.id] = prev[racer.id] ?? null;
      });
      return next;
    });
  }, [selectedRacers]);

  const totalDistance = trackLength * lapCount;

  useEffect(() => {
    if (raceStatus !== "countdown" || countdown === null) {
      return;
    }

    if (countdown === 0) {
      setRaceStatus("racing");
      setCountdown(null);
      setCallout("GO! Clap and cheer to make them zoom!");
      return;
    }

    const timer = window.setTimeout(() => {
      setCountdown((prev) => (prev ?? 1) - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [raceStatus, countdown]);

  useEffect(() => {
    if (raceStatus !== "racing") {
      return;
    }

    const timeouts = [];
    const interval = window.setInterval(() => {
      const boostMessages = [];
      const finishers = [];

      setProgress((prev) => {
        const next = { ...prev };
        selectedRacers.forEach((racer) => {
          if (placementsRef.current.includes(racer.id)) {
            return;
          }

          const baseSpeed = (100 / totalDistance) * (Math.random() * 12 + 6);
          const cheerChance = Math.random();

          let boostBonus = 0;
          if (cheerChance > 0.94) {
            boostBonus = Math.random() * 12 + 6;
            boostMessages.push({ id: racer.id, message: getBoostMessage() });
          }

          next[racer.id] = Math.min(
            100,
            (next[racer.id] ?? 0) + baseSpeed + boostBonus
          );

          if (next[racer.id] >= 100 && !finishers.includes(racer.id)) {
            finishers.push(racer.id);
          }
        });
        return next;
      });

      if (boostMessages.length) {
        setCheerBoosts((prev) => {
          const next = { ...prev };
          boostMessages.forEach(({ id, message }) => {
            next[id] = message;
            const timeout = window.setTimeout(() => {
              setCheerBoosts((innerPrev) => {
                const innerNext = { ...innerPrev };
                innerNext[id] = null;
                return innerNext;
              });
            }, 1600);
            timeouts.push(timeout);
          });
          return next;
        });
      }

      if (finishers.length) {
        setPlacements((prev) => {
          const next = [...prev];
          finishers.forEach((id) => {
            if (!next.includes(id)) {
              next.push(id);
            }
          });
          return next;
        });
      }
    }, 180);

    return () => {
      window.clearInterval(interval);
      timeouts.forEach((id) => window.clearTimeout(id));
    };
  }, [raceStatus, selectedRacers, totalDistance]);

  useEffect(() => {
    if (
      raceStatus === "racing" &&
      placements.length === selectedRacers.length &&
      placements.length > 0
    ) {
      setRaceStatus("finished");
      const winner = selectedRacers.find((racer) => racer.id === placements[0]);
      if (winner) {
        setCallout(`${winner.emoji} ${winner.name} zoomed to victory!`);
      }
    }
  }, [placements, raceStatus, selectedRacers.length, selectedRacers]);

  useEffect(() => {
    if (raceStatus === "finished" && placements.length === 0) {
      setRaceStatus("idle");
    }
  }, [placements.length, raceStatus]);

  const racersForTrack = selectedRacers.map((racer) => ({
    theme: racer,
    progress: progress[racer.id] ?? 0,
    isWinner: placements[0] === racer.id,
    cheerBoost: cheerBoosts[racer.id] ?? null,
  }));

  const podium = placements
    .map((id) => selectedRacers.find((racer) => racer.id === id))
    .filter(Boolean)
    .slice(0, 3);

  const handleToggleRacer = (racer) => {
    setSelectedRacerIds((prev) => {
      if (prev.includes(racer.id)) {
        return prev.filter((id) => id !== racer.id);
      }
      if (prev.length >= MAX_RACERS) {
        return prev;
      }
      return [...prev, racer.id];
    });
  };

  const handleStartRace = () => {
    if (selectedRacerIds.length < MIN_RACERS) {
      setCallout("Pick at least two racers to make it exciting!");
      return;
    }
    setPlacements([]);
    placementsRef.current = [];
    setProgress((prev) => {
      const next = {};
      selectedRacers.forEach((racer) => {
        next[racer.id] = 0;
      });
      return next;
    });
    setCheerBoosts((prev) => {
      const next = {};
      selectedRacers.forEach((racer) => {
        next[racer.id] = null;
      });
      return next;
    });
    setRaceStatus("countdown");
    setCountdown(3);
    setCallout("Engines rumbling! 3...2...1...");
  };

  const handleReset = () => {
    setRaceStatus("idle");
    setCountdown(null);
    setPlacements([]);
    placementsRef.current = [];
    setProgress((prev) => {
      const next = {};
      selectedRacers.forEach((racer) => {
        next[racer.id] = 0;
      });
      return next;
    });
    setCheerBoosts((prev) => {
      const next = {};
      selectedRacers.forEach((racer) => {
        next[racer.id] = null;
      });
      return next;
    });
    setCallout("Track reset! Pick racers and press the big button.");
  };

  return (
    <main className="page">
      <div className="sparkle-layer">
        {sparkles.map((sparkle) => (
          <span
            key={sparkle.id}
            className="sparkle"
            style={{
              top: sparkle.top,
              left: sparkle.left,
              animationDelay: sparkle.delay,
            }}
          />
        ))}
      </div>

      <header className="hero">
        <div className="hero__tag">Zoomy Racers Club</div>
        <h1>
          Start giggly <span className="hero__highlight">car races</span> for kids!
        </h1>
        <p className="hero__subtitle">{callout}</p>
        <div className="hero__stats">
          <div className="hero__stat">
            <strong>{selectedRacerIds.length}</strong>
            <span>Racers Ready</span>
          </div>
          <div className="hero__stat">
            <strong>{trackLength}</strong>
            <span>Fun-meters</span>
          </div>
          <div className="hero__stat">
            <strong>{lapCount}</strong>
            <span>{lapCount === 1 ? "Lap" : "Laps"}</span>
          </div>
        </div>
      </header>

      <div className="layout">
        <RaceControls
          racers={RACER_THEMES}
          selectedRacerIds={selectedRacerIds}
          onToggleRacer={handleToggleRacer}
          trackLength={trackLength}
          onTrackLengthChange={setTrackLength}
          lapCount={lapCount}
          onLapCountChange={setLapCount}
          onStartRace={handleStartRace}
          onReset={handleReset}
          raceStatus={raceStatus}
          minRacers={MIN_RACERS}
        />
        <RaceTrack
          racers={racersForTrack}
          trackLength={trackLength}
          lapCount={lapCount}
          raceStatus={raceStatus}
          countdown={countdown}
        />
        <RaceCelebration podium={podium} onPlayAgain={handleStartRace} />
      </div>

      <footer className="footer">
        <div>
          Made for bright smiles and big imaginations. Keep cheering loudly!
        </div>
      </footer>

      <style jsx>{`
        .page {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 24px 80px;
          position: relative;
          overflow: hidden;
        }

        .sparkle-layer {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .hero {
          max-width: 900px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 40px;
          z-index: 1;
        }

        .hero__tag {
          display: inline-flex;
          align-self: center;
          background: linear-gradient(90deg, var(--primary), var(--accent));
          color: white;
          font-weight: 800;
          padding: 8px 18px;
          border-radius: 999px;
          letter-spacing: 0.6px;
        }

        .hero h1 {
          font-size: clamp(2.4rem, 5vw, 3.4rem);
          margin: 0;
          color: var(--text);
          line-height: 1.12;
        }

        .hero__highlight {
          color: var(--primary);
          text-shadow: 0 6px 20px rgba(255, 111, 97, 0.3);
        }

        .hero__subtitle {
          font-size: 1.1rem;
          color: var(--muted);
          margin: 0 auto;
          max-width: 560px;
        }

        .hero__stats {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .hero__stat {
          background: var(--surface);
          border-radius: 20px;
          padding: 12px 20px;
          box-shadow: var(--shadow);
          min-width: 120px;
        }

        .hero__stat strong {
          display: block;
          font-size: 1.6rem;
          color: var(--primary);
        }

        .hero__stat span {
          font-size: 0.95rem;
          color: var(--muted);
          font-weight: 600;
        }

        .layout {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 28px;
          width: min(1120px, 100%);
          position: relative;
          z-index: 1;
        }

        .footer {
          margin-top: 52px;
          font-size: 0.95rem;
          color: var(--muted);
          text-align: center;
          z-index: 1;
        }

        @media (max-width: 1024px) {
          .layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
