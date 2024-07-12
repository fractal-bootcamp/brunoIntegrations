import React, { useState, useEffect } from "react";
import { createNewList, getList, updateList } from "../api/mailService";
import type { Contact, MailingList } from "../../../shared/types/Types";
import { useAuth, useUser } from "@clerk/clerk-react";
import CreateContactForm from "./CreateContactForm";

const ModifyListForm: React.FC<{ listId?: string }> = ({ listId }) => {
  const [listName, setListName] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const { user } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (listId) {
      fetchList();
    }
  }, [listId]);

  const fetchList = async () => {
    try {
      const token = await getToken();
      const list = await getList(token, listId);
      setListName(list.name);
      setContacts(list.contacts);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const token = await getToken();
      const updatedList = await updateList(token, listId, {
        name: listName,
        contacts: contacts,
      });
      alert("Mailing list updated successfully");
    } catch (error) {
      console.error("Error updating mailing list:", error);
      alert("Failed to update mailing list");
    }
  };

  const handleContactUpdate = (updatedContact: Contact) => {
    setContacts(
      contacts.map((c) => (c.id === updatedContact.id ? updatedContact : c))
    );
    setSelectedContact(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
        placeholder="List Name"
        required
      />

      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} onClick={() => setSelectedContact(contact)}>
            {contact.name} ({contact.email})
          </li>
        ))}
      </ul>

      {selectedContact && (
        <CreateContactForm
          contact={selectedContact}
          onUpdateContact={handleContactUpdate}
        />
      )}

      <button type="submit">Save List</button>
    </form>
  );
};

export default ModifyListForm;
