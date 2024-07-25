import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";

// MUI Components
import Box from "@material-ui/core/Box";
import Tooltip from "@material-ui/core/Tooltip";

// Components
import ProvablyModal from "../modals/roulette/ProvablyModal";

// Custom Styled Component
const His = withStyles({
  root: {
    cursor: "pointer",
    marginRight: 10,
    background: props => props.bg,
    color: "white",
    height: props => props.height,
    boxShadow: props => props.glow,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    width: 2,
  },
})(Box);

const HistoryEntry = ({ game }) => {
  // Declare State
  const [modalVisible, setModalVisible] = useState(false);

  // Button onClick event handler
  const onClick = () => {
    setModalVisible(state => !state);
  };

  return (
    <Fragment>
      <ProvablyModal
        game={game}
        open={modalVisible}
        handleClose={() => setModalVisible(state => !state)}
      />
      <div onClick={onClick}>
        <Tooltip title="Click to view Provably Fair" placement="bottom">
          {game.winner === "yellow" ? (
            <His height="1rem" bg="#343449" />
          ) : game.winner === "blue" ? (
            <His height="1rem" bg="#5C6AF8" />
          ) : game.winner === "purple" ? (
            <His height="1.25rem" bg="#b157ce" />
          ) : game.winner === "green" ? (
            <His height="1.5rem" bg="#ECA93A" />
          ) : game.winner === "red" ? (
            <His height="1.75rem" bg="#1EB9F2" />
          ) : game.winner === "pink" ? (
            <His height="2rem" bg="#CB6734" />
          ) : game.winner === "7x" ? (
            <His height="2rem" bg="#b2b2b2" glow="0px 0px 10px #b2b2b2" />
          ) : game.winner === "mystery" ? (
            <His height="2rem" bg="#bea56e" glow="0px 0px 10px #bea56e" />
          ) : (
            <span>Invalid</span>
          )}
        </Tooltip>
      </div>
    </Fragment>
  );
};

HistoryEntry.propTypes = {
  game: PropTypes.object.isRequired,
};

export default HistoryEntry;
