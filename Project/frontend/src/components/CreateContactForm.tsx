import React, { useState, useEffect } from 'react'
import { createNewContact } from '../api/mailService'
import type { Contact, MailingList } from '../../../shared/types/Types'
import { useAuth } from '@clerk/clerk-react'


const CreateContactForm: React.FC = () => {
    const [name, setName] = useState("");
    // const [listName, setListName] = useState<string>("")
    // const [list, setList] = useState<MailingList[]>([])

    const [contactName, setContactName] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [newContact, setNewContact] = useState<Object>({})

    const { getToken } = useAuth()

    const handleSubmit = async (event: React.FormEvent) => {

        event.preventDefault();

        // Prepare the data to be sent to the backend: as a sort of declaration?
        const newContact = {
            name,
            email,
            // mailingListIds: [currentMailingListId],  // Automatically include the current mailing list ID
        };

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

    // function addNewContact() {

    // }

    return (
        <>
            <form onSubmit={handleSubmit}>
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
        </>

    )
}

export default CreateContactForm;