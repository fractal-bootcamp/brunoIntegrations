import React, { useState, useEffect } from 'react'
import { createNewContact } from '../api/mailService'
import type { Contact, MailingList } from '../../../shared/types/Types'
import { useAuth } from '@clerk/clerk-react'


const CreateContactForm: React.FC = () => {
    const [displayFormNewContact, setDisplayFormNewContact] = useState(false)
    const [displayFormNewList, setDisplayFormNewList] = useState(false)

    const [name, setName] = useState("");

    const [listName, setListName] = useState<string>("")
    const [emailsList, setEmailsList] = useState<MailingList[]>([])
    const [newList, setNewList] = useState<string[]>([])


    const [contactName, setContactName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [newContact, setNewContact] = useState<Object>({})

    const { getToken } = useAuth()

    const handleSubmitNewContact = async (event: React.FormEvent) => {

        event.preventDefault();

        // // Prepare the data to be sent to the backend: as a sort of declaration?
        // const newContact = {
        //     name,
        //     email,
        //     // mailingListIds: [currentMailingListId],  // Automatically include the current mailing list ID
        // };

        try {
            const token = await getToken();
            const newContact = await createNewContact(token, { name: contactName, email: email });
            setNewContact(newContact)

            alert('Contact created successfully');

            //Clear the form
            setContactName('')
            setEmail('')
        } catch (error) {
            console.error('Error creating contact:', error)
            alert('Failed to create contact')
        }
    }

    const handleSubmitNewList = async (event: React.FormEvent) => {

        event.preventDefault();

        try {
            const token = await getToken();
            const newList = await handleCreateNewList(token, { name: listName, emails: emailsList });
            setNewList(newList)

        } catch (error) {
            console.error('Error creating mailing list:', error)
            alert('Failed to create mailing list')
        }
    }
    const handleCreateNewContact = () => {

        setDisplayFormNewContact(!displayFormNewContact)
    }

    const handleCreateNewList = () => {
        setDisplayFormNewList(!displayFormNewList)
    }

    return (
        <>
            <button onClick={handleCreateNewList}>Create new mailing list</button>
            {displayFormNewList ? (
                <form onSubmit={handleSubmitNewList}>
                    <div>
                        <label>
                            Name: <input
                                type="text"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            E-mail: <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                    </div>
                    <button type="submit"> Create Contact</button>
                </form>

            ) : null}
            <button onClick={handleCreateNewContact}>Create new contact</button>
            {displayFormNewContact ? (
                <form onSubmit={handleSubmitNewContact}>
                    <div>
                        <label>
                            Name: <input
                                type="text"
                                value={contactName}
                                onChange={(e) => setContactName(e.target.value)}
                                required
                            />
                        </label>
                    </div>
                    <div>
                        <label>
                            E-mail: <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>

                    </div>
                    <button type="submit"> Create Contact</button>
                </form>

            ) : null}

        </>

    )
}

export default CreateContactForm;