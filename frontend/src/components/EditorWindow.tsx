import React, { useState, useEffect } from "react";
import ListsDisplay from "./ListsDisplay";

// Here, whenever a specific component from the sidebar gets clicked
//it will be rendered in a window

export default function MailingListEditorWindow() {
  return (
    <>
      <ListsDisplay />
    </>
  );
}
