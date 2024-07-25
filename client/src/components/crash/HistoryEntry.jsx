import React, { useState, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import parseCommasToThousands from "../../utils/parseCommasToThousands";
import cutDecimalPoints from "../../utils/cutDecimalPoints";

// MUI Components
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";

// Components
import ProvablyModal from "../modals/crash/ProvablyModal";

// Custom Styled Component
const Multiplier = withStyles(theme => ({
  root: {
    background: props => props.color,
    "&:hover": {
      background: props => props.color,
    },
    color: "white",
    marginRight: 5,
    marginTop: 50,
    [theme.breakpoints.down("sm")]: {
      marginTop: 10,
      fontSize: "0.675rem",
      padding: "4px 8px",
      minWidth: "initial",
    },
  },
}))(Button);

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
          {game.crashPoint < 1.2 ? (
            <Multiplier size="medium" color="#F53737" variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
          ) : game.crashPoint >= 1.2 && game.crashPoint < 2 ? (
            <Multiplier size="medium" color="#1F2225" variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
          ) : game.crashPoint >= 2 && game.crashPoint < 100 ? (
            <Multiplier size="medium" color="#3CC65D" variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
          ) : (
            <Multiplier size="medium" color="#848B8D" variant="contained">
              {parseCommasToThousands(
                cutDecimalPoints(game.crashPoint.toFixed(2))
              )}
            </Multiplier>
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
