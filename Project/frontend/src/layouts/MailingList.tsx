import React, { useState } from "react";
import BlastDisplay from "../components/BlastDisplay";
import ListsDisplay from "../components/ListsDisplay";
import ListWithProps from "../components/ListWithProps";
import CreateContactForm from "../components/CreateContactForm";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import MailingListEditor from "../components/MailingListEditor";

export default function MailingListManager() {
  // const [blast, setBlast] = useState<Object>({})
  const [list, setList] = useState<Object>({});
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <>
      <div className="general-box">
        <div className="sidebar">
          <div style={{ display: "flex", height: "100%", minHeight: "400px" }}>
            <Sidebar collapsed={collapsed}>
              <Menu>
                <SubMenu
                  className="element"
                  label="Mailing lists"
                  component="ListsDisplay"
                >
                  <MenuItem component={<CreateContactForm />}></MenuItem>
                  <MenuItem component={<ListsDisplay />}>
                    See all mailing lists
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
          <MailingListEditor />
        </div>
      </div>
    </>
  );
}
