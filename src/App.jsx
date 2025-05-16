import React, { useState, useEffect, useMemo } from 'react';
import Area from './components/Area';
import TrashZone from './components/TrashBin';
import InfoPopup from './components/InfoPopup';
import { ACHIEVEMENTS, LIXEIRAS } from './achievements';
import { residuos as residuosBase } from './residuosData';

const MISSIONS = [
  { type: 'plastico', goal: 2, time: 30 },
  { type: 'papel', goal: 2, time: 30 },
  { type: 'metal', goal: 1, time: 20 }
];

export default function App() {
  const [items, setItems] = useState([]);
  const [popup, setPopup] = useState(null);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('eco_phase'));
    return typeof saved === 'number' ? saved : 0;
  });
  const [timeLeft, setTimeLeft] = useState(MISSIONS[phase].time);
  const [status, setStatus] = useState('playing'); // 'playing', 'won', 'lost'
  const [restartKey, setRestartKey] = useState(0);

  const currentMission = useMemo(() => MISSIONS[phase], [phase]);

  // Gerar resíduos ao iniciar fase
  useEffect(() => {
  const randomized = shuffleArray(residuosBase).map(item => ({
  ...item,
  revealed: false,
  collected: false,
  }));
  setItems(randomized);
  setScore(0);
  setStatus('playing');
  setTimeLeft(currentMission.time);
  setPopup(null);
  localStorage.setItem('eco_phase', JSON.stringify(phase));
}, [currentMission.time, phase, restartKey]); 


  // Cronômetro
  useEffect(() => {
    if (status !== 'playing') return;
    if (timeLeft <= 0) {
      setStatus('lost');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(t => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, status]);

  const handleReveal = (id) => {
    setItems(prev => {
      const updated = prev.map(item =>
        item.id === id ? { ...item, revealed: true } : item
      );
    const revealedItem = updated.find(item => item.id === id);
    if (revealedItem) setPopup(revealedItem.message);
    return updated;
    });
  };

  const handleCollect = (id) => {
  const item = items.find(it => it.id === id);
  if (!item || item.collected) return;

  setItems(prev =>
    prev.map(it => it.id === id ? { ...it, collected: true } : it)
  );

  if (item.type === currentMission.type) {
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= currentMission.goal) {
        setStatus('won');
        setTimeout(() => {
          setPhase(prevPhase => {
            if (prevPhase + 1 < MISSIONS.length) {
              const next = prevPhase + 1;
              localStorage.setItem('eco_phase', JSON.stringify(next));
              return next;
            } else {
              alert('🎉 Parabéns! A fase foi concluída com sucesso!');
              localStorage.removeItem('eco_phase');
              return 0; // volta para a fase 0
            }
          });
          setRestartKey(k => k + 1);
        }, 1000);
      }
      return newScore;
    });
  }
  setPopup(null);
};

const nextPhase = () => {
  setPhase(prev => {
  const next = prev + 1;
  localStorage.setItem('eco_phase', JSON.stringify(next));
  return next;
  });
};

const restartPhase = () => {
  setRestartKey(prev => prev + 1);
};

const resetGame = () => {
  localStorage.removeItem('eco_phase');
  setPhase(0);
  setRestartKey(prev => prev + 1);
};

  return (
    <div className="game-container">
      <div className="map-container">
        {/* Painel de missão OU missão concluída */}
        {status === 'won' ? (
          <div className="mission-complete mission-panel">
            🎉 Missão cumprida!
            <h3>{ACHIEVEMENTS[currentMission.type].title}</h3>
            <p>{ACHIEVEMENTS[currentMission.type].message}</p>
            <button onClick={nextPhase}>👉 Próxima fase</button>
          </div>
        ) : (
          <div className="mission-panel">
            <div className='mission-title'>
              <h1>Eco Hunt</h1>
              <h3>Missão</h3>
              <p>Coletar {currentMission.goal} de <strong>{currentMission.type}</strong></p>
              <p>Tempo restante: {timeLeft}s</p>
              <p>Progresso: {score} / {currentMission.goal}</p>
              <button className='btn-mission' onClick={resetGame}>🔄 Reiniciar Jogo</button>
            </div>
          </div>
        )}

        {/* Itens no mapa */}
        {items.map(item => (
          ! item.collected &&<Area key={item.id} item={item} onReveal={handleReveal} />
        ))}

        {/* Lixeiras fixas */}
        {LIXEIRAS.map(lixeira => (
          <TrashZone
            key={lixeira.type}
            type={lixeira.type}
            x={lixeira.x}
            y={lixeira.y}
            onDrop={handleCollect}
          />
        ))}
      </div>


      {popup && <InfoPopup message={popup} onClose={() => setPopup(null)}/>}
        
      {status === 'lost' && (
        <div className="mission-failed top-left">
          ⏰ Tempo esgotado! Tente novamente.
          <br />
          <button onClick={restartPhase}>🔁 Reiniciar Fase</button>
        </div>
      )}
    </div>
  );
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}
