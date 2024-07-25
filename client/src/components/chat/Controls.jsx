import React, { useState } from "react";
import { withStyles, makeStyles } from "@material-ui/core";
import ReactGiphySearchbox from "react-giphy-searchbox";
import { chatSocket } from "../../services/websocket.service";

// MUI Components
import Box from "@material-ui/core/Box";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";

// Components
import ChatRulesModal from "../modals/ChatRulesModal";

// Icons
import GifIcon from "@material-ui/icons/Gif";

// Components
import Rain from "./Rain";
import Trivia from "./Trivia";

// Custom styles
const useStyles = makeStyles(theme => ({
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    display: "flex",
    flexDirection: "column",
    //background: "linear-gradient(to bottom right, #15022e 0%, #000000 75%)",
    background: "#1F2225",
    paddingBottom: "1rem",
  },
  icon: {
    color: "#343a5b",
    marginLeft: "auto",
    fontSize: 15,
  },
  online: {
    display: "flex",
    alignItems: "center",
    marginLeft: "1rem",
    color: "#fff",
    fontSize: 13,
    "& span": {
      marginRight: 5,
      color: "#3CC65D",
    },
    "& p": {
      marginRight: 3,
    },
  },
  giphy: {
    background: "#1F2225",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    zIndex: 100,
    bottom: "4rem",
    left: "10rem",
    opacity: 1,
    pointerEvents: "all",
    transition: "opacity 0.25s ease",
    "& input": {
      background: "#1F2225",
      border: "none",
      color: "white",
      paddingLeft: 10,
      "&::placeholder": {
        color: "#1F2225",
      },
    },
  },
  removed: {
    background: "#1F2225",
    padding: 10,
    borderRadius: 5,
    position: "absolute",
    zIndex: 100,
    bottom: "4rem",
    left: "10rem",
    "& input": {
      background: "#1F2225",
      border: "none",
      color: "white",
      paddingLeft: 10,
      "&::placeholder": {
        color: "#1F2225",
      },
    },
    opacity: 0,
    pointerEvents: "none",
    transition: "opacity 0.25s ease",
  },
}));

// Custom styled component
const ChatInput = withStyles(theme => ({
  root: {
    width: "100%",
    padding: "1rem",
    "& :before": {
      display: "none",
    },
    "& label": {
      color: "#FFFFFF",
      fontSize: 15,
      padding: 18,
      paddingLeft: 20,
    },
    "& div input": {
      color: "#FFFFFF",
    },
    "& div": {
      background: "",
    },
  },
}))(TextField);

// Custom styled component
const Send = withStyles({
  root: {
    backgroundColor: "#2C3034",
    borderColor: "#1F2225",
    color: "white",
    transform: "",
    margin: "auto",
    marginRight: "1rem",
    marginLeft: "0",
    fontSize: 10,
    "&:hover": {
      textShadow: "0px 0px 10px",
      backgroundColor: "#2C3034"
    },
  },
})(Button);

// Custom styled component
const Emoji = withStyles({
  root: {
    color: "white",
    opacity: 0.25,
  },
})(GifIcon);

const Controls = ({ usersOnline, rain, trivia }) => {
  // Declare state
  const classes = useStyles();
  const [modalVisible, setModalVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");

  const gifFunc = (data, open) => {
    // console.log(inputState);
    setOpen(open);
    setInput(data);
  };

  // TextField onKeyPress event handler
  const onKeyPress = e => {
    // If enter was pressed
    if (e.key === "Enter") {
      chatSocket.emit("send-chat-message", input);
      setInput("");
      return false;
    }
  };

  // Input onChange event handler
  const onChange = e => {
    setInput(e.target.value);
  };

  // Button onClick event handler
  const onClick = () => {
    chatSocket.emit("send-chat-message", input);
    setInput("");
  };

  // TextInput onFocus event handler
  const onFocus = () => {
    const agreed = Boolean(window.localStorage.getItem("chat-rules-agreed"));

    // If user hasn't agreed the rules on this device
    if (!agreed) {
      setModalVisible(state => !state);
      window.localStorage.setItem("chat-rules-agreed", "true");
    }
  };

  return (
    <div>
      {rain && rain.active && <Rain rain={rain} />}
      {trivia && trivia.active && <Trivia trivia={trivia} />}
      <ReactGiphySearchbox
        apiKey="1nPE3oK3S7byekhnHoLrwGEeqxB0R98B" // Required: get your on https://developers.giphy.com
        onSelect={item => gifFunc(item.images.downsized.url, !open)}
        wrapperClassName={open ? classes.giphy : classes.removed}
        poweredByGiphy={false}
      />
      <ChatRulesModal
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <Box className={classes.input}>
        <ChatInput
          label="Type a message"
          variant="filled"
          onChange={onChange}
          onKeyPress={onKeyPress}
          onFocus={onFocus}
          value={input}
        />
        <Box display="flex">
          <Box className={classes.online}>
            <span>●</span>
            <p>{usersOnline}</p>
            Online
          </Box>
          <IconButton
            onClick={() => setOpen(!open)}
            color="primary"
            style={{ marginLeft: "auto" }}
          >
            <Emoji />
          </IconButton>
          <Send onClick={onClick} variant="contained">
            Send
          </Send>
        </Box>
      </Box>
    </div>
  );
};

export default Controls;
