import React from "react";
import { FormStreamers } from "../formStreamers/formStreamers";
import { ListOfStreamers } from "../listOfStreamers/listOfStreamers";

export const Home = () => {
  return (
    <>
      <FormStreamers />
      <ListOfStreamers />
    </>
  )
}