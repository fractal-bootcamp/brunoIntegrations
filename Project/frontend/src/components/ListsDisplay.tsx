import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getAllMailingLists } from "../api/mailService";
import { MailingList } from "../../../shared/types/Types";
import EditListName from "./EditListName";

export default function ListsDisplay() {
  const [lists, setList] = useState<MailingList[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedListIndex, setSelectedListIndex] = useState<number | null>(
    null
  );
  const [listIds, setListIds] = useState<string[]>([]);

  const getToken = useAuth().getToken;

  const handleDisplayListsByName = async () => {
    try {
      const token = await getToken();
      const mailingList = await getAllMailingLists(token);
      setList(mailingList);
      console.log("Fetched Lists", mailingList); // Debug: Log the IDs

      const idsArray = mailingList.map((list) => list.id);
      console.log("Fetched List IDs:", idsArray); // Debug: Log the IDs
      setListIds(idsArray);
      setVisible(true);
    } catch (error) {
      console.log("Error fetching mailing lists by name:", error);
    }
  };

  const handleDisplayIndividualList = (index: number) => {
    setSelectedListIndex(index);
    console.log("Selected", index);
    setVisible(false);
  };

  return (
    <>
      <div>
        <button onClick={handleDisplayListsByName}>See all lists</button>
        {visible && (
          <ul>
            {lists.map((list, index) => (
              <li key={list.id}>
                <button onClick={() => handleDisplayIndividualList(index)}>
                  {list.name}
                </button>
              </li>
            ))}
          </ul>
        )}
        {selectedListIndex !== null && (
          <EditListName
            listId={lists[selectedListIndex].id}
            name={lists[selectedListIndex].name}
            emails={lists[selectedListIndex].emails}
          />
        )}
      </div>
    </>
  );
}
