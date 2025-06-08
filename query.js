function loadData() {
    database.ref('users').orderByChild('timestamp').once('value')
    .then((snapshot) => {
        const dataBody = document.getElementById('dataBody');
        dataBody.innerHTML = '';
        
        snapshot.forEach((childSnapshot) => {
            const user = childSnapshot.val();
            const row = `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.city}</td>
                    <td>${user.gender}</td>
                    <td>${formatDate(user.timestamp)}</td>
                    <td><button class="btn-delete" data-id="${childSnapshot.key}">حذف</button></td>
                </tr>
            `;
            dataBody.innerHTML += row;
        });
        
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', function() {
                if (confirm('هل تريد الحذف؟')) {
                    database.ref('users/' + this.getAttribute('data-id')).remove()
                    .then(() => loadData());
                }
            });
        });
    });
}

window.addEventListener('DOMContentLoaded', loadData);
document.getElementById('searchBtn').addEventListener('click', loadData);
document.getElementById('clearBtn').addEventListener('click', () => {
    document.getElementById('searchInput').value = '';
    document.getElementById('cityFilter').value = '';
    loadData();
});
