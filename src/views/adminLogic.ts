
const buttons = Array.from(document.getElementsByTagName('button'));

const validateOrganizer = (id: any, status: any) => {
  if (status === 'accepted') { return;}
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
const deleteOrganizer = (id: any) => {
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
      if (button.dataset.action === 'validate') {
        validateOrganizer(button.dataset.id, button.dataset.status);
      }
      if (button.dataset.action === 'delete') {
        deleteOrganizer(button.dataset.id);
      }
    })
})
