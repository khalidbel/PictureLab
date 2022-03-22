// handeling interface logic 

const adjustmentsDiv = document.querySelector('#adjustments');
const filtersDiv = document.querySelector('#filters');


adjustmentsDiv.addEventListener('click', () => {
    adjustmentsDiv.closest('.sidebar-editing-list-container').classList.toggle('open');
    filtersDiv.closest('.sidebar-editing-list-container').classList.toggle('hidden');
} );

filtersDiv.addEventListener('click', () => {
    filtersDiv.closest('.sidebar-editing-list-container').classList.toggle('open');
    adjustmentsDiv.closest('.sidebar-editing-list-container').classList.toggle('hidden');
} );