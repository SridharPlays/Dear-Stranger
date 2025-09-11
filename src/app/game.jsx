import {
    Axe,
    BatteryFull,
    Bomb,
    Check,
    ChevronLeft,
    Trash2 as Delete,
    DownloadCloud,
    Flag,
    Globe,
    Image as ImageIcon,
    Lock,
    MessageSquare,
    NotebookPen,
    Phone,
    Search,
    Signal,
    Wifi,
    X,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    StatusBar as RNStatusBar,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// --- MYSTERY CONSTANTS ---
const CORRECT_PIN = "0925";
const RESET_PUZZLE_ANSWER = "MARS0909";
const WINNING_LEVEL = 5;
const ANAGRAM_CLUE = "ODL STCYA TSATOIN";
const SEQUENCE_DATA = [
  { riddle: "Number of sides on a triangle.", answer: 3 },
  { riddle: "Colors in a rainbow.", answer: 7 },
  { riddle: "The loneliest number.", answer: 1 },
  { riddle: "Legs on a spider.", answer: 8 },
  { riddle: "Points on a five-pointed star.", answer: 5 },
  { riddle: "A pair of anything has this many.", answer: 2 },
  { riddle: "Seasons in a year.", answer: 4 },
  { riddle: "The square root of eighty-one.", answer: 9 },
  { riddle: "Sides on a hexagon.", answer: 6 },
];

// --- SUDOKU CONSTANTS ---
const SUDOKU_REGIONS = [
  [0, 0, 1, 1, 1],
  [0, 2, 2, 1, 1],
  [0, 2, 2, 3, 1],
  [0, 2, 3, 3, 4],
  [2, 2, 3, 4, 4],
];
const SUDOKU_PUZZLE = [
  [1, 0, 3, 0, 5],
  [0, 4, 0, 2, 0],
  [5, 0, 2, 3, 0],
  [0, 5, 0, 0, 3],
  [2, 0, 4, 5, 0],
];
const SUDOKU_SOLUTION = [
  [1, 2, 3, 4, 5],
  [3, 4, 5, 2, 1],
  [5, 1, 2, 3, 4],
  [4, 5, 1, 2, 3],
  [2, 3, 4, 5, 1],
];

// --- MINESWEEPER CONSTANTS ---
const MINE_LOCATIONS = [
  { r: 0, c: 2 },
  { r: 1, c: 4 },
  { r: 3, c: 1 },
  { r: 4, c: 3 },
];
const GRID_SIZE = 5;
const NUM_MINES = MINE_LOCATIONS.length;

// --- Helper Functions ---
const generateMinesweeperBoard = () => {
  let board = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => ({
      isMine: false,
      isRevealed: false,
      isFlagged: false,
      neighboringMines: 0,
    }))
  );
  MINE_LOCATIONS.forEach((mine) => {
    board[mine.r][mine.c].isMine = true;
  });
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (board[r][c].isMine) continue;
      let mineCount = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const nr = r + dr;
          const nc = c + dc;
          if (
            nr >= 0 &&
            nr < GRID_SIZE &&
            nc >= 0 &&
            nc < GRID_SIZE &&
            board[nr][nc].isMine
          ) {
            mineCount++;
          }
        }
      }
      board[r][c].neighboringMines = mineCount;
    }
  }
  return board;
};
const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

// --- Helper Components ---
const icons = { MessageSquare, ImageIcon, NotebookPen, Phone, Globe };
const StatusBar = ({ isLocked = false, batteryLevel }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setTime(`${hours}:${minutes} ${ampm}`);
    };
    updateDateTime();
    const timerId = setInterval(updateDateTime, 1000);
    return () => clearInterval(timerId);
  }, []);
  if (isLocked) {
    return (
      <View style={styles.statusBarLocked}>
        {" "}
        <Text style={styles.statusBarText}>
          {batteryLevel}% <BatteryFull color="white" size={16} />
        </Text>{" "}
        <View style={styles.statusBarIcons}>
          <Wifi color="white" size={16} />
          <Signal color="white" size={16} />
        </View>{" "}
      </View>
    );
  }
  return (
    <View style={styles.statusBarUnlocked}>
      {" "}
      <Text style={styles.statusBarText}>{time}</Text>{" "}
      <View style={styles.statusBarIcons}>
        <Wifi color="white" size={16} />
        <Signal color="white" size={16} />
        <Text style={[styles.statusBarText, { fontSize: 12 }]}>
          {batteryLevel}%
        </Text>
        <BatteryFull color="white" size={16} />
      </View>{" "}
    </View>
  );
};
const AppIcon = ({ icon, name, bgColor, textColor = "white", onPress }) => {
  const IconComponent = icons[icon];
  return (
    <TouchableOpacity style={styles.appIconContainer} onPress={onPress}>
      {" "}
      <View style={[styles.appIconWrapper, { backgroundColor: bgColor }]}>
        <IconComponent color={textColor} size={36} />
      </View>{" "}
      <Text style={styles.appIconName}>{name}</Text>{" "}
    </TouchableOpacity>
  );
};
const AppHeader = ({ title, onBack, rightIcon, onRightIconPress }) => (
  <View style={styles.appHeader}>
    {" "}
    <TouchableOpacity onPress={onBack} style={styles.appHeaderBack}>
      <ChevronLeft size={24} color="white" />
    </TouchableOpacity>{" "}
    <Text style={styles.appHeaderTitle}>{title}</Text>{" "}
    {rightIcon ? (
      <TouchableOpacity onPress={onRightIconPress} style={styles.appHeaderBack}>
        {rightIcon}
      </TouchableOpacity>
    ) : (
      <View style={{ width: 32 }} />
    )}{" "}
  </View>
);

