import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import styles from "./EditListName.module.css";
import {
  editList,
  deleteContact,
  editContact,
  getList,
} from "../api/mailService";
import { MailingList } from "../../../shared/types/Types";

interface EditListNameProps {
  arrayIndex: number;
  lists: MailingList[];
}

export default function EditListName({ arrayIndex, lists }: EditListNameProps) {
  const [listName, setListName] = useState<string>("");
  const [displayEdit, setDisplayEdit] = useState<boolean>(false);
  const [emailsList, setEmailsList] = useState<string[]>([]);
  const [displayEditList, setDisplayEditList] = useState<boolean>(false);
  const [editEmail, setEditEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const { user } = useUser();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setIsLoading(true);
        const list = lists[arrayIndex];
        setListName(list.name);
        setEmailsList(list.emails);
      } catch (err) {
        setError("Failed to fetch list data");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchList();
  }, [arrayIndex, lists]);

  const handleEdit = () => {
    setDisplayEdit(!displayEdit);
  };

  const handleEditList = () => {
    setDisplayEditList(!displayEditList);
  };

  const handleListChange = async () => {
    try {
      const token = await getToken();
      await editList(token, {
        id: lists[arrayIndex].id,
        emails: emailsList,
      });

      setDisplayEditList(false);
      alert("List's contacts edited successfully!");
    } catch (error) {
      console.error("Error updating email list:", error);
      alert("Failed to edit email");
    }
  };

  const handleNameChange = async () => {
    if (user) {
      try {
        const token = await getToken();
        await editList(token, {
          id: lists[arrayIndex].id,
          name: listName,
          emails: emailsList,
          authorId: user.id,
        });

        setDisplayEdit(false);
        alert("List's name edited successfully!");
      } catch (error) {
        console.error("Error updating list name:", error);
        alert("Failed to update list name");
      }
    }
  };

  const handleDeleteContact = async (email: string) => {
    try {
      const token = await getToken();
      await deleteContact(token, email);
      setEmailsList(emailsList.filter((item) => item !== email));
      alert("Contact deleted successfully!");
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
      await editContact(token, editEmail, newEmail);
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

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
