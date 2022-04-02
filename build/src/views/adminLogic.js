"use strict";
const buttons = Array.from(document.getElementsByTagName('button'));
const validateOrganizer = (id, status) => {
    if (status === 'accepted') {
        return;
    }
    fetch("/api/admin/organizer", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id, status: 'accepted' }),
    }).then(() => {
        window.location.reload();
    });
};
const deleteOrganizer = (id) => {
    fetch("/api/admin/organizer", {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id, status: 'rejected' }),
    }).then(() => {
        window.location.reload();
    });
};
buttons.forEach(button => {
    button.addEventListener('click', () => {
        console.log(button.dataset.id);
        console.log(button.dataset.action);
        console.log(button.dataset.status);
        if (button.dataset.action === 'validate') {
            validateOrganizer(button.dataset.id, button.dataset.status);
        }
        if (button.dataset.action === 'delete') {
            deleteOrganizer(button.dataset.id);
        }
    });
});
//# sourceMappingURL=adminLogic.js.map