// --- Lock Screen & Reset Puzzle ---
const LockScreen = ({ setPhoneUnlocked }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  );
  const [date, setDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  );
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        setPhoneUnlocked(true);
      } else {
        setError("Incorrect PIN");
        setAttempts((prev) => prev + 1);
        setTimeout(() => {
          setPin("");
          setError("");
        }, 800);
      }
    }
  }, [pin, setPhoneUnlocked]);
  const handleKeyPress = (key) => {
    if (pin.length < 4) setPin(pin + key);
  };
  const handleDelete = () => setPin(pin.slice(0, -1));
  const NumpadButton = ({ num }) => (
    <TouchableOpacity
      onPress={() => handleKeyPress(num)}
      style={styles.numpadButton}
    >
      <Text style={styles.numpadText}>{num}</Text>
    </TouchableOpacity>
  );
  return (
    <View style={styles.lockScreenContainer}>
      {" "}
      <View style={styles.lockScreenDateTime}>
        <Text style={styles.lockScreenTime}>{time}</Text>
        <Text style={styles.lockScreenDate}>{date}</Text>
      </View>{" "}
      <View style={styles.pinContainer}>
        {" "}
        <Text style={[styles.pinError, { opacity: error ? 1 : 0 }]}>
          {error || "Placeholder"}
        </Text>{" "}
        <View style={styles.pinDotsContainer}>
          {[...Array(4)].map((_, i) => (
            <View
              key={i}
              style={[styles.pinDot, pin.length > i && styles.pinDotFilled]}
            />
          ))}
        </View>{" "}
        {attempts >= 3 ? (
          <TouchableOpacity onPress={() => setPhoneUnlocked("reset")}>
            {" "}
            <Text style={styles.forgotPinText}>Forgot PIN?</Text>{" "}
          </TouchableOpacity>
        ) : (
          <Text style={styles.enterPinText}>Enter PIN to view</Text>
        )}{" "}
      </View>{" "}
      <View style={styles.numpadGrid}>
        {" "}
        {[...Array(9).keys()].map((i) => (
          <NumpadButton key={i + 1} num={String(i + 1)} />
        ))}
        <View style={styles.numpadSpacer} />
        <NumpadButton num={"0"} />
        <TouchableOpacity onPress={handleDelete} style={styles.numpadDelete}>
          <Delete size={28} color="white" />
        </TouchableOpacity>{" "}
      </View>{" "}
    </View>
  );
};
const ResetPuzzleScreen = ({ setPhoneUnlocked }) => {
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const handleSubmit = () => {
    if (answer.toUpperCase().trim() === RESET_PUZZLE_ANSWER) {
      setPhoneUnlocked(true);
    } else {
      setError("Incorrect. Please try again.");
      setAnswer("");
    }
  };
  return (
    <View style={styles.resetContainer}>
      {" "}
      <View style={styles.resetContent}>
        {" "}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => setPhoneUnlocked(false)}
        >
          <X color="white" size={24} />
        </TouchableOpacity>{" "}
        <Text style={styles.resetTitle}>Password Recovery</Text>{" "}
        <Text style={styles.resetQuestion}>
          "Where I want to go, and when I plan to leave."
        </Text>{" "}
        <Text style={styles.resetSubtitle}>
          The wallpaper is my destination. The date holds the key.
        </Text>{" "}
        <TextInput
          value={answer}
          onChangeText={setAnswer}
          style={styles.resetInput}
          placeholder="ANSWER"
          placeholderTextColor="#9CA3AF"
          autoCapitalize="characters"
        />{" "}
        <Text style={styles.resetError}>{error}</Text>{" "}
        <TouchableOpacity onPress={handleSubmit} style={styles.resetButton}>
          {" "}
          <Text style={styles.resetButtonText}>Unlock</Text>{" "}
        </TouchableOpacity>{" "}
      </View>{" "}
    </View>
  );
};

