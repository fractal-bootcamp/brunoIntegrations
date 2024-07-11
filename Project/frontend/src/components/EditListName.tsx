import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import styles from "./EditListName.module.css";
import { editList, deleteContact, editContact } from "../api/mailService";

const dummyList = {
  id: "clyhpyhy9001p4z0c8za3c1xk",
  name: "Test Mailing List",
  emails: ["email1@example.com", "email2@example.com", "email3@example.com"],
};

export default function EditListName() {
  const [listName, setListName] = useState<string>(dummyList.name);
  const [displayEdit, setDisplayEdit] = useState<boolean>(true);

  const [emailsList, setEmailsList] = useState<string[]>(dummyList.emails);
  const [displayEditList, setDisplayEditList] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {}, []);

  const handleEdit = () => {
    setDisplayEdit(!displayEdit);
  };

  const handleEditList = () => {
    setDisplayEditList(!displayEditList);
  };

  const handleListChange = async () => {
    try {
      const token = await getToken();
      const updatedList = await editList(token, {
        id: dummyList.id,
        emails: emailsList, // Pass the current emails
      });

      setDisplayEditList(updatedList);
      alert("List's contact edited successfully!");
    } catch (error) {
      console.error("Error updating email list:", error);
      alert("Failed to edit email");
    }
    handleEditList();
  };

  const handleNameChange = async () => {
    if (listName !== dummyList.name && user) {
      try {
        const token = await getToken();
        const updatedList = await editList(token, {
          id: dummyList.id,
          name: listName,
          emails: emailsList, // Pass the current emails
          authorId: user.id,
        });

        alert("List's name edited successfully!");
      } catch (error) {
        console.error("Error updating list name:", error);
        alert("Failed to update list name");
      }
    }
    handleEdit();
  };

  const handleDeleteContact = async (email: string) => {
    try {
      const token = await getToken();
      const deletedEmail = await deleteContact(token, email);

      if (deletedEmail) {
        setEmailsList(emailsList.filter((item) => item !== email));
        alert("Contact deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    }
  };

  const handleEditContact = (email: string) => {
    setEditEmail(email);
    setNewEmail(email);
  };

  const handleSaveContact = async () => {
    if (!editEmail || newEmail === "") return;

    try {
      const token = await getToken();
      const updatedContact = await editContact(token, editEmail, newEmail);

      if (updatedContact) {
        setEmailsList(
          emailsList.map((email) => (email === editEmail ? newEmail : email))
        );
        setEditEmail(null);
        setNewEmail("");
        alert("Contact edited successfully!");
      }
    } catch (error) {
      console.error("Error editing contact:", error);
      alert("Failed to edit contact");
    }
  };

  return (
    <>
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

      <div>
        {!displayEditList ? (
          <div>
            <h3>Emails in this list:</h3>
            <ol>
              {emailsList.map((item, index) => (
                <li key={index}>
                  {editEmail === item ? (
                    <>
                      <input
                        type="text"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                      />
                      <button onClick={handleSaveContact}>Save</button>
                    </>
                  ) : (
                    <>
                      {item}
                      <button onClick={() => handleEditContact(item)}>
                        Edit
                      </button>
                      <button onClick={() => handleDeleteContact(item)}>
                        Delete
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ol>
            <button onClick={handleEditList}>
              {displayEditList ? "Edit Contacts" : "Cancel"}
            </button>
          </div>
        ) : (
          <div>
            <button onClick={handleEditList}>
              {displayEditList ? "Edit Contacts" : "Cancel"}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
