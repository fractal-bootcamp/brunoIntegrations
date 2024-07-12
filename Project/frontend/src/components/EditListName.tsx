import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import styles from "./EditListName.module.css";
import { editList, editContact, getContactByEmail } from "../api/mailService";

interface EditListNameProps {
  listId: string;
  name: string;
  emails: string[];
  onNameChange?: (newName: string) => void;
  onListChange?: (newList: string[]) => void;
}

export default function EditListName({
  listId,
  name,
  emails,
}: EditListNameProps) {
  const [listName, setListName] = useState<string>(name);
  const [displayEdit, setDisplayEdit] = useState<boolean>(true);
  const [emailsList, setEmailsList] = useState<string[]>(emails);
  const [displayEditList, setDisplayEditList] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [fetchEmail, setFetchEmail] = useState("");
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
        id: listId,
        emails: emailsList,
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
    if (listName !== name && user) {
      try {
        const token = await getToken();
        const updatedList = await editList(token, {
          id: listId,
          name: listName,
          emails: emailsList,
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

  const handleEditContact = (email: string) => {
    const fetchEmail = async (emailToFetch: string) => {
      try {
        const token = await getToken();
        const result = await getContactByEmail(token, emailToFetch);
        console.log("Information of the email fetched to be edited", result);
        setFetchEmail(result);
      } catch (error) {
        console.log("Error fetching contact by email:", error);
      }
    };

    console.log("Email to edit:", email);
    setEditEmail(email);
    const fetched = fetchEmail(email); // Call the fetchEmail function here
    console.log("Email after fetched", fetched);
  };

  useEffect(() => {
    if (editEmail !== null) {
      console.log("Edit email updated:", editEmail);
    }
  }, [editEmail]);

  const handleSaveContact = async () => {
    console.log("Value processed that was stored at editEmail", editEmail);
    if (!editEmail || newEmail === "") return;

    try {
      const token = await getToken();
      await editContact(token, listId, editEmail, newEmail); // Pass the list ID
      setEmailsList(
        emailsList.map((email) => (email === editEmail ? newEmail : email))
      );
      setEditEmail(null);
      setNewEmail("");
      alert("Contact edited successfully!");
    } catch (error) {
      console.error("Error editing contact:", error);
      alert("Failed to edit contact");
    }
  };

  const handleDeleteContact = async (email: string) => {
    try {
      const token = await getToken();
      await editContact(token, listId, email, ""); // Assuming the function is modified to handle deletions as well
      setEmailsList(emailsList.filter((e) => e !== email));
      alert("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    }
  };

  return (
    <>
      <div className="mailing-list-editor-title-and-edit-btn">
        {displayEdit ? (
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
        <button onClick={handleEdit}>{displayEdit ? "Cancel" : "Edit"}</button>
      </div>

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
                    Edit Email
                  </button>
                  <button onClick={() => handleDeleteContact(item)}>
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ol>
        <button onClick={handleListChange}>
          {displayEditList ? "Save Changes" : "Edit List"}
        </button>
      </div>
    </>
  );
}