// --- Main App Screens ---
const HomeScreen = ({ setCurrentScreen }) => (
  <View style={styles.homeScreenContainer}>
    {" "}
    <AppIcon
      icon="MessageSquare"
      name="Messages"
      bgColor="#22C55E"
      onPress={() => setCurrentScreen("messages-app")}
    />{" "}
    <AppIcon
      icon="ImageIcon"
      name="Gallery"
      bgColor="#3B82F6"
      onPress={() => setCurrentScreen("photos-app")}
    />{" "}
    <AppIcon
      icon="NotebookPen"
      name="Notes"
      bgColor="#FBBF24"
      textColor="black"
      onPress={() => setCurrentScreen("notes-app")}
    />{" "}
    <AppIcon
      icon="Phone"
      name="Contacts"
      bgColor="#8B5CF6"
      onPress={() => setCurrentScreen("contacts-app")}
    />{" "}
    <AppIcon
      icon="Globe"
      name="Browser"
      bgColor="#ffffff"
      textColor="black"
      onPress={() => setCurrentScreen("browser-app")}
    />{" "}
  </View>
);
const MessagesApp = ({ setCurrentScreen, unknownMessageRecovered }) => (
  <View style={styles.appContainer}>
    {" "}
    <AppHeader
      title="Messages"
      onBack={() => setCurrentScreen("home-screen")}
    />{" "}
    <ScrollView style={{ padding: 8 }}>
      {" "}
      <TouchableOpacity
        style={styles.messageItem}
        onPress={() => setCurrentScreen("conversation-mom")}
      >
        {" "}
        <View style={[styles.avatar, { backgroundColor: "#EC4899" }]}>
          <Text style={styles.avatarText}>M</Text>
        </View>{" "}
        <View style={{ flex: 1 }}>
          <Text style={styles.messageName}>Mom</Text>
          <Text style={styles.messagePreview} numberOfLines={1}>
            Please answer.
          </Text>
        </View>{" "}
      </TouchableOpacity>{" "}
      <TouchableOpacity
        style={styles.messageItem}
        onPress={() => setCurrentScreen("conversation-riya")}
      >
        {" "}
        <View style={[styles.avatar, { backgroundColor: "#A855F7" }]}>
          <Text style={styles.avatarText}>R</Text>
        </View>{" "}
        <View style={{ flex: 1 }}>
          <Text style={styles.messageName}>Riya</Text>
          <Text style={styles.messagePreview} numberOfLines={1}>
            Don't go alone. He's dangerous.
          </Text>
        </View>{" "}
      </TouchableOpacity>{" "}
      <TouchableOpacity
        style={styles.messageItem}
        onPress={() =>
          setCurrentScreen(
            unknownMessageRecovered ? "conversation-unknown" : "sequence-puzzle"
          )
        }
      >
        {" "}
        <View style={[styles.avatar, { backgroundColor: "#6B7280" }]}>
          <Text style={styles.avatarText}>?</Text>
        </View>{" "}
        <View style={{ flex: 1 }}>
          {" "}
          <Text style={styles.messageName}>Unknown Number</Text>{" "}
          {unknownMessageRecovered ? (
            <Text style={styles.messagePreview} numberOfLines={1}>
              I know you have the proof. Meet me at...
            </Text>
          ) : (
            <Text style={styles.messagePreview} numberOfLines={1}>
              [MESSAGE CORRUPTED]
            </Text>
          )}{" "}
        </View>{" "}
        {!unknownMessageRecovered && <Lock color="#FBBF24" size={20} />}{" "}
      </TouchableOpacity>{" "}
    </ScrollView>{" "}
  </View>
);
const ConversationScreen = ({ title, onBack, children }) => (
  <View style={styles.appContainer}>
    <AppHeader title={title} onBack={onBack} />
    <ScrollView contentContainerStyle={styles.conversationScroll}>
      {children}
    </ScrollView>
  </View>
);
const ChatBubble = ({ text, isSender }) => (
  <View
    style={[
      styles.chatBubble,
      isSender ? styles.senderBubble : styles.receiverBubble,
    ]}
  >
    <Text style={styles.chatText}>{text}</Text>
  </View>
);
const ConversationMom = ({ setCurrentScreen }) => (
  <ConversationScreen
    title="Mom"
    onBack={() => setCurrentScreen("messages-app")}
  >
    <ChatBubble text="Where are you? You didn’t come home last night." />
    <ChatBubble text="Please answer." />
  </ConversationScreen>
);
const ConversationRiya = ({ setCurrentScreen }) => (
  <ConversationScreen
    title="Riya"
    onBack={() => setCurrentScreen("messages-app")}
  >
    <ChatBubble text="Aarav, you said you’d tell me the secret today. Where are you??" />
    <ChatBubble text="You left in a hurry yesterday after class." />
    <ChatBubble text="Don't go alone. He's dangerous." />
  </ConversationScreen>
);
const ConversationUnknown = ({ setCurrentScreen }) => (
  <ConversationScreen
    title="Unknown Number"
    onBack={() => setCurrentScreen("messages-app")}
  >
    <ChatBubble text="Don’t play games with me." />
    <ChatBubble text="I know you have the proof. Meet me at the station." />
  </ConversationScreen>
);
const PhotosApp = ({ setCurrentScreen, setSelectedPhoto }) => (
  <View style={styles.appContainer}>
    {" "}
    <AppHeader
      title="Gallery"
      onBack={() => setCurrentScreen("home-screen")}
    />{" "}
    <View style={styles.photoGrid}>
      {" "}
      <TouchableOpacity
        onPress={() => {
          setSelectedPhoto(
            "https://placehold.co/400x600/34d399/ffffff?text=Train+Ticket%0ADate:+Sept+8%0A9:45+PM"
          );
          setCurrentScreen("photo-view");
        }}
      >
        {" "}
        <Image
          source={{
            uri: "https://placehold.co/150x150/34d399/ffffff?text=Ticket",
          }}
          style={styles.thumbnail}
        />{" "}
      </TouchableOpacity>{" "}
      <TouchableOpacity
        onPress={() => {
          setSelectedPhoto(
            "https://placehold.co/400x600/1f2937/ffffff?text=...following..."
          );
          setCurrentScreen("photo-view");
        }}
      >
        {" "}
        <Image
          source={{
            uri: "https://placehold.co/150x150/1f2937/ffffff?text=???",
          }}
          style={styles.thumbnail}
        />{" "}
      </TouchableOpacity>{" "}
      <TouchableOpacity onPress={() => setCurrentScreen("sudoku-puzzle")}>
        {" "}
        <View style={styles.lockedThumbnail}>
          <Lock color="white" size={32} />
          <Text style={styles.lockedThumbnailText}>Recover Image</Text>
        </View>{" "}
      </TouchableOpacity>{" "}
    </View>{" "}
  </View>
);
const PhotoView = ({ setCurrentScreen, photo }) => (
  <View style={styles.photoViewContainer}>
    <TouchableOpacity
      style={styles.photoViewClose}
      onPress={() => setCurrentScreen("photos-app")}
    >
      <X color="white" size={24} />
    </TouchableOpacity>
    <Image
      source={{ uri: photo }}
      style={styles.fullScreenImage}
      resizeMode="contain"
    />
  </View>
);
const NotesApp = ({ setCurrentScreen }) => (
  <View style={styles.appContainer}>
    {" "}
    <AppHeader
      title="Notes"
      onBack={() => setCurrentScreen("home-screen")}
    />{" "}
    <ScrollView style={{ padding: 8 }}>
      {" "}
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => setCurrentScreen("note-one")}
      >
        <Text style={styles.noteTitle}>Reminder</Text>
        <Text style={styles.notePreview}>If I disappear...</Text>
      </TouchableOpacity>{" "}
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => setCurrentScreen("note-two")}
      >
        <Text style={styles.noteTitle}>Passwords</Text>
        <Text style={styles.notePreview}>Phone Lock...</Text>
      </TouchableOpacity>{" "}
      <TouchableOpacity
        style={styles.noteItem}
        onPress={() => setCurrentScreen("minesweeper-puzzle")}
      >
        {" "}
        <View>
          <Text style={styles.noteTitle}>URGENT</Text>
          <Text style={styles.notePreview}>[ENCRYPTED FILE]</Text>
        </View>{" "}
        <Lock color="#FBBF24" size={20} />{" "}
      </TouchableOpacity>{" "}
    </ScrollView>{" "}
  </View>
);
const NoteScreen = ({ title, onBack, children }) => (
  <View style={styles.appContainer}>
    <AppHeader title={title} onBack={onBack} />
    <ScrollView style={{ padding: 16 }}>
      <Text style={styles.noteContent}>{children}</Text>
    </ScrollView>
  </View>
);
const ContactsApp = ({
  setCurrentScreen,
  contactsRestored,
  setContactsRestored,
}) => {
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [gameStatus, setGameStatus] = useState("idle");
  const [activeButton, setActiveButton] = useState(null);
  const resetGame = () => {
    setGameStatus("failed");
    setTimeout(() => {
      setLevel(1);
      setSequence([]);
      setPlayerSequence([]);
      setGameStatus("idle");
    }, 1500);
  };
  const startNextLevel = (currentSequence) => {
    setPlayerSequence([]);
    setGameStatus("watching");
    let newStep;
    do {
      newStep = Math.floor(Math.random() * 9);
    } while (currentSequence.includes(newStep));
    const newSequence = [...currentSequence, newStep];
    setSequence(newSequence);
    newSequence.forEach((buttonIndex, i) => {
      setTimeout(() => {
        setActiveButton(buttonIndex);
        setTimeout(() => setActiveButton(null), 300);
      }, (i + 1) * 600);
    });
    setTimeout(() => setGameStatus("playing"), newSequence.length * 600 + 500);
  };
  const handlePlayerPress = (buttonIndex) => {
    if (gameStatus !== "playing") return;
    const newPlayerSequence = [...playerSequence, buttonIndex];
    setPlayerSequence(newPlayerSequence);
    if (sequence[newPlayerSequence.length - 1] !== buttonIndex) {
      resetGame();
      return;
    }
    if (newPlayerSequence.length === sequence.length) {
      if (level === WINNING_LEVEL) {
        setContactsRestored(true);
      } else {
        setLevel((prev) => prev + 1);
        setTimeout(() => startNextLevel(sequence), 1000);
      }
    }
  };
  const handleCall = (contact) => {
    if (contact === "Riya") {
      Alert.alert(
        "Calling Riya...",
        '"Please bring the phone to me, I know where Aarav is."',
        [{ text: "OK", onPress: () => setCurrentScreen("end-screen-good") }]
      );
    } else if (contact === "Mom") {
      Alert.alert("Calling Mom...", "The call goes to voicemail.");
    } else if (contact === "Unknown") {
      Alert.alert(
        "Calling Unknown...",
        '"Stay out of this, or you’ll regret it."',
        [
          {
            text: "Hang Up",
            onPress: () => setCurrentScreen("end-screen-secret"),
            style: "destructive",
          },
        ]
      );
    }
  };
  const renderContent = () => {
    if (contactsRestored) {
      return (
        <ScrollView>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleCall("Riya")}
          >
            <Text style={styles.contactName}>Riya (Best Friend)</Text>
            <Phone color="#22C55E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleCall("Mom")}
          >
            <Text style={styles.contactName}>Mom</Text>
            <Phone color="#22C55E" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactItem}
            onPress={() => handleCall("Unknown")}
          >
            <Text style={styles.contactName}>Unknown</Text>
            <Phone color="#22C55E" />
          </TouchableOpacity>
        </ScrollView>
      );
    }
    let statusText = `Level ${level}`;
    if (gameStatus === "idle") statusText = "No contacts found.";
    if (gameStatus === "watching")
      statusText = `Watch the pattern... (Level ${level})`;
    if (gameStatus === "playing") statusText = `Your turn... (Level ${level})`;
    if (gameStatus === "failed") statusText = "Data corrupted. Resetting...";
    return (
      <View style={styles.contactsRestoreContainer}>
        <DownloadCloud color="#8B5CF6" size={64} />
        <Text style={styles.contactsRestoreTitle}>{statusText}</Text>
        <Text style={styles.contactsRestoreSubtitle}>
          Memorize the sequence to restore contacts.
        </Text>
        <View style={styles.gameGrid}>
          {[...Array(9).keys()].map((index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.gameButton,
                activeButton === index && styles.gameButtonActive,
              ]}
              onPress={() => handlePlayerPress(index)}
              disabled={gameStatus !== "playing"}
            />
          ))}
        </View>
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={() => startNextLevel(sequence)}
          disabled={gameStatus !== "idle"}
        >
          <Text style={styles.resetButtonText}>Start Restore</Text>
        </TouchableOpacity>
      </View>
    );
  };
  return (
    <View style={styles.appContainer}>
      <AppHeader
        title="Contacts"
        onBack={() => setCurrentScreen("home-screen")}
        rightIcon={null}
      />
      {renderContent()}
    </View>
  );
};
const SudokuPuzzleScreen = ({ onBack, onSolve }) => {
  const [board, setBoard] = useState(SUDOKU_PUZZLE.map((row) => [...row]));
  const [selectedCell, setSelectedCell] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  useEffect(() => {
    const isBoardFull = board.every((row) => row.every((cell) => cell !== 0));
    setIsComplete(isBoardFull);
  }, [board]);
  const handleSelectCell = (row, col) => {
    if (SUDOKU_PUZZLE[row][col] === 0) {
      setSelectedCell({ row, col });
    }
  };
  const handleNumpadInput = (num) => {
    if (selectedCell) {
      const newBoard = board.map((row) => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = num;
      setBoard(newBoard);
    }
  };
  const handleDelete = () => {
    if (selectedCell) {
      const newBoard = board.map((row) => [...row]);
      newBoard[selectedCell.row][selectedCell.col] = 0;
      setBoard(newBoard);
    }
  };
  const handleCheck = () => {
    if (JSON.stringify(board) === JSON.stringify(SUDOKU_SOLUTION)) {
      Alert.alert("Success!", "Image data recovered.", [
        { text: "OK", onPress: onSolve },
      ]);
    } else {
      Alert.alert(
        "Incorrect",
        "The solution is not valid. Please check your numbers."
      );
    }
  };
  return (
    <View style={styles.appContainer}>
      {" "}
      <AppHeader
        title="Recovering Image..."
        onBack={onBack}
        rightIcon={
          <Check size={24} color={!isComplete ? "#4B5563" : "white"} />
        }
        onRightIconPress={handleCheck}
      />{" "}
      <View style={styles.sudokuContainer}>
        {" "}
        <Text style={styles.sudokuInstructions}>
          Fill the grid. Each row, column, and colored region must contain
          numbers 1-5 without repetition.
        </Text>{" "}
        <View style={styles.sudokuGrid}>
          {" "}
          {board.map((row, r) =>
            row.map((cell, c) => {
              const isPuzzleCell = SUDOKU_PUZZLE[r][c] !== 0;
              const isSelected =
                selectedCell &&
                selectedCell.row === r &&
                selectedCell.col === c;
              const region = SUDOKU_REGIONS[r][c];
              const borderStyle = {
                borderTopWidth:
                  r > 0 && SUDOKU_REGIONS[r - 1][c] !== region ? 2 : 0.5,
                borderLeftWidth:
                  c > 0 && SUDOKU_REGIONS[r][c - 1] !== region ? 2 : 0.5,
                borderBottomWidth:
                  r < 4 && SUDOKU_REGIONS[r + 1][c] !== region ? 2 : 0.5,
                borderRightWidth:
                  c < 4 && SUDOKU_REGIONS[r][c + 1] !== region ? 2 : 0.5,
              };
              return (
                <TouchableOpacity
                  key={`${r}-${c}`}
                  style={[
                    styles.sudokuCell,
                    borderStyle,
                    isSelected && styles.sudokuCellSelected,
                  ]}
                  onPress={() => handleSelectCell(r, c)}
                >
                  {" "}
                  <Text
                    style={[
                      styles.sudokuCellText,
                      isPuzzleCell && styles.sudokuCellPuzzle,
                    ]}
                  >
                    {" "}
                    {cell !== 0 ? cell : ""}{" "}
                  </Text>{" "}
                </TouchableOpacity>
              );
            })
          )}{" "}
        </View>{" "}
        <View style={styles.sudokuNumpad}>
          {" "}
          {[1, 2, 3, 4, 5].map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.sudokuNumpadButton}
              onPress={() => handleNumpadInput(num)}
            >
              <Text style={styles.numpadText}>{num}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.sudokuNumpadButton}
            onPress={handleDelete}
          >
            <Delete size={28} color="white" />
          </TouchableOpacity>{" "}
        </View>{" "}
      </View>{" "}
    </View>
  );
};
const MinesweeperPuzzleScreen = ({ onBack, onSolve }) => {
  const [board, setBoard] = useState(generateMinesweeperBoard());
  const [gameState, setGameState] = useState("playing");
  const [isFlagMode, setIsFlagMode] = useState(false);
  const flagsPlaced = board.flat().filter((cell) => cell.isFlagged).length;
  const revealEmptyCells = (r, c, currentBoard) => {
    if (
      r < 0 ||
      r >= GRID_SIZE ||
      c < 0 ||
      c >= GRID_SIZE ||
      currentBoard[r][c].isRevealed
    ) {
      return;
    }
    currentBoard[r][c].isRevealed = true;
    if (currentBoard[r][c].neighboringMines === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr !== 0 || dc !== 0) {
            revealEmptyCells(r + dr, c + dc, currentBoard);
          }
        }
      }
    }
  };
  const checkWinCondition = (currentBoard) => {
    const revealedCount = currentBoard
      .flat()
      .filter((cell) => cell.isRevealed).length;
    if (revealedCount === GRID_SIZE * GRID_SIZE - NUM_MINES) {
      setGameState("won");
      Alert.alert("Decryption Complete", "You have recovered the note.", [
        { text: "View Note", onPress: onSolve },
      ]);
    }
  };
  const handleCellPress = (r, c) => {
    if (gameState !== "playing" || board[r][c].isRevealed) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    if (isFlagMode) {
      if (!newBoard[r][c].isRevealed) {
        newBoard[r][c].isFlagged = !newBoard[r][c].isFlagged;
      }
    } else {
      if (newBoard[r][c].isFlagged) return;
      if (newBoard[r][c].isMine) {
        setGameState("lost");
        newBoard.forEach((row) =>
          row.forEach((cell) => {
            if (cell.isMine) cell.isRevealed = true;
          })
        );
        Alert.alert(
          "Corruption!",
          "The file was corrupted. Restarting decryption..."
        );
      } else {
        revealEmptyCells(r, c, newBoard);
      }
    }
    setBoard(newBoard);
    if (gameState === "playing" && !isFlagMode) checkWinCondition(newBoard);
  };
  const restartGame = () => {
    setBoard(generateMinesweeperBoard());
    setGameState("playing");
    setIsFlagMode(false);
  };
  const numColors = ["#3B82F6", "#22C55E", "#EF4444", "#FBBF24", "#A855F7"];
  return (
    <View style={styles.appContainer}>
      {" "}
      <AppHeader
        title="Decrypting Note..."
        onBack={onBack}
        rightIcon={
          isFlagMode ? (
            <Flag color="white" size={24} />
          ) : (
            <Axe color="white" size={24} />
          )
        }
        onRightIconPress={() => setIsFlagMode(!isFlagMode)}
      />{" "}
      <View style={styles.minesweeperContainer}>
        {" "}
        <View style={styles.mineStats}>
          {" "}
          <Text style={styles.mineText}>
            <Bomb size={16} color="#EF4444" /> {NUM_MINES}
          </Text>{" "}
          <Text style={styles.mineText}>
            <Flag size={16} color="#FBBF24" /> {flagsPlaced}
          </Text>{" "}
        </View>{" "}
        <View style={styles.mineGrid}>
          {" "}
          {board.map((row, r) =>
            row.map((cell, c) => (
              <TouchableOpacity
                key={`${r}-${c}`}
                style={[
                  styles.mineCell,
                  cell.isRevealed && styles.mineCellRevealed,
                ]}
                onPress={() => handleCellPress(r, c)}
              >
                {" "}
                {cell.isRevealed &&
                  !cell.isMine &&
                  cell.neighboringMines > 0 && (
                    <Text
                      style={[
                        styles.mineNumber,
                        { color: numColors[cell.neighboringMines - 1] },
                      ]}
                    >
                      {cell.neighboringMines}
                    </Text>
                  )}{" "}
                {cell.isRevealed && cell.isMine && (
                  <Bomb color="white" size={24} />
                )}{" "}
                {!cell.isRevealed && cell.isFlagged && (
                  <Flag color="#FBBF24" size={24} />
                )}{" "}
              </TouchableOpacity>
            ))
          )}{" "}
        </View>{" "}
        {gameState === "lost" && (
          <TouchableOpacity style={styles.resetButton} onPress={restartGame}>
            <Text style={styles.resetButtonText}>Retry Decryption</Text>
          </TouchableOpacity>
        )}{" "}
      </View>{" "}
    </View>
  );
};
const BrowserApp = ({ setCurrentScreen }) => {
  const [page, setPage] = useState("home");
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    if (
      query.toUpperCase().trim().replace(/\s+/g, "") ===
      ANAGRAM_CLUE.replace(/\s+/g, "")
    ) {
      setPage("results");
    } else {
      Alert.alert("Search", "No results found for your query.");
    }
  };
  const renderPage = () => {
    if (page === "article") {
      return (
        <ScrollView style={styles.browserPage}>
          {" "}
          <Text style={styles.articleTitle}>
            Urban Explorers Uncover History at Old Stacy Station
          </Text>{" "}
          <Text style={styles.articleMeta}>
            Posted by City Gazette | Sept 7
          </Text>{" "}
          <Text style={styles.articleBody}>
            {" "}
            A local group of urban explorers has brought renewed attention to
            the long-abandoned Old Stacy Station, a once-bustling hub now left
            to decay. The group shared images of the station's graffiti-covered
            walls and crumbling platforms, reminding residents of a forgotten
            piece of city history...{" "}
          </Text>{" "}
          <TouchableOpacity onPress={() => setPage("results")}>
            <Text style={styles.backLink}>{"< Back to results"}</Text>
          </TouchableOpacity>{" "}
        </ScrollView>
      );
    }
    if (page === "results") {
      return (
        <View style={styles.browserPage}>
          {" "}
          <Text style={styles.resultsHeader}>
            Showing results for "{ANAGRAM_CLUE}"
          </Text>{" "}
          <TouchableOpacity
            style={styles.searchResult}
            onPress={() => setPage("article")}
          >
            {" "}
            <Text style={styles.resultTitle}>
              Urban Explorers Uncover History at Old Stacy Station
            </Text>{" "}
            <Text style={styles.resultUrl}>
              citygazette.news/old-stacy-station
            </Text>{" "}
            <Text style={styles.resultDesc}>
              A local group has brought renewed attention to the long-abandoned
              Old Stacy Station...
            </Text>{" "}
          </TouchableOpacity>{" "}
          <TouchableOpacity
            style={styles.searchResult}
            onPress={() => Alert.alert("Anagram Solver", "OLD STACY STATION")}
          >
            {" "}
            <Text style={styles.resultTitle}>
              Anagram Solver - Unscramble Words
            </Text>{" "}
            <Text style={styles.resultUrl}>www.word-solver.com/anagram</Text>{" "}
            <Text style={styles.resultDesc}>
              Solve any anagram or jumbled words with our free tool. Enter your
              letters to find the solution.
            </Text>{" "}
          </TouchableOpacity>{" "}
        </View>
      );
    }
    return (
      <View style={styles.browserHome}>
        {" "}
        <Text style={styles.browserTitle}>Spyglass</Text>{" "}
        <View style={styles.searchBarContainer}>
          {" "}
          <Search color="#6B7280" size={20} />{" "}
          <TextInput
            style={styles.searchBar}
            placeholder="Search or type URL"
            placeholderTextColor="#6B7280"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />{" "}
        </View>{" "}
      </View>
    );
  };
  return (
    <View style={styles.appContainer}>
      {" "}
      <AppHeader
        title="Browser"
        onBack={() => setCurrentScreen("home-screen")}
      />{" "}
      {renderPage()}{" "}
    </View>
  );
};
const EndScreen = ({ title, subtitle, onRestart }) => (
  <View style={styles.endScreenContainer}>
    {" "}
    <Text style={styles.endScreenTitle}>{title}</Text>{" "}
    <Text style={styles.endScreenSubtitle}>{subtitle}</Text>{" "}
    <TouchableOpacity style={styles.restoreButton} onPress={onRestart}>
      {" "}
      <Text style={styles.resetButtonText}>Play Again</Text>{" "}
    </TouchableOpacity>{" "}
  </View>
);
const SequencePuzzleScreen = ({ onBack, onSolve }) => {
  const [shuffledNumbers, setShuffledNumbers] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [error, setError] = useState(false);
  const setupPuzzle = () => {
    setShuffledNumbers(shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]));
    setCorrectCount(0);
    setError(false);
  };
  useEffect(() => {
    setupPuzzle();
  }, []);
  const handlePress = (num) => {
    if (num === SEQUENCE_DATA[correctCount].answer) {
      setCorrectCount((prev) => prev + 1);
      setError(false);
      if (correctCount + 1 === SEQUENCE_DATA.length) {
        // Automatically navigate after a short delay
        setTimeout(() => {
          onSolve();
        }, 1500);
      }
    } else {
      setError(true);
      setTimeout(() => {
        setupPuzzle();
      }, 800);
    }
  };
  return (
    <View style={styles.appContainer}>
      {" "}
      <AppHeader title="Recovering Messages..." onBack={onBack} />{" "}
      <View style={styles.sequenceContainer}>
        {" "}
        <View style={[styles.riddleBox, error && styles.riddleBoxError]}>
          {" "}
          <Text style={styles.currentRiddle}>
            {" "}
            {correctCount < SEQUENCE_DATA.length
              ? SEQUENCE_DATA[correctCount].riddle
              : "DECRYPTION COMPLETE"}{" "}
          </Text>{" "}
        </View>{" "}
        <View style={styles.numpadGrid}>
          {" "}
          {shuffledNumbers.map((num) => (
            <TouchableOpacity
              key={num}
              style={styles.numpadButton}
              onPress={() => handlePress(num)}
            >
              {" "}
              <Text style={styles.numpadText}>{num}</Text>{" "}
            </TouchableOpacity>
          ))}{" "}
        </View>{" "}
      </View>{" "}
    </View>
  );
};

