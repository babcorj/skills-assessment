const EMAIL = "email"
const PHONE = "phone"

function getAddressAsHTML(address) {
    return `<p>${address.line1}</p><p>${address.city} ${address.state} ${address.zip}</p>`
}

/**
 * Inserts individual contact into the DOM
 * @param {*} contact The contact to add
 * @param {*} contactType 'email' or 'phone'
 * @param {*} odd The row position
 */
function addContact(contact, contactType, odd) {
    // Create elements
    const contactWrapper = document.createElement('div')
    const nameStatusWrapper = document.createElement('div')
    const statusEle = document.createElement('div')
    const nameEle = document.createElement('div')
    const contactAddressWrapper = document.createElement('div')
    const contactAddressEle = document.createElement('div')
    const contactDetailsEle = document.createElement('div')
    // Set classes
    contactWrapper.className = 'contact-wrapper'
    nameStatusWrapper.className = 'name-status-wrapper'
    contactAddressWrapper.className = 'contact-address-wrapper'
    nameEle.className = 'name'
    contactAddressEle.className = 'contact-address'
    contactDetailsEle.className = 'address-details'

    // Add contact data to elements
    nameEle.textContent = contact.name
    contactAddressEle.textContent = contact[contactType]
    statusEle.className = `status ${contact.status}`
    contactDetailsEle.innerHTML = getAddressAsHTML(contact.address)

    // Set ids based on contact key
    contactWrapper.id = `contact-${contact.id}`
    nameStatusWrapper.id = `contact-name-status-${contact.id}`
    contactAddressEle.id = `contact-address-${contact.id}`
    contactDetailsEle.id = `address-details-${contact.id}`

    if (odd) {
        contactWrapper.className += " dark-row"
    }

    // Add name and status elements to name/status wrapper
    nameStatusWrapper.appendChild(statusEle)
    nameStatusWrapper.appendChild(nameEle)
    // Add phone/email and address details elements to address wrapper
    contactAddressWrapper.appendChild(contactAddressEle)
    contactAddressWrapper.appendChild(contactDetailsEle)
    // Add wrappers to contact wrapper
    contactWrapper.appendChild(nameStatusWrapper)
    contactWrapper.appendChild(contactAddressWrapper)

    contactWrapper.addEventListener('click', () => {
        toggleContactDetails(contact.id)
    })

    document.getElementById('contacts').appendChild(contactWrapper)
}

/**
 * Main import function for contacts widget
 * @param {*} contacts JSON representation of contacts
 * @param {*} contactType The initial display ("email" || "phone")
 */
function importContacts(contacts, contactType) {
    let i = 0;
    contacts.map(contact => addContact(contact, contactType, (i++ % 2 === 1)))
}

// Updates the contact's contact type ("email" || "phone")
function updateContactType(contact, contactType) {
    const contactAddressEle = document.getElementById(`contact-address-${contact.id}`)
    contactAddressEle.textContent = contact[contactType]
}

// Checks display type selectlist for current selection 
function getContactType() {
    const emailOption = document.getElementById("email")
    const phoneOption = document.getElementById("phone")

    if (emailOption.selected) {
        return EMAIL
    } else if (phoneOption.selected) {
        return PHONE
    }
}

// Updates every contact's contact type
function updateContactTypes(contacts) {
    const contactType = getContactType()

    if (contactType === EMAIL) {
        contacts.map(contact => updateContactType(contact, EMAIL))
    } else if (contactType === PHONE) {
        contacts.map(contact => updateContactType(contact, PHONE))
    }
}

// Get contact type ("email" | "phone") from contact based on current selection
function getContactAddress(id) {
    const contact = data.find(contact => contact.id == id)
    const contactType = getContactType()
    return contact[contactType]
}

// Gets email link for contact
function getEmailLink(id) {
    const contact = data.find(contact => contact.id == id)
    return `<a href="mailto:${contact.email}">${contact.email}</a>`
}

/**
 * Displays address details and email link for specified contact when no other
 * contact is active. If a contact is in an active state, it will be deactivated.
 * @param {*} contactId Contact key for target contact
 */
function toggleContactDetails(contactId = null) {
    const contactsEle = document.getElementById(`contacts`)

    // If active, remove active state ("darken" is only added when active)
    if (contactsEle.className.indexOf("darken") !== -1) {
        const activeList = document.getElementsByClassName('active')

        for (ele of activeList) {
            ele.classList.remove("active")
            const id = ele.id.split(/[-]/)[1]
            const contactAddressEle = document.getElementById(`contact-address-${id}`)
            contactAddressEle.textContent = getContactAddress(id)
        }

        contactsEle.classList.remove("darken")

        return
    }
    else if (contactId == null) {
        return
    }

    const contactEle = document.getElementById(`contact-${contactId}`)
    // Do nothing if contact is already active
    if (contactEle.className.indexOf("active") !== -1) {
        return
    }

    const contactAddressEle = document.getElementById(`contact-address-${contactId}`)

    contactEle.className += " active"
    contactsEle.className += " darken"
    contactAddressEle.innerHTML = getEmailLink(contactId)
}


importContacts(data, EMAIL);