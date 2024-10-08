import React from "react";
import { makeStyles } from "@material-ui/core/styles";

// MUI Containers
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

// Custom Styles
const useStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "50rem",
    // overflow: "auto",
    padding: "2rem 0",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center",
    color: "#fff",
    "& img": {
      width: "5rem",
      marginBottom: "1rem",
    },
    "& h1": {
      // fontSize: 50,
      margin: "0 0 2rem 0",
      color: "#FFF",
    },
    "& b": {
      color: "#FFF",
    },
  },
});

const Terms = () => {
  // Declare State
  const classes = useStyles();

  return (
    <Box className={classes.root}>
      <Container className={classes.container}>
        <h1>Terms Of Services</h1>
        <section>
          <p>
            This end user agreement (the "Agreement") should be read by you (the
            "User" or "you") in its entirety prior to your use of duelspins.com’s
            service or products. Please note that the Agreement constitutes a
            legally binding agreement between you and Moonbet (referred to herein
            as "Moonbet", "us" or "we"). By signing up on site and using our services, you consent to the terms
            and conditions set forth in this Agreement.
          </p>
        </section>
        <section>
          <b>1. Grant of License</b>
          <p>
            i. Subject to the terms and conditions contained, Moonbet grants the
            User a non-exclusive, personal, non-transferable right to use the
            Service on your personal computer or other device that accesses the
            Internet in order to access the games available and described on the
            duelspins.com website
          </p>
          <p>
            ii. The Service is not for use by individuals under 18 years of age,
            individuals under the legal age of majority in their jurisdiction
            and individuals accessing the Service from jurisdictions from which
            it is illegal to do so.
          </p>
        </section>
        <section>
          <b>2. Prohibited Uses</b>
          <p>
            i. PERSONAL USE. The Service is intended solely for the User’s
            personal use. The User is only allowed to wager for his/her personal
            entertainment and may not create multiple accounts, including for
            the purpose of collusion and/or abuse of service. duelspins.com is in no way
            liable in any way to compensate the lost wager. If we are to found out you 
            were abusing, we reserve the right to terminate your account without 
            prior notice and comprise restricive measures to ensure the future abuse or collusion of our services.
           
          </p>
        </section>
        <section>
          <b>3. Know Your Customer (KYC)</b>
          <p>
            Moonbet.vip reserve the right to ask any user at any time for any KYC
            documentation, Moonbet.vip reserve the right to restrict the withdraw
            until identity is sufficiently determined. duelspins.com may have the right
            to withhold your withdraw of wager request till the KYC process has been
            completed in full with the user's legal jurisdiction's laws.
          </p>
        </section>
        <section>
          <b>4. Breach</b>
          <p>
            Without prejudice to any other rights, if a User breaches in whole,
            Moonbet.vip reserves the right to take such action, including
            terminating this Agreement or any other agreement in place with the
            User and/or taking legal action against such User. In the event of a 
            exploit abused by the user, duelspins.com retains the right to use 
            information collected on the user, including but not limited to
            ("IP address", "Billing Address", "KYC ID information") to pursue 
            legal action agasint said user. 
          </p>
        </section>
        <section>
          <b>5. Your Representations and Authorities</b>
          <p>
            i. Your use of the Service is at your sole option, discretion and
            risk;
          </p>
          <p>
            ii. You are solely responsible for any applicable taxes which may be
            payable on cryptocurrency awarded to you through your using the
            Service;
          </p>
          <p>
            iii. You are aged 18 or over, you are of the age of majority in your
            jurisdiction, you are accessing the Service from a jurisdiction in
            which it is legal to do.
          </p>
        </section>
        <section>
          <b>6. No Warranties</b>
          <p>
            i. duelspins.com disclaims any and all warranties, expressed or implied,
            in connection with the service which is provided to you "as is" and
            we provide you with no warranty or representation whatsoever
            regarding its quality, fitness for purpose, completeness or
            accuracy.
          </p>
          <p>
            ii. duelspins.com makes no warranty that the service will be
            uninterrupted, timely or error-free, or that defects will be
            corrected.
          </p>
        </section>
        <section>
          <b>
            N.B: We reserve the right to change or modify this Agreement without
            prior notice. Therefore, we encourage you check the terms and
            conditions contained in the version of the Agreement in force at
            such time. If any issue may be found in this agreement or you would like
            to provide a legal inquiry on our operations, you can contract us at
            legal@duelspins.com, or mix@duelspins.com to mediate your inquiry.
          </b>
        </section>
      </Container>
    </Box>
  );
};

export default Terms;