const UnlockedApp = ({ onRestart }) => {
  const [currentScreen, setCurrentScreen] = useState("home-screen");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [contactsRestored, setContactsRestored] = useState(false);
  const [unknownMessageRecovered, setUnknownMessageRecovered] = useState(false);

  const onSudokuSolve = () => {
    setSelectedPhoto(
      "https://placehold.co/400x600/eab308/000000?text=MAP%0AOld+City+Station"
    );
    setCurrentScreen("photo-view");
  };
  const onMinesweeperSolve = () => {
    setCurrentScreen("note-three");
  };
  const onSequenceSolve = () => {
    setUnknownMessageRecovered(true);
    setCurrentScreen("conversation-unknown");
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "home-screen":
        return <HomeScreen setCurrentScreen={setCurrentScreen} />;
      case "messages-app":
        return (
          <MessagesApp
            setCurrentScreen={setCurrentScreen}
            unknownMessageRecovered={unknownMessageRecovered}
          />
        );
      case "conversation-mom":
        return <ConversationMom setCurrentScreen={setCurrentScreen} />;
      case "conversation-riya":
        return <ConversationRiya setCurrentScreen={setCurrentScreen} />;
      case "conversation-unknown":
        return <ConversationUnknown setCurrentScreen={setCurrentScreen} />;
      case "photos-app":
        return (
          <PhotosApp
            setCurrentScreen={setCurrentScreen}
            setSelectedPhoto={setSelectedPhoto}
          />
        );
      case "photo-view":
        return (
          <PhotoView
            setCurrentScreen={setCurrentScreen}
            photo={selectedPhoto}
          />
        );
      case "notes-app":
        return <NotesApp setCurrentScreen={setCurrentScreen} />;
      case "note-one":
        return (
          <NoteScreen
            title="Reminder"
            onBack={() => setCurrentScreen("notes-app")}
          >
            If I disappear, look at the gallery.
          </NoteScreen>
        );
      case "note-two":
        return (
          <NoteScreen
            title="Passwords"
            onBack={() => setCurrentScreen("notes-app")}
          >
            Password = 0925
          </NoteScreen>
        );
      case "note-three":
        return (
          <NoteScreen
            title="URGENT"
            onBack={() => setCurrentScreen("notes-app")}
          >
            He knows about the USB. Don’t trust anyone.{"\n\n"}ODL STCYA TSATOIN
          </NoteScreen>
        );
      case "contacts-app":
        return (
          <ContactsApp
            setCurrentScreen={setCurrentScreen}
            contactsRestored={contactsRestored}
            setContactsRestored={setContactsRestored}
          />
        );
      case "sudoku-puzzle":
        return (
          <SudokuPuzzleScreen
            onBack={() => setCurrentScreen("photos-app")}
            onSolve={onSudokuSolve}
          />
        );
      case "minesweeper-puzzle":
        return (
          <MinesweeperPuzzleScreen
            onBack={() => setCurrentScreen("notes-app")}
            onSolve={onMinesweeperSolve}
          />
        );
      case "sequence-puzzle":
        return (
          <SequencePuzzleScreen
            onBack={() => setCurrentScreen("messages-app")}
            onSolve={onSequenceSolve}
          />
        );
      case "browser-app":
        return <BrowserApp setCurrentScreen={setCurrentScreen} />;
      case "end-screen-good":
        return (
          <EndScreen
            title="Aarav is Safe."
            subtitle="You gave Riya the crucial information, and she was able to help him. Well done."
            onRestart={onRestart}
          />
        );
      case "end-screen-secret":
        return (
          <EndScreen
            title="Now it's your turn."
            subtitle="The screen fades to black..."
            onRestart={onRestart}
          />
        );
      default:
        return <HomeScreen setCurrentScreen={setCurrentScreen} />;
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://res.cloudinary.com/dpm6ze2jo/image/upload/v1757420976/fc857434-48e6-436f-89dc-dde93d9b0259.png",
      }}
      style={styles.flexGrow}
    >
      <View style={styles.flexGrow}>{renderScreen()}</View>
    </ImageBackground>
  );
};

