function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const content = document.querySelector(".content");
    sidebar.classList.toggle("collapsed");
    content.classList.toggle("collapsed");
}
const collapseElement = document.getElementById('submenuCadastros');
const toggleIcon = collapseElement.closest('.nav-item').querySelector('.toggle-icon');

collapseElement.addEventListener('show.bs.collapse', function () {
    toggleIcon.classList.remove('fa-angle-down');
    toggleIcon.classList.add('fa-angle-up');
});

collapseElement.addEventListener('hide.bs.collapse', function () {
    toggleIcon.classList.remove('fa-angle-up');
    toggleIcon.classList.add('fa-angle-down');
});
