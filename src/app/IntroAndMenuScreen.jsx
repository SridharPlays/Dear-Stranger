import React, { useEffect, useRef, useState } from 'react';
import { Animated, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const IntroAndMenuScreen = ({ onStartGame, onShowOptions }) => {
  const headphonesFade = useRef(new Animated.Value(0)).current;
  const studioFade = useRef(new Animated.Value(0)).current;
  // const titleFade = useRef(new Animated.Value(0)).current; // No longer needed for gameTitle
  const episodeFade = useRef(new Animated.Value(0)).current;
  const menuButtonsFade = useRef(new Animated.Value(0)).current;
  const episodeTranslateY = useRef(new Animated.Value(0)).current; // New: for episode title positioning
  const backgroundOpacity = useRef(new Animated.Value(0)).current;

  const [menuActive, setMenuActive] = useState(false);
  const introPlayed = useRef(false);

  useEffect(() => {
    if (!introPlayed.current) {
      Animated.sequence([
        Animated.timing(headphonesFade, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.delay(3000),
        Animated.timing(headphonesFade, { toValue: 0, duration: 2000, useNativeDriver: true }),
        Animated.delay(1000),

        Animated.timing(studioFade, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(studioFade, { toValue: 0, duration: 2000, useNativeDriver: true }),
        Animated.delay(1000),

        Animated.delay(1000),
        Animated.parallel([
          // We are no longer animating titleFade. The game title comes from the image.
          Animated.timing(episodeFade, { toValue: 1, duration: 1500, useNativeDriver: true }), // Episode fades in
          Animated.timing(backgroundOpacity, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
        Animated.delay(2000),

        // Translate the episode title down and fade in menu buttons
        Animated.parallel([
          Animated.timing(episodeTranslateY, { // Animate the episode title's position
            toValue: 80, // Adjust this value to position 'Act I' correctly below your image logo
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(menuButtonsFade, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        setMenuActive(true);
        introPlayed.current = true;
      });
    } else {
      headphonesFade.setValue(0);
      studioFade.setValue(0);
      // titleFade.setValue(1); // No longer needed
      episodeFade.setValue(1);
      episodeTranslateY.setValue(80); // Set final position if skipped
      menuButtonsFade.setValue(1);
      backgroundOpacity.setValue(1);
      setMenuActive(true);
    }
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Animated.View style={[styles.backgroundImageContainer, { opacity: backgroundOpacity }]}>
        <ImageBackground
          source={require('../assets/images/logo_background.jpg')}
          style={styles.fullScreenImage}
          resizeMode="cover"
        >
          {/* "Act I: The Prequel" inside ImageBackground for relative positioning */}
          <Animated.View style={[styles.episodeContainer, { opacity: episodeFade, transform: [{ translateY: episodeTranslateY }] }]}>
            <Text style={styles.episodeTitle}>Act I: The Prequel</Text>
          </Animated.View>
        </ImageBackground>
      </Animated.View>

      <Animated.View style={[styles.centered, { opacity: headphonesFade }]}>
        <Text style={styles.headphonesText}>Wear headphones for the best experience</Text>
      </Animated.View>
      <Animated.View style={[styles.centered, { opacity: studioFade }]}>
        <Text style={styles.studioText}>Power Angels Presents</Text>
      </Animated.View>

      {/* Menu Buttons */}
      <Animated.View style={[styles.menuContainer, { opacity: menuButtonsFade }]}>
        <TouchableOpacity style={styles.button} onPress={onStartGame} disabled={!menuActive}>
          <Text style={styles.buttonText}>START</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  fullScreenImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centered: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  episodeContainer: {
    position: 'absolute',
    top: '30%', 
    alignItems: 'center',
  },
  menuContainer: {
    position: 'absolute',
    bottom: 80, 
    alignItems: 'center',
  },
  headphonesText: {
    color: '#888',
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  studioText: {
    color: '#999',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  episodeTitle: {
    fontSize: 18,
    color: '#888888',
    marginTop: 10,
    fontWeight: '300',
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderWidth: 1.5,
    borderColor: '#777',
    width: 320,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#EAEAEA',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 1.5,
  },
});

export default IntroAndMenuScreen;