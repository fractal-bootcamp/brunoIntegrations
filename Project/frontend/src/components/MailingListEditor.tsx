import React, { useState, useEffect } from "react";
import EditListName from "./EditListName";
import ListsDisplay from "./ListsDisplay";

const object = {
  name: "Lonx",
};

export default function MailingListEditor() {
  //When rendered, the list will fetch the emails from the
  //data in that particular spot
  //
  return (
    <>
      <div className="mailing-list-editor-main-body">
        <EditListName name={object.name} />

        <div className="mailing-list-editor-add-new-contact">
          <div className="mailing-list-editor-new-contact-input-and-btn">
            <button>Add new contact</button>
            <p>HERE FORM WHEN BUTTON CLICKED</p>
          </div>
        </div>

        <div>
          <div className="mailing-list-editor-element-list">
            <ul>
              <li>
                element 1<button>edit</button>
                <button>delete</button>
              </li>
            </ul>
          </div>

          <div className="mailing-list-editor-element-list">
            <ul>
              <li>
                element 2<button>edit</button>
                <button>delete</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
