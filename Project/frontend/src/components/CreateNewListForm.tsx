import React, { useState, useEffect } from "react";
import { createNewList } from "../api/mailService";
import type { Contact, MailingList } from "../../../shared/types/Types";
import { useAuth, useUser } from "@clerk/clerk-react";

const CreateListForm: React.FC = () => {
  const [displayFormNewList, setDisplayFormNewList] = useState(false);

  const [listName, setListName] = useState<string>("");
  const [emailsList, setEmailsList] = useState<string[]>([]);
  const [newList, setNewList] = useState<string[]>([]);
  const [email, setEmail] = useState<string>("");

  const { user } = useUser();
  const { getToken } = useAuth();

  const handleSubmitNewList = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const token = await getToken();
      const newList = await createNewList(token, {
        name: listName,
        emails: emailsList,
        authorId: user.id,
      });
      setNewList(newList);

      alert("Mailing list created successfully");

      // Clear the form
      setListName("");
      setEmailsList([]);
    } catch (error) {
      console.error("Error creating mailing list:", error);
      alert("Failed to create mailing list");
    }
  };

  const handleCreateNewList = () => {
    setDisplayFormNewList(!displayFormNewList);
  };

  const addEmailToList = () => {
    if (email) {
      setEmailsList([...emailsList, email]);
      setEmail("");
    }
  };

  const removeEmailFromList = (emailToRemove: string) => {
    setEmailsList(emailsList.filter((email) => email != emailToRemove));
  };

  return (
    <>
      <button onClick={handleCreateNewList}>Create new mailing list</button>
      {displayFormNewList ? (
        <form onSubmit={handleSubmitNewList}>
          <div>
            <label>
              Name:{" "}
              <input
                type="text"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <ol>
              {emailsList.map((item, index) => (
                <div key={index}>
                  <li>{item}</li>
                  <button
                    type="button"
                    onClick={() => removeEmailFromList(item)}
                  >
                    x
                  </button>
                </div>
              ))}
            </ol>
            <label>
              <button type="button" onClick={addEmailToList}>
                Add e-mail:
              </button>{" "}
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>
          <button type="submit"> Create List</button>
        </form>
      ) : null}
    </>
  );
};

export default CreateListForm;
