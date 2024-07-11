import React, { useState } from "react";
import BlastDisplay from "../components/BlastDisplay";
import ListsDisplay from "../components/ListsDisplay";
import ListWithProps from "../components/ListWithProps";
import CreateContactForm from "../components/CreateContactForm";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MailingListEditor from "../components/MailingListEditor";
import { MailingList } from "../../../shared/types/Types";
import MLEditor from "../components/MLEditor.tsx";
import EditListName from "../components/EditListName";
import CreateNewListForm from "../components/CreateNewListForm";

export default function MailingListManager(onListSelect) {
  // const [blast, setBlast] = useState<Object>({})
  const [selectedList, setSelectedList] = useState<MailingList | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const [list, setList] = React.useState(false);
  const [window, setWindow] = React.useState(false);
  const [toggled, setToggled] = React.useState(false);

  const handleListSelect = (list: MailingList) => {
    setSelectedList(list);
  };

  console.log("toggled", toggled);
  return (
    <>
      <div className="general-box">
        <div className="sidebar">
          <MLEditor />
        </div>
        <div className="content-window">
          <CreateContactForm />
          <CreateNewListForm />
          <EditListName />
        </div>
      </div>
    </>
  );
}
