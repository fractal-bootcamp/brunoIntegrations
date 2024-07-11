import React, { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getAllMailingLists } from "../api/mailService";
import { MailingList } from "../../../shared/types/Types";
import EditListName from "./EditListName";

export default function ListsDisplay() {
  const [lists, setList] = useState<MailingList[]>([]);
  const [visible, setVisible] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [listVisible, setListVisible] = useState(false);
  const [oneListVisible, setOneListVisible] = useState(false);
  const [selectedListIndex, setSelectedListIndex] = useState<number | null>(
    null
  );
  const [valueArray, setValueArray] = useState<number[]>([]);

  const getToken = useAuth().getToken;

  const handleDisplayListsByName = async () => {
    try {
      const token = await getToken();
      const mailingList = await getAllMailingLists(token);
      setList(mailingList);
      const indexArray = mailingList.map((_, index) => index);
      setValueArray(indexArray);
    } catch (error) {
      console.log("Error fetching mailing lists by name:", error);
    }

    setVisible(!visible);
  };

  if (lists === null) {
    return <div>Loading...</div>;
  }

  const handleDisplayIndividualList = (index: number) => {
    const list = lists[index];
    const { emails } = list;
    setSelectedList(emails);
    setOneListVisible(!oneListVisible);
    setSelectedListIndex(index);
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
                {listVisible && (
                  <ul>
                    {selectedList.map((email) => (
                      <li key={email}>{email}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
        {selectedListIndex !== null && (
          <EditListName arrayIndex={selectedListIndex} lists={lists} />
        )}
      </div>
    </>
  );
}
