import React, { useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import {
  TapGestureHandler,
  LongPressGestureHandler,
  PanGestureHandler,
  FlingGestureHandler,
  PinchGestureHandler,
  Directions,
  State,
} from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useGame } from '../context/GameContext';

export default function ClickerScreen() {
  const {
    score,
    lastEvent,
    registerSingleTap,
    registerDoubleTap,
    registerLongPress,
    registerPan,
    registerFling,
    registerPinch,
  } = useGame();

  const doubleTapRef = useRef(null);
  const longPressRef = useRef(null);

  const pan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const baseScale = useRef(new Animated.Value(1)).current;
  const pinchScale = useRef(new Animated.Value(1)).current;
  const combinedScale = Animated.multiply(baseScale, pinchScale);

  const onPanEvent = Animated.event(
    [{ nativeEvent: { translationX: pan.x, translationY: pan.y } }],
    { useNativeDriver: false }
  );

  const onPanStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      pan.extractOffset();
      registerPan();
    }
  };

  const onPinchEvent = Animated.event(
    [{ nativeEvent: { scale: pinchScale } }],
    { useNativeDriver: false }
  );

  const onPinchStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      baseScale.setValue(Math.min(Math.max(event.nativeEvent.scale, 0.7), 1.8));
      pinchScale.setValue(1);
      registerPinch();
    }
  };

  const resetObjectPosition = () => {
    pan.setOffset({ x: 0, y: 0 });
    pan.setValue({ x: 0, y: 0 });
    baseScale.setValue(1);
    pinchScale.setValue(1);
  };

  return (
    <View style={styles.container}>
      {}
      <View style={styles.scoreBoard}>
        <Text style={styles.scoreLabel}>РАХУНОК ОЧОК</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.eventBanner}>{lastEvent}</Text>
      </View>

      {}
      <View style={styles.arena}>
        <FlingGestureHandler
          direction={Directions.RIGHT}
          onHandlerStateChange={({ nativeEvent }) => {
            if (nativeEvent.state === State.END) registerFling('right');
          }}
        >
          <FlingGestureHandler
            direction={Directions.LEFT}
            onHandlerStateChange={({ nativeEvent }) => {
              if (nativeEvent.state === State.END) registerFling('left');
            }}
          >
            <PinchGestureHandler
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={onPinchStateChange}
            >
              <PanGestureHandler
                onGestureEvent={onPanEvent}
                onHandlerStateChange={onPanStateChange}
                minDist={15}
              >
                <LongPressGestureHandler
                  ref={longPressRef}
                  minDurationMs={3000}
                  onHandlerStateChange={({ nativeEvent }) => {
                    if (nativeEvent.state === State.ACTIVE) registerLongPress();
                  }}
                >
                  <TapGestureHandler
                    ref={doubleTapRef}
                    numberOfTaps={2}
                    onHandlerStateChange={({ nativeEvent }) => {
                      if (nativeEvent.state === State.ACTIVE) registerDoubleTap();
                    }}
                  >
                    <TapGestureHandler
                      waitFor={[doubleTapRef, longPressRef]}
                      onHandlerStateChange={({ nativeEvent }) => {
                        if (nativeEvent.state === State.ACTIVE) registerSingleTap();
                      }}
                    >
                      <Animated.View
                        style={[
                          styles.orb,
                          {
                            transform: [
                              { translateX: pan.x },
                              { translateY: pan.y },
                              { scale: combinedScale },
                            ],
                          },
                        ]}
                      >
                        <Ionicons name="sparkles" size={44} color="#FFFFFF" />
                        <Text style={styles.orbTitle}>CLICKER</Text>
                        <Text style={styles.orbHint}>Тап • 2x • 3с • Свайп • Pinch</Text>
                      </Animated.View>
                    </TapGestureHandler>
                  </TapGestureHandler>
                </LongPressGestureHandler>
              </PanGestureHandler>
            </PinchGestureHandler>
          </FlingGestureHandler>
        </FlingGestureHandler>
      </View>

      {}
      <View style={styles.footer}>
        <Text style={styles.legend}>
          • 1 клік (+1)  • 2x клік (+2)  • Утримання 3с (+5)  • Перетягування (+1)  • Свайп (рандом)  • Pinch (+3)
        </Text>
        <TouchableOpacity style={styles.centerBtn} onPress={resetObjectPosition}>
          <Ionicons name="locate-outline" size={18} color="#1E4B94" />
          <Text style={styles.centerBtnText}>Повернути об’єкт у центр</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  scoreBoard: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  scoreLabel: { fontSize: 12, fontWeight: '700', color: '#6B7280', letterSpacing: 1 },
  scoreValue: { fontSize: 44, fontWeight: '800', color: '#1E4B94', marginVertical: 2 },
  eventBanner: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  arena: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  orb: {
    width: 156,
    height: 156,
    borderRadius: 78,
    backgroundColor: '#1E4B94',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#1E4B94',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    borderWidth: 4,
    borderColor: '#93C5FD',
  },
  orbTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginTop: 4 },
  orbHint: { color: '#DBEAFE', fontSize: 10, marginTop: 2 },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    alignItems: 'center',
  },
  legend: { fontSize: 11, color: '#4B5563', textAlign: 'center', marginBottom: 8 },
  centerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  centerBtnText: { color: '#1E4B94', fontSize: 13, fontWeight: '700' },
});