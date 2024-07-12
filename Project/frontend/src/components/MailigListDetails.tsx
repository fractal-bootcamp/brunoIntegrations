import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { MailingList, Contact } from "../types"; // Adjust the import path as needed

interface MailingListDetailsProps {
  list: MailingList;
}

const MailingListDetails: React.FC<MailingListDetailsProps> = ({ list }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      const token = await getToken();
      const fetchedContacts = await Promise.all(
        list.emails.map(async (email) => {
          try {
            const response = await fetch(`/contact/${email}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (!response.ok) {
              throw new Error("Failed to fetch contact");
            }
            const data: Contact = await response.json();
            return data;
          } catch (error) {
            console.error(error);
            return null;
          }
        })
      );
      setContacts(
        fetchedContacts.filter((contact) => contact !== null) as Contact[]
      );
    };

    fetchContacts();
  }, [list.emails, getToken]);

  return (
    <div>
      <h3>{list.name}</h3>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id}>
            {contact.name} ({contact.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MailingListDetails;
