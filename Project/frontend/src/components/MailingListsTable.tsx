import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getAllMailingLists } from "../api/mailService"; // Adjust the import path as needed
import MailingListDetails from "./MailigListDetails";
import { MailingList } from "../../../shared/types/Types"; // Adjust the import path as needed

const MailingListsTable: React.FC = () => {
  const [mailingLists, setMailingLists] = useState<MailingList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedList, setSelectedList] = useState<MailingList | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchMailingLists = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const lists = await getAllMailingLists(token);
        if (lists) {
          setMailingLists(lists);
        } else {
          setError("Error fetching mailing lists");
        }
      } catch (err) {
        setError("Error fetching mailing lists");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMailingLists();
  }, [getToken]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Mailing Lists</h2>
      {selectedList ? (
        <MailingListDetails list={selectedList} />
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Emails</th>
              <th>Author ID</th>
              <th>Contacts</th>
              <th>Blasts</th>
            </tr>
          </thead>
          <tbody>
            {mailingLists.map((list) => (
              <tr key={list.id} onClick={() => setSelectedList(list)}>
                <td>{list.id}</td>
                <td>{list.name}</td>
                <td>
                  <ul>
                    {list.emails.map((email, index) => (
                      <li key={index}>{email}</li>
                    ))}
                  </ul>
                </td>
                <td>{list.author.id}</td>
                <td>{list.contacts.length} contacts</td>
                <td>{list.blasts.length} blasts</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MailingListsTable;
