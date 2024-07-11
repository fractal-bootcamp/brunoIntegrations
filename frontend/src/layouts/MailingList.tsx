import React, { useState } from "react";
import BlastDisplay from "../components/BlastDisplay";
import ListsDisplay from "../components/ListsDisplay";
import ListWithProps from "../components/ListWithProps";
import CreateContactForm from "../components/CreateContactForm";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MailingListEditor from "../components/MailingListEditor";
import { MailingList } from "../../../shared/types/Types";

export default function MailingListManager(onListSelect) {
  // const [blast, setBlast] = useState<Object>({})
  const [selectedList, setSelectedList] = useState<MailingList | null>(null);
  const [collapsed, setCollapsed] = React.useState(false);
  const [list, setList] = React.useState(false);
  const [window, setWindow] = React.useState(false);

  const handleListSelect = (list: MailingList) => {
    setSelectedList(list);
  };

  return (
    <>
      <div className="general-box">
        <div className="sidebar">
          <div style={{ display: "flex", height: "100%", minHeight: "400px" }}>
            <Sidebar collapsed={collapsed}>
              <Menu>
                <SubMenu className="element" label="Mailing lists">
                  <MenuItem component={<CreateContactForm />}></MenuItem>
                  <MenuItem onListSelect={handleListSelect}>
                    <ListsDisplay />
                  </MenuItem>
                </SubMenu>

                <SubMenu
                  className="element"
                  label="Blasts"
                  component="BlastDisplay"
                ></SubMenu>
              </Menu>
            </Sidebar>
          </div>
        </div>
        <div className="content-window">
          <h1>
            <p>{selectedList}</p>
          </h1>
        </div>
      </div>
    </>
  );
}