export default function App() {
  const [phoneUnlocked, setPhoneUnlocked] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(15);

  const [gameKey, setGameKey] = useState(1);

  useEffect(() => {
    let batteryTimer;
    batteryTimer = setInterval(() => {
      setBatteryLevel((prev) => {
        if (prev <= 1) {
          clearInterval(batteryTimer);
          setPhoneUnlocked("game-over");
          return 0;
        }
        return prev - 1;
      });
    }, 28000);
    return () => clearInterval(batteryTimer);
  }, [phoneUnlocked]);

  const restartGame = () => {
    setBatteryLevel(15);
    setPhoneUnlocked(false);
    setGameKey((prevKey) => prevKey + 1);
  };

  const renderContent = () => {
    if (phoneUnlocked === true) {
      return <UnlockedApp key={gameKey} onRestart={restartGame} />;
    }
    if (phoneUnlocked === "reset") {
      return <ResetPuzzleScreen setPhoneUnlocked={setPhoneUnlocked} />;
    }
    if (phoneUnlocked === "game-over") {
      return (
        <EndScreen
          title="Battery Depleted"
          subtitle="The phone went dark before you could solve the mystery."
          onRestart={restartGame}
        />
      );
    }
    return <LockScreen setPhoneUnlocked={setPhoneUnlocked} />;
  };

  return (
    <SafeAreaView style={styles.root}>
      <RNStatusBar barStyle="light-content" />
      <ImageBackground
        source={{
          uri: "https://res.cloudinary.com/dpm6ze2jo/image/upload/v1757420976/fc857434-48e6-436f-89dc-dde93d9b0259.png",
        }}
        style={styles.flexGrow}
      >
        <StatusBar isLocked={!phoneUnlocked} batteryLevel={batteryLevel} />
        {renderContent()}
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "black" },
  flexGrow: { flex: 1 },
  statusBarLocked: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 24,
    zIndex: 10,
  },
  statusBarUnlocked: {
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    zIndex: 10,
  },
  statusBarText: { color: "white", fontSize: 14, fontWeight: "bold" },
  statusBarIcons: { flexDirection: "row", alignItems: "center", gap: 8 },
  appIconContainer: { width: "25%", padding: 8, alignItems: "center", gap: 8 },
  appIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  appIconName: { color: "white", fontSize: 12, textAlign: "center" },
  appHeader: {
    padding: 12,
    backgroundColor: "#1F2937",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appHeaderBack: { padding: 4, minWidth: 32, alignItems: "center" },
  appHeaderTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
  },
  lockScreenContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 64,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  lockScreenDateTime: { alignItems: "center" },
  lockScreenTime: { color: "white", fontSize: 60, fontWeight: "200" },
  lockScreenDate: { color: "white", fontSize: 20 },
  pinContainer: { alignItems: "center", gap: 16 },
  pinError: { height: 24, color: "#F87171", fontWeight: "bold" },
  pinDotsContainer: { flexDirection: "row", gap: 16 },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "white",
  },
  pinDotFilled: { backgroundColor: "white" },
  forgotPinText: { color: "#93C5FD", fontSize: 14, marginTop: 4, height: 24 },
  enterPinText: {
    fontSize: 14,
    color: "#E5E7EB",
    height: 24,
    marginTop: 4,
    textAlign: "center",
  },
  numpadGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: 288,
    gap: 24,
  },
  numpadButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  numpadText: { color: "white", fontSize: 30 },
  numpadSpacer: { width: 80, height: 80 },
  numpadDelete: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  resetContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  resetContent: { padding: 32, width: "100%", alignItems: "center" },
  closeButton: { position: "absolute", top: -10, left: 10, padding: 8 },
  resetTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  resetQuestion: {
    fontSize: 18,
    color: "white",
    marginBottom: 8,
    fontStyle: "italic",
    textAlign: "center",
  },
  resetSubtitle: {
    color: "#D1D5DB",
    marginBottom: 32,
    textAlign: "center",
    fontSize: 12,
  },
  resetInput: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    color: "white",
    borderRadius: 8,
    padding: 12,
    width: "100%",
    marginBottom: 8,
    textAlign: "center",
    fontSize: 18,
    letterSpacing: 2,
  },
  resetError: { color: "#F87171", height: 20, marginBottom: 12 },
  resetButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 8,
    padding: 12,
    width: "100%",
  },
  resetButtonText: { color: "white", fontSize: 18, textAlign: "center" },
  homeScreenContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 16,
    paddingTop: 32,
  },
  appContainer: { backgroundColor: "#111827", flex: 1 },
  messageItem: {
    padding: 12,
    backgroundColor: "#374151",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontWeight: "bold", fontSize: 20, color: "white" },
  messageName: { fontWeight: "bold", color: "white" },
  messagePreview: { fontSize: 14, color: "#9CA3AF" },
  conversationScroll: { padding: 12, gap: 12 },
  chatBubble: { padding: 12, borderRadius: 12, maxWidth: "80%" },
  senderBubble: { backgroundColor: "#3B82F6", alignSelf: "flex-end" },
  receiverBubble: { backgroundColor: "#4B5563", alignSelf: "flex-start" },
  chatText: { color: "white" },
  photoGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, padding: 8 },
  thumbnail: { width: 110, height: 110, borderRadius: 4 },
  lockedThumbnail: {
    width: 110,
    height: 110,
    borderRadius: 4,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  lockedThumbnailText: { color: "#FBBF24", fontSize: 12, fontWeight: "600" },
  photoViewContainer: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
  },
  photoViewClose: {
    position: "absolute",
    top: 48,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
  },
  fullScreenImage: { width: "100%", height: "100%" },
  noteItem: {
    padding: 16,
    backgroundColor: "#374151",
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTitle: { fontWeight: "bold", color: "white" },
  notePreview: { fontSize: 14, color: "#9CA3AF", marginTop: 4 },
  noteContent: { color: "white", lineHeight: 24, fontSize: 16 },
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#374151",
  },
  contactName: { color: "white", fontSize: 16 },
  endScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    backgroundColor: "#111827",
  },
  endScreenTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
    textAlign: "center",
  },
  endScreenSubtitle: { color: "#D1D5DB", lineHeight: 22, textAlign: "center" },
  contactsRestoreContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  contactsRestoreTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  contactsRestoreSubtitle: {
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 16,
  },
  gameGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 240,
    justifyContent: "center",
    gap: 12,
  },
  gameButton: {
    width: 72,
    height: 72,
    backgroundColor: "#374151",
    borderRadius: 16,
  },
  gameButtonActive: { backgroundColor: "#8B5CF6" },
  restoreButton: {
    backgroundColor: "#8B5CF6",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 24,
  },
  sudokuContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  sudokuInstructions: {
    color: "#D1D5DB",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 14,
    paddingHorizontal: 20,
  },
  sudokuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    height: 300,
    backgroundColor: "#111827",
  },
  sudokuCell: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#4B5563",
  },
  sudokuCellSelected: { backgroundColor: "#4B5563" },
  sudokuCellText: { color: "white", fontSize: 24, fontWeight: "bold" },
  sudokuCellPuzzle: { color: "#FBBF24" },
  sudokuNumpad: { flexDirection: "row", gap: 8, paddingVertical: 16 },
  sudokuNumpadButton: {
    width: 48,
    height: 48,
    backgroundColor: "#374151",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  minesweeperContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    gap: 20,
  },
  mineStats: {
    flexDirection: "row",
    gap: 24,
    backgroundColor: "#1F2937",
    padding: 12,
    borderRadius: 8,
  },
  mineText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    flexDirection: "row",
    alignItems: "center",
  },
  mineGrid: { flexDirection: "row", flexWrap: "wrap", width: 300, height: 300 },
  mineCell: {
    width: 60,
    height: 60,
    backgroundColor: "#374151",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#4B5563",
  },
  mineCellRevealed: {
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "#374151",
  },
  mineNumber: { fontSize: 20, fontWeight: "bold" },
  browserHome: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  browserTitle: {
    color: "white",
    fontSize: 48,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#374151",
    borderRadius: 24,
    paddingHorizontal: 16,
    width: "100%",
  },
  searchBar: { flex: 1, color: "white", paddingVertical: 12, fontSize: 16 },
  browserPage: { flex: 1, padding: 16 },
  resultsHeader: { color: "#9CA3AF", marginBottom: 16 },
  searchResult: { marginBottom: 24 },
  resultTitle: { color: "#818CF8", fontSize: 18, marginBottom: 2 },
  resultUrl: { color: "#22C55E", fontSize: 12, marginBottom: 4 },
  resultDesc: { color: "#D1D5DB" },
  articleTitle: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  articleMeta: { color: "#9CA3AF", fontSize: 12, marginBottom: 16 },
  articleBody: { color: "#E5E7EB", fontSize: 16, lineHeight: 24 },
  backLink: { color: "#818CF8", marginTop: 24 },
  sequenceContainer: {
    flex: 1,
    justifyContent: "space-evenly",
    padding: 24,
    alignItems: "center",
  },
  riddleBox: {
    backgroundColor: "#1F2937",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 80,
    borderWidth: 2,
    borderColor: "transparent",
  },
  riddleBoxError: { borderColor: "#EF4444" },
  currentRiddle: {
    color: "#FBBF24",
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
  },
});
