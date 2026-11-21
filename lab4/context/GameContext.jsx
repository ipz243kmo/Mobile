import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [score, setScore] = useState(0);
  const [lastEvent, setLastEvent] = useState('Торкніться сфери, щоб почати!');
  const [soundHints, setSoundHints] = useState(true);
  const [autoResetCombo, setAutoResetCombo] = useState(false);

  const [singleTaps, setSingleTaps] = useState(0);
  const [doubleTaps, setDoubleTaps] = useState(0);
  const [longPresses, setLongPresses] = useState(0);
  const [pans, setPans] = useState(0);
  const [flingRight, setFlingRight] = useState(false);
  const [flingLeft, setFlingLeft] = useState(false);
  const [pinches, setPinches] = useState(0);

  const [comboStepOneDone, setComboStepOneDone] = useState(false);
  const [comboCompleted, setComboCompleted] = useState(false);

  const registerSingleTap = () => {
    setScore((s) => s + 1);
    setSingleTaps((c) => c + 1);
    setLastEvent('Одиночний клік (Tap): +1 очко');
  };

  const registerDoubleTap = () => {
    setScore((s) => s + 2);
    setDoubleTaps((c) => c + 1);
    setComboStepOneDone(true);
    setLastEvent('Подвійний клік (Double Tap): +2 очки (Крок 1 комбо виконано!)');
  };

  const registerLongPress = () => {
    setScore((s) => s + 5);
    setLongPresses((c) => c + 1);
    if (comboStepOneDone) {
      setComboCompleted(true);
      setScore((s) => s + 10);
      setLastEvent('Утримання 3 сек + Комбо (Double Tap -> Long Press): +15 очок!');
    } else {
      setLastEvent('Утримання 3 сек (Long Press): +5 очок');
    }
  };

  const registerPan = () => {
    setScore((s) => s + 1);
    setPans((c) => c + 1);
    setLastEvent('Перетягування об’єкта (Pan): +1 очко');
  };

  const registerFling = (direction) => {
    const bonus = Math.floor(Math.random() * 10) + 1;
    setScore((s) => s + bonus);
    if (direction === 'right') {
      setFlingRight(true);
      setLastEvent(`Швидкий свайп вправо (Fling): +${bonus} випадкових очок`);
    } else {
      setFlingLeft(true);
      setLastEvent(`Швидкий свайп вліво (Fling): +${bonus} випадкових очок`);
    }
  };

  const registerPinch = () => {
    setScore((s) => s + 3);
    setPinches((c) => c + 1);
    setLastEvent('Масштабування (Pinch): +3 бонусних очки');
  };

  const resetProgress = () => {
    setScore(0);
    setSingleTaps(0);
    setDoubleTaps(0);
    setLongPresses(0);
    setPans(0);
    setFlingRight(false);
    setFlingLeft(false);
    setPinches(0);
    setComboStepOneDone(false);
    setComboCompleted(false);
    setLastEvent('Прогрес скинуто!');
  };

  const tasks = [
    {
      id: '1',
      title: 'Зробити 10 кліків',
      desc: 'Натиснути на об’єкт одиночним кліком 10 разів (TapGestureHandler)',
      progress: `${Math.min(singleTaps, 10)} / 10`,
      completed: singleTaps >= 10,
    },
    {
      id: '2',
      title: 'Зробити подвійний клік 5 разів',
      desc: 'Виконати 5 подвійних натискань (Double Tap)',
      progress: `${Math.min(doubleTaps, 5)} / 5`,
      completed: doubleTaps >= 5,
    },
    {
      id: '3',
      title: 'Утримувати об’єкт 3 секунди',
      desc: 'Затиснути об’єкт на 3000 мс (LongPressGestureHandler)',
      progress: `${Math.min(longPresses, 1)} / 1`,
      completed: longPresses >= 1,
    },
    {
      id: '4',
      title: 'Перетягнути об’єкт',
      desc: 'Перемістити інтерактивний об’єкт по екрану (PanGestureHandler)',
      progress: `${Math.min(pans, 1)} / 1`,
      completed: pans >= 1,
    },
    {
      id: '5',
      title: 'Зробити свайп вправо та свайп вліво',
      desc: 'Виконати швидкі зсуви в обидва боки (FlingGestureHandler)',
      progress: `Вправо: ${flingRight ? '✓' : '—'} | Вліво: ${flingLeft ? '✓' : '—'}`,
      completed: flingRight && flingLeft,
    },
    {
      id: '6',
      title: 'Змінити розмір об’єкта',
      desc: 'Збільшити або зменшити об’єкт двома пальцями (PinchGestureHandler)',
      progress: `${Math.min(pinches, 1)} / 1`,
      completed: pinches >= 1,
    },
    {
      id: '7',
      title: 'Отримати 100 очок',
      desc: 'Набрати 100 або більше ігрових очок',
      progress: `${Math.min(score, 100)} / 100`,
      completed: score >= 100,
    },
    {
      id: '8',
      title: 'Комбо-майстер (Власне завдання)',
      desc: 'Послідовно виконати подвійний клік, а потім утримання об’єкта 3 секунди',
      progress: comboCompleted ? 'Виконано!' : comboStepOneDone ? 'Крок 1/2 (тепер утримайте 3 с)' : '0 / 2',
      completed: comboCompleted,
    },
  ];

  return (
    <GameContext.Provider
      value={{
        score,
        lastEvent,
        tasks,
        soundHints,
        setSoundHints,
        autoResetCombo,
        setAutoResetCombo,
        registerSingleTap,
        registerDoubleTap,
        registerLongPress,
        registerPan,
        registerFling,
        registerPinch,
        resetProgress,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = () => useContext(GameContext);