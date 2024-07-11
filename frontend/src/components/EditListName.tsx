import React, { useState, useEffect } from "react";
import { MailingList } from "../../../shared/types/Types";
import { useAuth, useUser } from "@clerk/clerk-react";
import styles from "./EditListName.module.css";
import { string } from "prop-types";
import { editList } from "../api/mailService";

interface EditListNameProps {
  id: string;
  name: string;
  emails: string[];
  onNameChange?: (newName: string) => void;
}

export default function EditListName({
  id,
  name,
  emails,
  onNameChange,
}: EditListNameProps) {
  const [listName, setListName] = useState<string>(name);
  const [displayEdit, setDisplayEdit] = useState<boolean>(true);
  const { getToken } = useAuth();
  const { user } = useUser();

  const handleEdit = () => {
    setDisplayEdit(!displayEdit);
  };

  const handleNameChange = async () => {
    if (listName !== name && user) {
      try {
        const token = await getToken();
        const updatedList = await editList(token, {
          id,
          name: listName,
          emails, // Pass the current emails
          authorId: user.id,
        });

        onNameChange?.(updatedList.name);
        alert("List's name edited successfully!");
      } catch (error) {
        console.error("Error updating list name:", error);
        alert("Failed to update list name");
      }
    }
    handleEdit();
  };

  return (
    <div className="mailing-list-editor-title-and-edit-btn">
      {!displayEdit ? (
        <div>
          <input
            className={styles.listInput}
            type="text"
            value={listName}
            onChange={(e) => setListName(e.target.value)}
            onBlur={handleNameChange}
          />
        </div>
      ) : (
        <div>
          <input
            className={styles.listInput}
            type="text"
            value={listName}
            disabled
          />
        </div>
      )}
      <button onClick={handleEdit}>{displayEdit ? "Edit" : "Cancel"}</button>
    </div>
  );
}
