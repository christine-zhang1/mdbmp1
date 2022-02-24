import React, { useState } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";

import { styles } from "../constants/Styles";
import { nameToPic } from "../constants/Constants";
import { useEffect } from "react";
import { shuffle } from "../utils/ArrayUtils";
import { isSearchBarAvailableForCurrentPlatform } from "react-native-screens";
const names = Object.keys(nameToPic);

export default function GameScreen() {
  // TODO: Declare and initialize state variables here, using "useState".

  // State for the timer is handled for you.
  const [timeLeft, setTimeLeft] = useState(5000);
  const [expired, setExpired] = useState(false);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [tapped, setTapped] = useState(false);
  const [tempNames, setTempNames] = useState([]);
  const [tempImage, setTempImage] = useState();
  const [tempCorrectName, setTempCorrectName] = useState();
  const [tempCorrectIndex, setTempCorrectIndex] = useState();

  // Called by the timer every 10 seconds
  const countDown = () => {
    if (timeLeft > 0) {
      // Time still left, so decrement time state variable
      setTimeLeft(timeLeft - 10);
    } else {
      // Time has expired
      // TODO: update appropriate state variables
      setExpired(true);
      setTotal(total + 1);
    }
  };

  // This is used in the useEffect(...) hook bound on a specific STATE variable.
  // It updates state to present a new member & name options.
  const getNextRound = () => {
    setTapped(false);
    // Fetches the next member name to guess.
    let correct = names[Math.floor(Math.random() * names.length)];
    let correctName = nameToPic[correct][0];
    let correctImage = nameToPic[correct][1];

    // Generate 3 more wrong answers.
    let nameOptions = [correctName];
    while (nameOptions.length < 4) {
      let wrong = names[Math.floor(Math.random() * names.length)];
      let wrongName = nameToPic[wrong][0];
      if (!nameOptions.includes(wrongName)) {
        nameOptions.push(wrongName);
      }
    }
    nameOptions = shuffle(nameOptions);

    // TODO: Update state here.

    setTimeLeft(5000);
    setExpired(false);
    setTempNames(nameOptions);
    setTempImage(correctImage);
    setTempCorrectName(correctName);
  };

  // Called when user taps a name option.
  // TODO: Update correct # and total # state values.
  const selectedNameChoice = (index) => {
    if (tempNames[index] == tempCorrectName) {
      setScore(score + 1);
    }
    setTapped(true);
    setTotal(total + 1);
  };

  // Call the countDown() method every 10 milliseconds.
  useEffect(() => {
    const timer = setInterval(() => countDown(), 10);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  // TODO: Finish this useEffect() hook such that we automatically
  // get the next round when the appropriate state variable changes.
  useEffect(
    () => {
      getBuffer();
      setTimeout(() => {
        getNextRound()
      }, 2000)
    },
    [
      expired, tapped
    ]
  );

  // Set up four name button components
  const nameButtons = [];
  for (let i = 0; i < 4; i++) {
    const j = i;
    if (tempNames[i] == tempCorrectIndex) {
      setTempCorrectIndex(j);
    }
    nameButtons.push(
      // A button is just a Text component wrapped in a TouchableOpacity component.
      <TouchableOpacity
        key={j}
        style={styles.button}
        onPress={() => selectedNameChoice(j)}
      >
        <Text style={styles.buttonText}>
          {tempNames[j]}
        </Text>
      </TouchableOpacity>
    );
  }

  const getBuffer = () => {
    if (tapped | expired) {
      nameButtons[tempCorrectIndex] = 
        <TouchableOpacity
        key={tempCorrectIndex}
        style={styles.buttonCorrect}
        >
          <Text style={styles.buttonText}>
            {tempNames[tempCorrectIndex]}
          </Text>
        </TouchableOpacity>
    }
  }

  const timeRemainingStr = (timeLeft / 1000).toFixed(2);

  // Style & return the view.
  return (
    <View style = {styles.container}>
      {/* TODO: Build out your UI using Text and Image components. */
        <View>
            <Text style = {styles.timerText}>{timeRemainingStr}</Text>
            <Text style = {styles.scoreText}>{score} / {total}</Text>
            <Image
              style={styles.image}
              source={tempImage}
            />
            {nameButtons[0]}
            {nameButtons[1]}
            {nameButtons[2]}
            {nameButtons[3]}
        </View>
      }
      {/* Hint: What does the nameButtons list above hold? 
          What types of objects is this list storing?
          Try to get a sense of what's going on in the for loop above. */}
    </View>
  );
}
